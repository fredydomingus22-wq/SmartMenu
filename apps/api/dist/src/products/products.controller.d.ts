import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import type { AuthenticatedRequest } from '../common/interfaces/request.interface';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    create(createProductDto: CreateProductDto, req: AuthenticatedRequest): Promise<{
        images: {
            id: string;
            createdAt: Date;
            order: number;
            url: string;
            productId: string;
        }[];
        options: ({
            values: {
                id: string;
                name: string;
                organizationId: string;
                tenantId: string;
                createdAt: Date;
                updatedAt: Date;
                price: import("@prisma/client/runtime/library").Decimal;
                isAvailable: boolean;
                optionId: string;
            }[];
        } & {
            id: string;
            name: string;
            organizationId: string;
            tenantId: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            minChoices: number;
            maxChoices: number;
            isRequired: boolean;
            productId: string;
        })[];
    } & {
        id: string;
        name: string;
        organizationId: string;
        tenantId: string;
        createdAt: Date;
        description: string | null;
        price: import("@prisma/client/runtime/library").Decimal;
        imageUrl: string | null;
        isAvailable: boolean;
        categoryId: string;
    }>;
    findAll(req: AuthenticatedRequest, categoryId?: string): Promise<({
        images: {
            id: string;
            createdAt: Date;
            order: number;
            url: string;
            productId: string;
        }[];
        category: {
            id: string;
            name: string;
            organizationId: string;
            tenantId: string;
            createdAt: Date;
        };
    } & {
        id: string;
        name: string;
        organizationId: string;
        tenantId: string;
        createdAt: Date;
        description: string | null;
        price: import("@prisma/client/runtime/library").Decimal;
        imageUrl: string | null;
        isAvailable: boolean;
        categoryId: string;
    })[]>;
    findOne(id: string, req: AuthenticatedRequest): Promise<{
        images: {
            id: string;
            createdAt: Date;
            order: number;
            url: string;
            productId: string;
        }[];
        category: {
            id: string;
            name: string;
            organizationId: string;
            tenantId: string;
            createdAt: Date;
        };
        options: ({
            values: {
                id: string;
                name: string;
                organizationId: string;
                tenantId: string;
                createdAt: Date;
                updatedAt: Date;
                price: import("@prisma/client/runtime/library").Decimal;
                isAvailable: boolean;
                optionId: string;
            }[];
        } & {
            id: string;
            name: string;
            organizationId: string;
            tenantId: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            minChoices: number;
            maxChoices: number;
            isRequired: boolean;
            productId: string;
        })[];
    } & {
        id: string;
        name: string;
        organizationId: string;
        tenantId: string;
        createdAt: Date;
        description: string | null;
        price: import("@prisma/client/runtime/library").Decimal;
        imageUrl: string | null;
        isAvailable: boolean;
        categoryId: string;
    }>;
    update(id: string, updateProductDto: UpdateProductDto, req: AuthenticatedRequest): Promise<{
        images: {
            id: string;
            createdAt: Date;
            order: number;
            url: string;
            productId: string;
        }[];
        options: ({
            values: {
                id: string;
                name: string;
                organizationId: string;
                tenantId: string;
                createdAt: Date;
                updatedAt: Date;
                price: import("@prisma/client/runtime/library").Decimal;
                isAvailable: boolean;
                optionId: string;
            }[];
        } & {
            id: string;
            name: string;
            organizationId: string;
            tenantId: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            minChoices: number;
            maxChoices: number;
            isRequired: boolean;
            productId: string;
        })[];
    } & {
        id: string;
        name: string;
        organizationId: string;
        tenantId: string;
        createdAt: Date;
        description: string | null;
        price: import("@prisma/client/runtime/library").Decimal;
        imageUrl: string | null;
        isAvailable: boolean;
        categoryId: string;
    }>;
    remove(id: string, req: AuthenticatedRequest): Promise<{
        id: string;
        name: string;
        organizationId: string;
        tenantId: string;
        createdAt: Date;
        description: string | null;
        price: import("@prisma/client/runtime/library").Decimal;
        imageUrl: string | null;
        isAvailable: boolean;
        categoryId: string;
    }>;
    createOption(productId: string, createOptionDto: any, req: AuthenticatedRequest): Promise<{
        values: {
            id: string;
            name: string;
            organizationId: string;
            tenantId: string;
            createdAt: Date;
            updatedAt: Date;
            price: import("@prisma/client/runtime/library").Decimal;
            isAvailable: boolean;
            optionId: string;
        }[];
    } & {
        id: string;
        name: string;
        organizationId: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        minChoices: number;
        maxChoices: number;
        isRequired: boolean;
        productId: string;
    }>;
    findOptions(productId: string, req: AuthenticatedRequest): Promise<({
        values: {
            id: string;
            name: string;
            organizationId: string;
            tenantId: string;
            createdAt: Date;
            updatedAt: Date;
            price: import("@prisma/client/runtime/library").Decimal;
            isAvailable: boolean;
            optionId: string;
        }[];
    } & {
        id: string;
        name: string;
        organizationId: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        minChoices: number;
        maxChoices: number;
        isRequired: boolean;
        productId: string;
    })[]>;
    removeOption(optionId: string, req: AuthenticatedRequest): Promise<{
        id: string;
        name: string;
        organizationId: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        minChoices: number;
        maxChoices: number;
        isRequired: boolean;
        productId: string;
    }>;
}
