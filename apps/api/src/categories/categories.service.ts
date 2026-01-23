import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  create(
    createCategoryDto: CreateCategoryDto,
    tenantId: string,
    organizationId: string,
  ) {
    return this.prisma.category.create({
      data: {
        ...createCategoryDto,
        tenantId,
        organizationId,
      },
    });
  }

  findAll(tenantId: string, organizationId: string) {
    return this.prisma.category.findMany({
      where: { tenantId, organizationId },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });
  }

  findOne(id: string, tenantId: string, organizationId: string) {
    return this.prisma.category.findFirst({
      where: { id, tenantId, organizationId },
      include: { products: true },
    });
  }

  update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
    tenantId: string,
    organizationId: string,
  ) {
    return this.prisma.category.updateMany({
      where: { id, tenantId, organizationId },
      data: updateCategoryDto,
    });
  }

  remove(id: string, tenantId: string, organizationId: string) {
    return this.prisma.category.deleteMany({
      where: { id, tenantId, organizationId },
    });
  }
}
