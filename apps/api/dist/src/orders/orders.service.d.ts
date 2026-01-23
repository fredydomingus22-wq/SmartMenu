import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { LoyaltyService } from '../loyalty/loyalty.service';
import { OrderStatus } from '@prisma/client';
export declare class OrdersService {
    private prisma;
    private configService;
    private loyaltyService;
    private supabase;
    constructor(prisma: PrismaService, configService: ConfigService, loyaltyService: LoyaltyService);
    private broadcastOrderEvent;
    create(createOrderDto: CreateOrderDto, tenantId: string, organizationId: string, userId?: string): Promise<{
        table: {
            number: number;
            id: string;
            organizationId: string;
            tenantId: string;
            qrCode: string | null;
        } | null;
        items: ({
            product: {
                id: string;
                createdAt: Date;
                organizationId: string;
                tenantId: string;
                price: import("@prisma/client/runtime/library").Decimal;
                name: string;
                description: string | null;
                imageUrl: string | null;
                isAvailable: boolean;
                categoryId: string;
            };
            options: ({
                optionValue: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    organizationId: string;
                    tenantId: string;
                    price: import("@prisma/client/runtime/library").Decimal;
                    name: string;
                    isAvailable: boolean;
                    optionId: string;
                };
            } & {
                id: string;
                organizationId: string;
                tenantId: string;
                price: import("@prisma/client/runtime/library").Decimal;
                productOptionValueId: string;
                orderItemId: string;
            })[];
        } & {
            id: string;
            organizationId: string;
            tenantId: string;
            quantity: number;
            price: import("@prisma/client/runtime/library").Decimal;
            notes: string | null;
            productId: string;
            orderId: string;
        })[];
    } & {
        id: string;
        status: import(".prisma/client").$Enums.OrderStatus;
        total: import("@prisma/client/runtime/library").Decimal;
        createdAt: Date;
        updatedAt: Date;
        tableId: string | null;
        userId: string | null;
        organizationId: string;
        tenantId: string;
    }>;
    findAll(tenantId: string, organizationId: string): Promise<({
        table: {
            number: number;
            id: string;
            organizationId: string;
            tenantId: string;
            qrCode: string | null;
        } | null;
        items: ({
            product: {
                id: string;
                createdAt: Date;
                organizationId: string;
                tenantId: string;
                price: import("@prisma/client/runtime/library").Decimal;
                name: string;
                description: string | null;
                imageUrl: string | null;
                isAvailable: boolean;
                categoryId: string;
            };
        } & {
            id: string;
            organizationId: string;
            tenantId: string;
            quantity: number;
            price: import("@prisma/client/runtime/library").Decimal;
            notes: string | null;
            productId: string;
            orderId: string;
        })[];
    } & {
        id: string;
        status: import(".prisma/client").$Enums.OrderStatus;
        total: import("@prisma/client/runtime/library").Decimal;
        createdAt: Date;
        updatedAt: Date;
        tableId: string | null;
        userId: string | null;
        organizationId: string;
        tenantId: string;
    })[]>;
    findOne(id: string, tenantId: string, organizationId: string): Promise<{
        table: {
            number: number;
            id: string;
            organizationId: string;
            tenantId: string;
            qrCode: string | null;
        } | null;
        items: ({
            product: {
                id: string;
                createdAt: Date;
                organizationId: string;
                tenantId: string;
                price: import("@prisma/client/runtime/library").Decimal;
                name: string;
                description: string | null;
                imageUrl: string | null;
                isAvailable: boolean;
                categoryId: string;
            };
        } & {
            id: string;
            organizationId: string;
            tenantId: string;
            quantity: number;
            price: import("@prisma/client/runtime/library").Decimal;
            notes: string | null;
            productId: string;
            orderId: string;
        })[];
    } & {
        id: string;
        status: import(".prisma/client").$Enums.OrderStatus;
        total: import("@prisma/client/runtime/library").Decimal;
        createdAt: Date;
        updatedAt: Date;
        tableId: string | null;
        userId: string | null;
        organizationId: string;
        tenantId: string;
    }>;
    findOnePublic(id: string): Promise<{
        table: {
            number: number;
            id: string;
            organizationId: string;
            tenantId: string;
            qrCode: string | null;
        } | null;
        items: ({
            product: {
                id: string;
                name: string;
                imageUrl: string | null;
            };
            options: ({
                optionValue: {
                    id: string;
                    price: import("@prisma/client/runtime/library").Decimal;
                    name: string;
                };
            } & {
                id: string;
                organizationId: string;
                tenantId: string;
                price: import("@prisma/client/runtime/library").Decimal;
                productOptionValueId: string;
                orderItemId: string;
            })[];
        } & {
            id: string;
            organizationId: string;
            tenantId: string;
            quantity: number;
            price: import("@prisma/client/runtime/library").Decimal;
            notes: string | null;
            productId: string;
            orderId: string;
        })[];
    } & {
        id: string;
        status: import(".prisma/client").$Enums.OrderStatus;
        total: import("@prisma/client/runtime/library").Decimal;
        createdAt: Date;
        updatedAt: Date;
        tableId: string | null;
        userId: string | null;
        organizationId: string;
        tenantId: string;
    }>;
    updateStatus(id: string, status: OrderStatus, tenantId: string): Promise<{
        table: {
            number: number;
            id: string;
            organizationId: string;
            tenantId: string;
            qrCode: string | null;
        } | null;
        items: ({
            product: {
                id: string;
                createdAt: Date;
                organizationId: string;
                tenantId: string;
                price: import("@prisma/client/runtime/library").Decimal;
                name: string;
                description: string | null;
                imageUrl: string | null;
                isAvailable: boolean;
                categoryId: string;
            };
            options: ({
                optionValue: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    organizationId: string;
                    tenantId: string;
                    price: import("@prisma/client/runtime/library").Decimal;
                    name: string;
                    isAvailable: boolean;
                    optionId: string;
                };
            } & {
                id: string;
                organizationId: string;
                tenantId: string;
                price: import("@prisma/client/runtime/library").Decimal;
                productOptionValueId: string;
                orderItemId: string;
            })[];
        } & {
            id: string;
            organizationId: string;
            tenantId: string;
            quantity: number;
            price: import("@prisma/client/runtime/library").Decimal;
            notes: string | null;
            productId: string;
            orderId: string;
        })[];
    } & {
        id: string;
        status: import(".prisma/client").$Enums.OrderStatus;
        total: import("@prisma/client/runtime/library").Decimal;
        createdAt: Date;
        updatedAt: Date;
        tableId: string | null;
        userId: string | null;
        organizationId: string;
        tenantId: string;
    }>;
    findAllForKitchen(tenantId: string, organizationId: string): Promise<({
        table: {
            number: number;
            id: string;
            organizationId: string;
            tenantId: string;
            qrCode: string | null;
        } | null;
        items: ({
            product: {
                id: string;
                createdAt: Date;
                organizationId: string;
                tenantId: string;
                price: import("@prisma/client/runtime/library").Decimal;
                name: string;
                description: string | null;
                imageUrl: string | null;
                isAvailable: boolean;
                categoryId: string;
            };
            options: ({
                optionValue: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    organizationId: string;
                    tenantId: string;
                    price: import("@prisma/client/runtime/library").Decimal;
                    name: string;
                    isAvailable: boolean;
                    optionId: string;
                };
            } & {
                id: string;
                organizationId: string;
                tenantId: string;
                price: import("@prisma/client/runtime/library").Decimal;
                productOptionValueId: string;
                orderItemId: string;
            })[];
        } & {
            id: string;
            organizationId: string;
            tenantId: string;
            quantity: number;
            price: import("@prisma/client/runtime/library").Decimal;
            notes: string | null;
            productId: string;
            orderId: string;
        })[];
    } & {
        id: string;
        status: import(".prisma/client").$Enums.OrderStatus;
        total: import("@prisma/client/runtime/library").Decimal;
        createdAt: Date;
        updatedAt: Date;
        tableId: string | null;
        userId: string | null;
        organizationId: string;
        tenantId: string;
    })[]>;
}
