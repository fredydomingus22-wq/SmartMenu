import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { UpdateBrandingDto } from './dto/update-branding.dto';
import { MenuSectionDto } from './dto/update-menu-config.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class TenantsService {
  constructor(private prisma: PrismaService) { }

  async findTenant(tenantId: string, organizationId: string) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
      include: { organization: true },
    });

    if (!tenant || tenant.organizationId !== organizationId) {
      throw new NotFoundException('Tenant not found');
    }

    return tenant;
  }

  async updateTenant(
    tenantId: string,
    organizationId: string,
    updateTenantDto: UpdateTenantDto,
  ) {
    // Ensure tenant belongs to organization
    await this.findTenant(tenantId, organizationId);

    return this.prisma.tenant.update({
      where: { id: tenantId },
      data: updateTenantDto,
    });
  }

  async findOrganization(organizationId: string) {
    const organization = await this.prisma.organization.findUnique({
      where: { id: organizationId },
    });

    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    return organization;
  }

  async updateOrganization(
    organizationId: string,
    updateOrganizationDto: UpdateOrganizationDto,
  ) {
    return this.prisma.organization.update({
      where: { id: organizationId },
      data: updateOrganizationDto,
    });
  }

  async findBranding(tenantId: string) {
    const branding = await this.prisma.tenantBranding.findUnique({
      where: { tenantId },
    });

    if (!branding) {
      const tenant = await this.prisma.tenant.findUnique({
        where: { id: tenantId },
      });

      // Return default branding if not found
      return {
        tenantId,
        tenantName: tenant?.name || 'SmartMenu',
        primaryColor: '#2563EB',
        borderRadius: '0.5rem',
        fontFamily: 'Inter',
      };
    }

    return branding;
  }

  async updateBranding(tenantId: string, updateBrandingDto: UpdateBrandingDto) {
    return this.prisma.tenantBranding.upsert({
      where: { tenantId },
      update: updateBrandingDto,
      create: {
        ...updateBrandingDto,
        tenantId,
      },
    });
  }

  async updateMenuConfig(tenantId: string, sections: MenuSectionDto[]) {
    return this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // Delete all existing sections and recreate them to ensure order and consistency
      await tx.menuSection.deleteMany({
        where: { tenantId },
      });

      return tx.menuSection.createMany({
        data: sections.map((section, index) => ({
          tenantId,
          type: section.type,
          name: section.name || section.type,
          order: index,
          isActive: section.isActive !== false,
          config: (section.config as Prisma.InputJsonValue) || {},
        })),
      });
    });
  }

  async findNearby(lat: number, lng: number, radiusMeters: number) {
    // We use queryRaw because Prisma doesn't have native support for PostGIS geography types
    // 4326 is the standard WGS84 SRID
    return this.prisma.$queryRaw`
      SELECT 
        id, 
        name, 
        slug, 
        image_url as "logoUrl", 
        description,
        ST_Distance(location, ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326)::geography) as distance
      FROM tenants
      WHERE ST_DWithin(location, ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326)::geography, ${radiusMeters})
      ORDER BY distance ASC
      LIMIT 10
    `;
  }
}
