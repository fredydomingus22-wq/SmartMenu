import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateDeliveryDto } from './dto/create-delivery.dto';
import { UpdateDeliveryDto } from './dto/update-delivery.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { SupabaseService } from '../../common/supabase.service';

@Injectable()
export class DeliveryService {
  constructor(
    private prisma: PrismaService,
    private supabase: SupabaseService,
  ) {}

  async create(createDeliveryDto: CreateDeliveryDto) {
    const { orderId, latitude, longitude } = createDeliveryDto;

    // 1. Check if order exists and is ready for delivery
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { deliveryAssignment: true },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

    if (order.deliveryAssignment) {
      throw new BadRequestException(
        `Order ${orderId} already has a delivery assignment`,
      );
    }

    // 2. Find nearest available rider
    const availableRiders = await this.findAvailableRiders(latitude, longitude);

    if (availableRiders.length === 0) {
      throw new NotFoundException('No available riders found in your area');
    }

    const nearestRider = availableRiders[0]; // Simple logical assignment for v1

    // 3. Create Assignment
    const assignment = await this.prisma.deliveryAssignment.create({
      data: {
        orderId,
        riderId: nearestRider.id,
        status: 'ASSIGNED',
        distance: nearestRider.distance, // Store initial distance
      },
    });

    // 4. Update Rider Status
    await this.prisma.rider.update({
      where: { id: nearestRider.id },
      data: { status: 'BUSY' },
    });

    // 5. Broadcast Event
    await this.supabase.broadcast(
      `deliveries:${order.tenantId}`,
      'DELIVERY_ASSIGNED',
      assignment,
    );

    return assignment;
  }

  async findAvailableRiders(lat: number, lng: number, radiusKm: number = 10) {
    // Fetch all available riders (for v1, we filter in memory if dataset is small,
    // or use raw query for PostGIS/Haversine if available using Prisma)
    // Here we simulate with in-memory filtering for simplicity in this MVP phase

    // Note: In production with many riders, use PostGIS or a raw SQL query with Haversine.
    const riders = await this.prisma.rider.findMany({
      where: { status: 'AVAILABLE' },
    });

    return riders
      .map((rider) => {
        if (!rider.currentLat || !rider.currentLng) return null;
        const distance = this.calculateDistance(
          lat,
          lng,
          rider.currentLat,
          rider.currentLng,
        );
        return { ...rider, distance };
      })
      .filter(
        (rider): rider is any => rider !== null && rider.distance <= radiusKm,
      )
      .sort((a, b) => a.distance - b.distance);
  }

  private calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ): number {
    const R = 6371; // Radius of the earth in km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) *
        Math.cos(this.deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  async findAll() {
    return this.prisma.deliveryAssignment.findMany({
      include: { rider: true, order: true },
    });
  }

  async findOne(id: number) {
    // The ID in controller is string/UUID, but scaffolded as number.
    // We expect UUID so we will cast or fix controller.
    return `This action returns a #${id} delivery`;
  }

  async findOneByUuid(id: string) {
    return this.prisma.deliveryAssignment.findUnique({
      where: { id },
      include: { rider: true, order: true },
    });
  }

  async update(id: number, updateDeliveryDto: UpdateDeliveryDto) {
    return `This action updates a #${id} delivery`;
  }

  async updateStatus(id: string, updateDeliveryDto: UpdateDeliveryDto) {
    // Logic for status updates (PICKED_UP, DELIVERED)
    const updatedAssignment = await this.prisma.deliveryAssignment.update({
      where: { id },
      data: updateDeliveryDto,
      include: { order: true },
    });

    if (updatedAssignment.order) {
      await this.supabase.broadcast(
        `deliveries:${updatedAssignment.order.tenantId}`,
        'DELIVERY_STATUS_UPDATED',
        updatedAssignment,
      );
    }

    return updatedAssignment;
  }

  async remove(id: number) {
    return `This action removes a #${id} delivery`;
  }
}
