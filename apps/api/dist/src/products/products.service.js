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
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ProductsService = class ProductsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createProductDto, tenantId, organizationId) {
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
    findAll(tenantId, organizationId, categoryId) {
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
    findOne(id, tenantId, organizationId) {
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
    async update(id, updateProductDto, tenantId, organizationId) {
        const { categoryId, images, options, ...data } = updateProductDto;
        return this.prisma.$transaction(async (tx) => {
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
    async remove(id, tenantId, organizationId) {
        return this.prisma.product.delete({
            where: { id, tenantId, organizationId },
        });
    }
    async createOption(productId, data, tenantId, organizationId) {
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
    async findOptions(productId, tenantId, organizationId) {
        return this.prisma.productOption.findMany({
            where: { productId, tenantId, organizationId },
            include: { values: true },
            orderBy: { createdAt: 'asc' },
        });
    }
    async removeOption(optionId, tenantId, organizationId) {
        return this.prisma.productOption.delete({
            where: { id: optionId, tenantId, organizationId },
        });
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProductsService);
//# sourceMappingURL=products.service.js.map