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
exports.MenuService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let MenuService = class MenuService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getPublicMenu(tenantId) {
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
    async getPublicProduct(tenantId, productId) {
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
    async getMenuConfig(tenantId) {
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
            sections: sections.length > 0
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
};
exports.MenuService = MenuService;
exports.MenuService = MenuService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MenuService);
//# sourceMappingURL=menu.service.js.map