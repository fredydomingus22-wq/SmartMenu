import { OrdersService } from './orders.service';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { AuthenticatedRequest } from '../common/interfaces/request.interface';
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    findAll(req: AuthenticatedRequest): Promise<({
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
    findAllForKitchen(req: AuthenticatedRequest): Promise<({
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
    findOne(id: string, req: AuthenticatedRequest): Promise<{
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
    updateStatus(id: string, updateOrderStatusDto: UpdateOrderStatusDto, req: AuthenticatedRequest): Promise<{
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
}
