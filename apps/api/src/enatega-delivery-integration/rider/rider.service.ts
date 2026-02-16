import { Injectable, ConflictException } from '@nestjs/common';
import { CreateRiderDto } from './dto/create-rider.dto';
import { UpdateRiderDto } from './dto/update-rider.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { SupabaseService } from '../../common/supabase.service';

@Injectable()
export class RiderService {
  constructor(
    private prisma: PrismaService,
    private supabase: SupabaseService,
  ) {}

  async create(createRiderDto: CreateRiderDto) {
    const existingRider = await this.prisma.rider.findFirst({
      where: {
        OR: [{ email: createRiderDto.email }, { phone: createRiderDto.phone }],
      },
    });

    if (existingRider) {
      throw new ConflictException(
        'Rider with this email or phone already exists',
      );
    }

    return this.prisma.rider.create({
      data: {
        ...createRiderDto,
        status: 'OFFLINE',
      },
    });
  }

  async findAll() {
    return this.prisma.rider.findMany();
  }

  async findOne(id: string) {
    return this.prisma.rider.findUnique({ where: { id } });
  }

  async findMyJobs(riderId: string) {
    return this.prisma.deliveryAssignment.findMany({
      where: {
        riderId,
        status: { in: ['ASSIGNED', 'PICKED_UP', 'IN_TRANSIT'] },
      },
      include: { order: true },
    });
  }

  async update(id: string, updateRiderDto: UpdateRiderDto) {
    const updatedRider = await this.prisma.rider.update({
      where: { id },
      data: updateRiderDto,
    });

    // If location or status was updated, broadcast it
    if (
      updateRiderDto.currentLat ||
      updateRiderDto.currentLng ||
      updateRiderDto.status
    ) {
      await this.supabase.broadcast(
        `riders:${id}`,
        'RIDER_UPDATE',
        updatedRider,
      );

      // Also broadcast to tenant deliveries channel if needed,
      // but for v1, listeners can subscribe to the specific rider.
    }

    return updatedRider;
  }

  async remove(id: string) {
    return this.prisma.rider.delete({ where: { id } });
  }
}
