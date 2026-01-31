import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateServiceRequestDto } from './dto/create-service-request.dto';
import { ServiceRequestStatus } from '@prisma/client';

@Injectable()
export class ServiceRequestsService {
  constructor(private prisma: PrismaService) {}

  async create(tenantId: string, dto: CreateServiceRequestDto) {
    // Look up organizationId from tenantId
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
      select: { organizationId: true },
    });

    if (!tenant) {
      throw new Error('Tenant not found');
    }

    return this.prisma.serviceRequest.create({
      data: {
        tenantId,
        organizationId: tenant.organizationId,
        type: dto.type,
        tableId: dto.tableId,
        status: ServiceRequestStatus.PENDING,
      },
    });
  }

  async findAllActive(tenantId: string) {
    return this.prisma.serviceRequest.findMany({
      where: {
        tenantId,
        status: ServiceRequestStatus.PENDING,
      },
      include: {
        table: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async markAsCompleted(id: string, tenantId: string) {
    return this.prisma.serviceRequest.updateMany({
      where: {
        id,
        tenantId, // Security: Ensure it belongs to the tenant
      },
      data: {
        status: ServiceRequestStatus.COMPLETED,
      },
    });
  }
}
