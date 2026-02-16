import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private normalizeJson(value: any): any {
    if (!value) return value;
    if (typeof value === 'string') {
      return { pt: value };
    }
    return value;
  }

  async create(
    createCategoryDto: CreateCategoryDto,
    tenantId: string,
    organizationId: string,
  ) {
    // Verify organization exists to prevent foreign key errors
    const organization = await this.prisma.organization.findUnique({
      where: { id: organizationId },
    });

    if (!organization) {
      throw new Error(`Organization with ID ${organizationId} not found`);
    }

    return this.prisma.category.create({
      data: {
        ...createCategoryDto,
        name: this.normalizeJson(createCategoryDto.name),
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
      data: {
        ...updateCategoryDto,
        name: this.normalizeJson(updateCategoryDto.name),
      },
    });
  }

  remove(id: string, tenantId: string, organizationId: string) {
    return this.prisma.category.deleteMany({
      where: { id, tenantId, organizationId },
    });
  }
}
