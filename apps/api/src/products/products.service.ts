import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) { }

  async create(
    createProductDto: CreateProductDto,
    tenantId: string,
    organizationId: string,
  ) {
    if (!tenantId || !organizationId) {
      throw new Error('Tenant or Organization ID missing in request');
    }

    const { images, options, ...data } = createProductDto;

    return this.prisma.product.create({
      data: {
        ...data,
        tenantId,
        organizationId,
        images: {
          create: (images || []).map((url, index) => ({
            url,
            order: index,
          })),
        },
        options: {
          create: (options || []).map((opt) => ({
            name: opt.name,
            description: opt.description,
            minChoices: opt.minChoices || 0,
            maxChoices: opt.maxChoices || 1,
            isRequired: opt.isRequired || false,
            tenantId,
            organizationId,
            values: {
              create: (opt.values || []).map((v) => ({
                name: v.name,
                price: v.price || 0,
                isAvailable: v.isAvailable ?? true,
                tenantId,
                organizationId,
              })),
            },
          })),
        },
      },
      include: {
        images: true,
        options: {
          include: { values: true },
        },
      },
    });
  }

  findAll(tenantId: string, organizationId: string, categoryId?: string) {
    return this.prisma.product.findMany({
      where: {
        tenantId,
        organizationId,
        ...(categoryId ? { categoryId } : {}),
      },
      include: {
        category: true,
        images: true,
      },
    });
  }

  findOne(id: string, tenantId: string, organizationId: string) {
    return this.prisma.product.findFirst({
      where: { id, tenantId, organizationId },
      include: {
        category: true,
        images: true,
        options: {
          include: { values: true },
        },
      },
    });
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
    tenantId: string,
    organizationId: string,
  ) {
    const { categoryId, images, options, ...data } = updateProductDto;

    // Use transaction to ensure both operations succeed
    return this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // If images are provided, we replace the gallery
      if (images) {
        await tx.productImage.deleteMany({
          where: { productId: id },
        });
      }

      if (options) {
        // Simple replace for options too
        await tx.productOption.deleteMany({
          where: { productId: id },
        });
      }

      return tx.product.update({
        where: { id, tenantId, organizationId },
        data: {
          ...data,
          ...(categoryId ? { categoryId } : {}),
          ...(images
            ? {
              images: {
                create: images.map((url, index) => ({
                  url,
                  order: index,
                })),
              },
            }
            : {}),
          ...(options
            ? {
              options: {
                create: options.map((opt) => ({
                  name: opt.name,
                  description: opt.description,
                  minChoices: opt.minChoices,
                  maxChoices: opt.maxChoices,
                  isRequired: opt.isRequired,
                  tenantId,
                  organizationId,
                  values: {
                    create: opt.values.map((v) => ({
                      name: v.name,
                      price: v.price,
                      isAvailable: v.isAvailable ?? true,
                      tenantId,
                      organizationId,
                    })),
                  },
                })),
              },
            }
            : {}),
        },
        include: {
          images: true,
          options: {
            include: { values: true },
          },
        },
      });
    });
  }

  async remove(id: string, tenantId: string, organizationId: string) {
    return this.prisma.product.delete({
      where: { id, tenantId, organizationId },
    });
  }

  // ============ Product Options ============

  async createOption(
    productId: string,
    data: {
      name: string;
      description?: string;
      minChoices?: number;
      maxChoices?: number;
      isRequired?: boolean;
      values?: { name: string; price?: number; isAvailable?: boolean }[];
    },
    tenantId: string,
    organizationId: string,
  ) {
    const { values, ...optionData } = data;
    return this.prisma.productOption.create({
      data: {
        ...optionData,
        productId,
        tenantId,
        organizationId,
        values: {
          create: values?.map((v) => ({
            name: v.name,
            price: v.price || 0,
            isAvailable: v.isAvailable ?? true,
            tenantId,
            organizationId,
          })),
        },
      },
      include: { values: true },
    });
  }

  async findOptions(
    productId: string,
    tenantId: string,
    organizationId: string,
  ) {
    return this.prisma.productOption.findMany({
      where: { productId, tenantId, organizationId },
      include: { values: true },
      orderBy: { createdAt: 'asc' },
    });
  }

  async removeOption(
    optionId: string,
    tenantId: string,
    organizationId: string,
  ) {
    return this.prisma.productOption.delete({
      where: { id: optionId, tenantId, organizationId },
    });
  }
}
