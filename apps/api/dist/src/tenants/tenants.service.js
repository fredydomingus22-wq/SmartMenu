"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let TenantsService = class TenantsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findTenant(tenantId, organizationId) {
        const tenant = await this.prisma.tenant.findUnique({
            where: { id: tenantId },
            include: { organization: true },
        });
        if (!tenant || tenant.organizationId !== organizationId) {
            throw new common_1.NotFoundException('Tenant not found');
        }
        return tenant;
    }
    async updateTenant(tenantId, organizationId, updateTenantDto) {
        await this.findTenant(tenantId, organizationId);
        return this.prisma.tenant.update({
            where: { id: tenantId },
            data: updateTenantDto,
        });
    }
    async findOrganization(organizationId) {
        const organization = await this.prisma.organization.findUnique({
            where: { id: organizationId },
        });
        if (!organization) {
            throw new common_1.NotFoundException('Organization not found');
        }
        return organization;
    }
    async updateOrganization(organizationId, updateOrganizationDto) {
        return this.prisma.organization.update({
            where: { id: organizationId },
            data: updateOrganizationDto,
        });
    }
    async findBranding(tenantId) {
        const branding = await this.prisma.tenantBranding.findUnique({
            where: { tenantId },
        });
        if (!branding) {
            const tenant = await this.prisma.tenant.findUnique({
                where: { id: tenantId },
            });
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
    async updateBranding(tenantId, updateBrandingDto) {
        return this.prisma.tenantBranding.upsert({
            where: { tenantId },
            update: updateBrandingDto,
            create: {
                ...updateBrandingDto,
                tenantId,
            },
        });
    }
    async updateMenuConfig(tenantId, sections) {
        return this.prisma.$transaction(async (tx) => {
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
                    config: section.config || {},
                })),
            });
        });
    }
};
exports.TenantsService = TenantsService;
exports.TenantsService = TenantsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TenantsService);
//# sourceMappingURL=tenants.service.js.map