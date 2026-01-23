import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TablesService {
  constructor(private prisma: PrismaService) {}

  async create(createTableDto: {
    number: number;
    organizationId: string;
    tenantId: string;
  }) {
    return this.prisma.table.create({
      data: {
        number: createTableDto.number,
        organizationId: createTableDto.organizationId,
        tenantId: createTableDto.tenantId,
      },
    });
  }

  async findAll(tenantId: string) {
    return this.prisma.table.findMany({
      where: {
        tenantId,
      },
      orderBy: {
        number: 'asc',
      },
      include: {
        _count: {
          select: { orders: { where: { status: 'PENDING' } } },
        },
      },
    });
  }

  async remove(id: string, tenantId: string) {
    // Ensure the table belongs to the tenant
    const table = await this.prisma.table.findFirst({
      where: { id, tenantId },
    });

    if (!table) {
      throw new NotFoundException('Mesa não encontrada ou acesso negado.');
    }

    return this.prisma.table.delete({
      where: { id },
    });
  }
}
