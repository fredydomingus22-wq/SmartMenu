import { Injectable } from '@nestjs/common';
import { parse } from 'csv-parse';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

interface CsvRow {
  name?: string;
  Nombre?: string;
  Nome?: string;
  price?: string;
  Preco?: string;
  Price?: string;
  category?: string;
  Categoria?: string;
  Category?: string;
  description?: string;
  Descricao?: string;
  Description?: string;
  image_url?: string;
  ImageUrl?: string;
  Imagem?: string;
  is_available?: string;
  IsAvailable?: string;
  Disponivel?: string;
}

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private normalizeJson(value: any): Prisma.InputJsonValue {
    if (!value) return null as unknown as Prisma.InputJsonValue;
    if (typeof value === 'string') {
      return { pt: value } as Prisma.InputJsonValue;
    }
    return value as Prisma.InputJsonValue;
  }

  async create(
    createProductDto: CreateProductDto,
    tenantId: string,
    organizationId: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Promise<any> {
    if (!tenantId || !organizationId) {
      throw new Error('Tenant or Organization ID missing in request');
    }

    const { images, options, upsells, recommendations, metadata, ...data } =
      createProductDto;

    return this.prisma.product.create({
      data: {
        ...data,
        name: this.normalizeJson(data.name),
        description: this.normalizeJson(data.description),
        metadata: metadata ?? Prisma.JsonNull,
        tenantId,
        organizationId,
        images: {
          create: (images || []).map((url: string, index: number) => ({
            url,
            order: index,
          })),
        },
        upsells: {
          create: (upsells || []).map((upsellId: string) => ({
            upsellId,
            tenantId,
          })),
        },
        recommendations: {
          create: (recommendations || []).map((recommendedId: string) => ({
            recommendedId,
            tenantId,
          })),
        },
        options: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          create: (options || []).map((opt: any) => ({
            name: this.normalizeJson(opt.name),
            description: this.normalizeJson(opt.description),
            minChoices: opt.minChoices || 0,
            maxChoices: opt.maxChoices || 1,
            isRequired: opt.isRequired || false,
            tenantId,
            organizationId,
            values: {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              create: (opt.values || []).map((v: any) => ({
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Promise<any> {
    const {
      categoryId,
      images,
      options,
      upsells,
      recommendations,
      metadata,
      ...data
    } = updateProductDto;

    return this.prisma.$transaction(
      async (tx: Prisma.TransactionClient) => {
        try {
          if (images) {
            await tx.productImage.deleteMany({
              where: { productId: id },
            });
          }

          if (options) {
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

          return await tx.product.update({
            where: { id, tenantId, organizationId },
            data: {
              ...data,
              name: this.normalizeJson(data.name),
              description: this.normalizeJson(data.description),
              metadata: metadata ?? undefined,
              ...(categoryId ? { categoryId } : {}),
              ...(images
                ? {
                    images: {
                      create: images.map((url: string, index: number) => ({
                        url,
                        order: index,
                      })),
                    },
                  }
                : {}),
              ...(upsells
                ? {
                    upsells: {
                      create: upsells.map((upsellId: string) => ({
                        upsellId,
                        tenantId,
                      })),
                    },
                  }
                : {}),
              ...(recommendations
                ? {
                    recommendations: {
                      create: recommendations.map((recommendedId: string) => ({
                        recommendedId,
                        tenantId,
                      })),
                    },
                  }
                : {}),
              ...(options
                ? {
                    options: {
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      create: options.map((opt: any) => ({
                        name: this.normalizeJson(opt.name),
                        description: this.normalizeJson(opt.description),
                        minChoices: opt.minChoices,
                        maxChoices: opt.maxChoices,
                        isRequired: opt.isRequired,
                        tenantId,
                        organizationId,
                        values: {
                          // eslint-disable-next-line @typescript-eslint/no-explicit-any
                          create: opt.values.map((v: any) => ({
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
        } catch (error) {
          console.error(
            `[ProductsService] Transaction failed for product ${id}:`,
            error,
          );
          throw error;
        }
      },
      { timeout: 15000 },
    );
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

    const { description, ...rest } = originalProduct;

    return this.prisma.product.create({
      data: {
        ...rest,
        metadata: rest.metadata as Prisma.InputJsonValue,
        description: description as Prisma.InputJsonValue,
        name: {
          ...(rest.name as Record<string, string>),
          pt: `${(rest.name as Record<string, string>)['pt']} (Cópia)`,
        } as Prisma.InputJsonValue,
        images: {
          create: originalProduct.images.map((img: any) => ({
            url: img.url,
            order: img.order,
          })),
        },
        options: {
          create: originalProduct.options.map((opt: any) => ({
            name: opt.name as Prisma.InputJsonValue,
            description: opt.description as Prisma.InputJsonValue,
            minChoices: opt.minChoices,
            maxChoices: opt.maxChoices,
            isRequired: opt.isRequired,
            tenantId,
            organizationId,
            values: {
              create: opt.values.map((v: any) => ({
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

  async importCSV(
    buffer: Buffer,
    tenantId: string,
    organizationId: string,
  ): Promise<{ success: true; importedCount: number; errors: string[] }> {
    return new Promise((resolve, reject) => {
      const records: CsvRow[] = [];
      const errors: string[] = [];

      const parser = parse(buffer, {
        columns: true,
        skip_empty_lines: true,
        trim: true,
        delimiter: ',',
      });

      parser.on('readable', () => {
        let record;
        while ((record = parser.read()) !== null) {
          records.push(record as CsvRow);
        }
      });

      parser.on('error', (err) => {
        reject(new Error(`Erro ao processar CSV: ${err.message}`));
      });

      parser.on('end', async () => {
        try {
          // 0. Verify organization exists to prevent FK errors
          const organization = await this.prisma.organization.findUnique({
            where: { id: organizationId },
          });

          if (!organization) {
            return reject(
              new Error(`Organização inválida (ID: ${organizationId}). Contacte o suporte.`),
            );
          }

          const result = await this.prisma.$transaction(
            async (tx) => {
              let importedCount = 0;
              // 1. Fetch all existing categories for this tenant at once
              const existingCategories = await tx.category.findMany({
                where: { tenantId },
              });

              // 2. Local map to track categories (existing + newly created in this batch)
              const categoryMap = new Map<string, string>();
              existingCategories.forEach((c) => {
                const name = c.name as Prisma.JsonValue;
                if (typeof name === 'string') {
                  categoryMap.set(name.toLowerCase(), c.id);
                } else if (typeof name === 'object' && name !== null && 'pt' in name && typeof name.pt === 'string') {
                  categoryMap.set(name.pt.toLowerCase(), c.id);
                }
              });

              const productsToCreate: Prisma.ProductCreateManyInput[] = [];

              for (const row of records) {
                // Normalize keys (handle BOM or case sensitivity if needed)
                const name = row.name || row.Nombre || row.Nome;
                const priceStr = row.price || row.Preco || row.Price;
                const category = row.category || row.Categoria || row.Category;
                const description = row.description || row.Descricao || row.Description;
                const imageUrl = row.image_url || row.ImageUrl || row.Imagem;
                const isAvailableStr = row.is_available || row.IsAvailable || row.Disponivel;

                if (!name || !priceStr || !category) {
                  // Skip invalid rows silently or push to errors
                  continue;
                }

                const catNameLower = category.trim().toLowerCase();
                let categoryId = categoryMap.get(catNameLower);

                // 3. If category doesn't exist, create it immediately
                if (!categoryId) {
                  const newCat = await tx.category.create({
                    data: {
                      name: { pt: category.trim() },
                      tenantId,
                      organizationId,
                      preparationSector: 'KITCHEN',
                    },
                  });
                  categoryId = newCat.id;
                  categoryMap.set(catNameLower, categoryId);
                }

                // 4. Prepare product data
                const price = new Prisma.Decimal(
                    priceStr.replace('AOA', '').replace(/\s/g, '').replace(',', '.')
                );

                productsToCreate.push({
                  name: { pt: name.trim() },
                  description: description
                    ? { pt: description.trim() }
                    : Prisma.JsonNull,
                  price: isNaN(Number(price)) ? new Prisma.Decimal(0) : price,
                  imageUrl: imageUrl || null,
                  isAvailable:
                    isAvailableStr?.toLowerCase() === 'false'
                      ? false
                      : true,
                  categoryId,
                  tenantId,
                  organizationId,
                });
                importedCount++;
              }

              // 5. Batch create all products
              if (productsToCreate.length > 0) {
                await tx.product.createMany({
                  data: productsToCreate,
                });
              }

              return { importedCount, errors: [] };
            },
            {
              timeout: 30000,
            },
          );

          resolve({ success: true, ...result });
        } catch (err: unknown) {
          console.error('CSV Import Transaction Error:', err);
          const message =
            err instanceof Error ? err.message : 'Erro desconhecido';
          reject(new Error(`Falha na importação: ${message}`));
        }
      });
    });
  }
}
