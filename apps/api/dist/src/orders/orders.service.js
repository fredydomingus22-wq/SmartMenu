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
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const supabase_js_1 = require("@supabase/supabase-js");
const prisma_service_1 = require("../prisma/prisma.service");
const loyalty_service_1 = require("../loyalty/loyalty.service");
let OrdersService = class OrdersService {
    prisma;
    configService;
    loyaltyService;
    supabase;
    constructor(prisma, configService, loyaltyService) {
        this.prisma = prisma;
        this.configService = configService;
        this.loyaltyService = loyaltyService;
        const supabaseUrl = this.configService.get('SUPABASE_URL');
        const supabaseAnonKey = this.configService.get('SUPABASE_ANON_KEY');
        if (supabaseUrl && supabaseAnonKey) {
            this.supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseAnonKey);
        }
    }
    async broadcastOrderEvent(tenantId, event, payload) {
        if (!this.supabase)
            return;
        await this.supabase.channel(`orders:${tenantId}`).send({
            type: 'broadcast',
            event,
            payload,
        });
    }
    async create(createOrderDto, tenantId, organizationId, userId) {
        const { tableId, items } = createOrderDto;
        const productIds = items.map((i) => i.productId);
        const optionValueIds = items.flatMap((i) => (i.options || []).map((o) => o.valueId));
        const [products, optionValues] = await Promise.all([
            this.prisma.product.findMany({
                where: {
                    id: { in: productIds },
                    tenantId,
                    organizationId,
                    isAvailable: true,
                },
            }),
            optionValueIds.length > 0
                ? this.prisma.productOptionValue.findMany({
                    where: {
                        id: { in: optionValueIds },
                        tenantId,
                        organizationId,
                        isAvailable: true,
                    },
                })
                : [],
        ]);
        if (products.length !== items.length) {
            throw new Error('One or more products are invalid or unavailable');
        }
        if (optionValueIds.length > 0 &&
            optionValues.length !== Array.from(new Set(optionValueIds)).length) {
            throw new Error('One or more selected options are invalid or unavailable');
        }
        let total = 0;
        const order = await this.prisma.$transaction(async (tx) => {
            const orderItemsData = items.map((item) => {
                const product = products.find((p) => p.id === item.productId);
                if (!product)
                    throw new Error(`Product ${item.productId} not found`);
                let itemSubtotal = Number(product.price);
                const itemOptions = (item.options || []).map((opt) => {
                    const val = optionValues.find((v) => v.id === opt.valueId);
                    if (!val)
                        throw new Error(`Option value ${opt.valueId} not found`);
                    itemSubtotal += Number(val.price);
                    return {
                        productOptionValueId: val.id,
                        price: val.price,
                        tenantId,
                        organizationId,
                    };
                });
                total += itemSubtotal * item.quantity;
                return {
                    productId: item.productId,
                    quantity: item.quantity,
                    price: product.price,
                    tenantId,
                    organizationId,
                    options: {
                        create: itemOptions,
                    },
                };
            });
            const newOrder = await tx.order.create({
                data: {
                    tenantId,
                    organizationId,
                    tableId,
                    userId,
                    total,
                    status: 'PENDING',
                    items: {
                        create: orderItemsData,
                    },
                },
                include: {
                    items: {
                        include: {
                            product: true,
                            options: {
                                include: { optionValue: true },
                            },
                        },
                    },
                    table: true,
                },
            });
            return newOrder;
        });
        await this.broadcastOrderEvent(tenantId, 'ORDER_CREATED', order);
        return order;
    }
    async findAll(tenantId, organizationId) {
        return this.prisma.order.findMany({
            where: { tenantId, organizationId },
            include: {
                items: {
                    include: { product: true },
                },
                table: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOne(id, tenantId, organizationId) {
        const order = await this.prisma.order.findFirst({
            where: { id, tenantId, organizationId },
            include: {
                items: {
                    include: { product: true },
                },
                table: true,
            },
        });
        if (!order) {
            throw new common_1.NotFoundException('Order not found');
        }
        return order;
    }
    async findOnePublic(id) {
        const order = await this.prisma.order.findUnique({
            where: { id },
            include: {
                items: {
                    include: {
                        product: {
                            select: { id: true, name: true, imageUrl: true }
                        },
                        options: {
                            include: {
                                optionValue: {
                                    select: { id: true, name: true, price: true }
                                }
                            }
                        }
                    },
                },
                table: true,
            },
        });
        if (!order) {
            throw new common_1.NotFoundException('Order not found');
        }
        return order;
    }
    async updateStatus(id, status, tenantId) {
        const order = await this.prisma.order.update({
            where: { id },
            data: { status },
            include: {
                items: {
                    include: {
                        product: true,
                        options: {
                            include: { optionValue: true },
                        },
                    },
                },
                table: true,
            },
        });
        await this.broadcastOrderEvent(tenantId, 'STATUS_UPDATED', order);
        if (status === 'DELIVERED' && order.userId) {
            try {
                await this.loyaltyService.earnPoints(order.userId, tenantId, Number(order.total), order.id);
            }
            catch (error) {
                console.error(`Failed to award points for order ${id}:`, error);
            }
        }
        return order;
    }
    async findAllForKitchen(tenantId, organizationId) {
        return this.prisma.order.findMany({
            where: {
                tenantId,
                organizationId,
                status: {
                    in: ['PENDING', 'CONFIRMED', 'PREPARING', 'READY'],
                },
            },
            include: {
                items: {
                    include: {
                        product: true,
                        options: {
                            include: { optionValue: true },
                        },
                    },
                },
                table: true,
            },
            orderBy: { createdAt: 'asc' },
        });
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        config_1.ConfigService,
        loyalty_service_1.LoyaltyService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map