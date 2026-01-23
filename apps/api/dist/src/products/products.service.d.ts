import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
export declare class ProductsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createProductDto: CreateProductDto, tenantId: string, organizationId: string): Promise<{
        images: {
            order: number;
            url: string;
            id: string;
            createdAt: Date;
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
                price: Prisma.Decimal;
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
        price: Prisma.Decimal;
        imageUrl: string | null;
        isAvailable: boolean;
        categoryId: string;
    }>;
    findAll(tenantId: string, organizationId: string, categoryId?: string): Prisma.PrismaPromise<({
        category: {
            id: string;
            name: string;
            organizationId: string;
            tenantId: string;
            createdAt: Date;
        };
        images: {
            order: number;
            url: string;
            id: string;
            createdAt: Date;
            productId: string;
        }[];
    } & {
        id: string;
        name: string;
        organizationId: string;
        tenantId: string;
        createdAt: Date;
        description: string | null;
        price: Prisma.Decimal;
        imageUrl: string | null;
        isAvailable: boolean;
        categoryId: string;
    })[]>;
    findOne(id: string, tenantId: string, organizationId: string): Prisma.Prisma__ProductClient<({
        category: {
            id: string;
            name: string;
            organizationId: string;
            tenantId: string;
            createdAt: Date;
        };
        images: {
            order: number;
            url: string;
            id: string;
            createdAt: Date;
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
                price: Prisma.Decimal;
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
        price: Prisma.Decimal;
        imageUrl: string | null;
        isAvailable: boolean;
        categoryId: string;
    }) | null, null, import("@prisma/client/runtime/library").DefaultArgs, Prisma.PrismaClientOptions>;
    update(id: string, updateProductDto: UpdateProductDto, tenantId: string, organizationId: string): Promise<{
        images: {
            order: number;
            url: string;
            id: string;
            createdAt: Date;
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
                price: Prisma.Decimal;
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
        price: Prisma.Decimal;
        imageUrl: string | null;
        isAvailable: boolean;
        categoryId: string;
    }>;
    remove(id: string, tenantId: string, organizationId: string): Promise<{
        id: string;
        name: string;
        organizationId: string;
        tenantId: string;
        createdAt: Date;
        description: string | null;
        price: Prisma.Decimal;
        imageUrl: string | null;
        isAvailable: boolean;
        categoryId: string;
    }>;
    createOption(productId: string, data: {
        name: string;
        description?: string;
        minChoices?: number;
        maxChoices?: number;
        isRequired?: boolean;
        values?: {
            name: string;
            price?: number;
            isAvailable?: boolean;
        }[];
    }, tenantId: string, organizationId: string): Promise<{
        values: {
            id: string;
            name: string;
            organizationId: string;
            tenantId: string;
            createdAt: Date;
            updatedAt: Date;
            price: Prisma.Decimal;
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
    findOptions(productId: string, tenantId: string, organizationId: string): Promise<({
        values: {
            id: string;
            name: string;
            organizationId: string;
            tenantId: string;
            createdAt: Date;
            updatedAt: Date;
            price: Prisma.Decimal;
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
    removeOption(optionId: string, tenantId: string, organizationId: string): Promise<{
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
