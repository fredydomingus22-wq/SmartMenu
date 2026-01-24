import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) { }

  private normalizeJson(value: Prisma.JsonValue | string | undefined): Prisma.JsonValue {
    if (!value) return null;
    if (typeof value === 'string') {
      return { pt: value };
    }
    return value as Prisma.JsonValue;
  }

  async create(
    createProductDto: CreateProductDto,
    tenantId: string,
    organizationId: string,
  ): Promise<any> { // TODO: Define exact return type if needed, or use Prisma.ProductGetPayload
    if (!tenantId || !organizationId) {
      throw new Error('Tenant or Organization ID missing in request');
    }

    const { images, options, upsells, recommendations, ...data } =
      createProductDto;

    return this.prisma.product.create({
      data: {
        ...data,
        name: this.normalizeJson(data.name),
        description: this.normalizeJson(data.description),
        tenantId,
        organizationId,
        images: {
          create: (images || []).map((url, index) => ({
            url,
            order: index,
          })),
        },
        upsells: {
          create: (upsells || []).map((upsellId) => ({
            upsellId,
            tenantId,
          })),
        },
        recommendations: {
          create: (recommendations || []).map((recommendedId) => ({
            recommendedId,
            tenantId,
          })),
        },
        options: {
          create: (options || []).map((opt) => ({
            name: this.normalizeJson(opt.name),
            description: this.normalizeJson(opt.description),
            minChoices: opt.minChoices || 0,
            maxChoices: opt.maxChoices || 1,
            isRequired: opt.isRequired || false,
            tenantId,
            organizationId,
            values: {
              create: (opt.values || []).map((v) => ({
                name: this.normalizeJson(v.name),
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
  ): Promise<any> {
    const { categoryId, images, options, upsells, recommendations, ...data } =
      updateProductDto;

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

      if (upsells) {
        await tx.productUpsell.deleteMany({
          where: { productId: id },
        });
      }
      if (recommendations) {
        await tx.productRecommendation.deleteMany({
          where: { productId: id },
        });
      }

      return tx.product.update({
        where: { id, tenantId, organizationId },
        data: {
          ...data,
          name: this.normalizeJson(data.name as Prisma.JsonValue),
          description: this.normalizeJson(data.description as Prisma.JsonValue),
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
          ...(upsells
            ? {
              upsells: {
                create: upsells.map((upsellId) => ({
                  upsellId,
                  tenantId,
                })),
              },
            }
            : {}),
          ...(recommendations
            ? {
              recommendations: {
                create: recommendations.map((recommendedId) => ({
                  recommendedId,
                  tenantId,
                })),
              },
            }
            : {}),
          ...(options
            ? {
              options: {
                create: options.map((opt) => ({
                  name: this.normalizeJson(opt.name),
                  description: this.normalizeJson(opt.description),
                  minChoices: opt.minChoices,
                  maxChoices: opt.maxChoices,
                  isRequired: opt.isRequired,
                  tenantId,
                  organizationId,
                  values: {
                    create: opt.values.map((v) => ({
                      name: this.normalizeJson(v.name),
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
          upsells: {
            include: { upsell: true },
          },
          recommendations: {
            include: { recommended: true },
          },
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

  async duplicate(id: string, tenantId: string, organizationId: string) {
    const originalProduct = await this.prisma.product.findUnique({
      where: { id, tenantId, organizationId },
      include: {
        images: true,
        options: {
          include: { values: true },
        },
      },
    });

    if (!originalProduct) {
      throw new Error('Product not found');
    }

    const {
      id: _id,
      createdAt: _createdAt,
      options,
      description,
      ...rest
    } = originalProduct;

    // Create a new product with " (Cópia)" appended to the name
    return this.prisma.product.create({
      data: {
        ...rest,
        description: description as Prisma.InputJsonValue,
        name: {
          ...(rest.name as Record<string, string>),
          pt: `${(rest.name as Record<string, string>)['pt']} (Cópia)`,
        } as Prisma.InputJsonValue,
        images: {
          create: originalProduct.images.map((img) => ({
            url: img.url,
            order: img.order,
          })),
        },
        options: {
          create: originalProduct.options.map((opt) => ({
            name: opt.name as Prisma.InputJsonValue,
            description: opt.description as Prisma.InputJsonValue,
            minChoices: opt.minChoices,
            maxChoices: opt.maxChoices,
            isRequired: opt.isRequired,
            tenantId,
            organizationId,
            values: {
              create: opt.values.map((v) => ({
                name: v.name as Prisma.InputJsonValue,
                price: v.price,
                isAvailable: v.isAvailable,
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

  async updateBulkAvailability(
    ids: string[],
    isAvailable: boolean,
    tenantId: string,
    organizationId: string,
  ) {
    return this.prisma.product.updateMany({
      where: {
        id: { in: ids },
        tenantId,
        organizationId,
      },
      data: { isAvailable },
    });
  }

  async removeBulk(ids: string[], tenantId: string, organizationId: string) {
    return this.prisma.product.deleteMany({
      where: {
        id: { in: ids },
        tenantId,
        organizationId,
      },
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
