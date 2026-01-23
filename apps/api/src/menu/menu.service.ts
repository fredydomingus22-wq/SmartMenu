import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MenuService {
  constructor(private prisma: PrismaService) { }

  async getPublicMenu(tenantId: string) {
    const categories = await this.prisma.category.findMany({
      where: { tenantId: tenantId },
      include: {
        products: {
          where: { isAvailable: true },
          include: {
            images: {
              orderBy: { order: 'asc' },
            },
            options: {
              include: {
                values: true,
              },
            },
          },
        },
      },
      orderBy: { name: 'asc' },
    });

    return categories;
  }

  async getPublicProduct(tenantId: string, productId: string) {
    return this.prisma.product.findFirst({
      where: {
        id: productId,
        tenantId: tenantId,
        isAvailable: true,
      },
      include: {
        images: {
          orderBy: { order: 'asc' },
        },
        options: {
          include: {
            values: true,
          },
        },
        recommendations: {
          include: {
            recommended: {
              include: {
                images: true,
              },
            },
          },
        },
        upsells: {
          include: {
            upsell: {
              include: {
                images: true,
              },
            },
          },
        },
      },
    });
  }

  async getMenuConfig(tenantId: string) {
    const [branding, sections, footer, settings] = await Promise.all([
      this.prisma.tenantBranding.findUnique({ where: { tenantId } }),
      this.prisma.menuSection.findMany({
        where: { tenantId },
        orderBy: { order: 'asc' },
      }),
      this.prisma.footerConfig.findUnique({ where: { tenantId } }),
      this.prisma.tenantSettings.findUnique({ where: { tenantId } }),
    ]);

    return {
      branding: branding || { primaryColor: '#2563EB', logoUrl: null },
      sections:
        sections.length > 0
          ? sections
          : [
            {
              type: 'hero',
              isActive: true,
              name: 'Hero',
              config: { title: 'Benvindo!' },
            },
            { type: 'category_grid', isActive: true, name: 'Categorias' },
          ],
      footer: footer || { socials: {}, links: [], contactInfo: {} },
      settings: settings || {
        enableRecommendations: true,
        enableUpsells: true,
        homeLayoutType: 'standard',
      },
    };
  }
}
