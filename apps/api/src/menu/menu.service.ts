import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MenuService {
  constructor(private prisma: PrismaService) {}

  async getPublicMenu(tenantId: string) {
    console.log(`[MenuService] Fetching menu for tenant: ${tenantId}`);
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

    console.log(
      `[MenuService] Found ${categories.length} categories for tenant: ${tenantId}`,
    );
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
    const [branding, sections, footer, settings, tenant] = await Promise.all([
      this.prisma.tenantBranding.findUnique({ where: { tenantId } }),
      this.prisma.menuSection.findMany({
        where: { tenantId },
        orderBy: { order: 'asc' },
      }),
      this.prisma.footerConfig.findUnique({ where: { tenantId } }),
      this.prisma.tenantSettings.findUnique({ where: { tenantId } }),
      this.prisma.tenant.findUnique({
        where: { id: tenantId },
        select: {
          whatsapp: true,
          instagram: true,
          facebook: true,
          website: true,
          phone: true,
          email: true,
          address: true,
        },
      }),
    ]);

    // Merge socials from Tenant if footerConfig doesn't have them
    const socials = {
      ...(footer?.socials as any),
      instagram:
        (footer?.socials as any)?.instagram ||
        (tenant?.instagram?.startsWith('@')
          ? `https://instagram.com/${tenant.instagram.substring(1)}`
          : tenant?.instagram),
      facebook: (footer?.socials as any)?.facebook || tenant?.facebook,
      website: (footer?.socials as any)?.website || tenant?.website,
      whatsapp: (footer?.socials as any)?.whatsapp || tenant?.whatsapp,
    };

    const contactInfo = {
      ...(footer?.contactInfo as any),
      phone: (footer?.contactInfo as any)?.phone || tenant?.phone,
      email: (footer?.contactInfo as any)?.email || tenant?.email,
      address: (footer?.contactInfo as any)?.address || tenant?.address,
    };

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
      footer: {
        ...(footer || {}),
        socials,
        contactInfo,
        links: footer?.links || [],
      },
      settings: settings || {
        enableRecommendations: true,
        enableUpsells: true,
        homeLayoutType: 'standard',
        enabledLanguages: ['pt'],
      },
    };
  }

  async getPublicTables(tenantId: string) {
    return this.prisma.table.findMany({
      where: {
        tenantId,
      },
      orderBy: {
        number: 'asc',
      },
      select: {
        id: true,
        number: true,
      },
    });
  }
}
