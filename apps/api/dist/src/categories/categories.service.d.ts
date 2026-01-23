import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
export declare class CategoriesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createCategoryDto: CreateCategoryDto, tenantId: string, organizationId: string): import(".prisma/client").Prisma.Prisma__CategoryClient<{
        id: string;
        name: string;
        organizationId: string;
        tenantId: string;
        createdAt: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    findAll(tenantId: string, organizationId: string): import(".prisma/client").Prisma.PrismaPromise<({
        _count: {
            products: number;
        };
    } & {
        id: string;
        name: string;
        organizationId: string;
        tenantId: string;
        createdAt: Date;
    })[]>;
    findOne(id: string, tenantId: string, organizationId: string): import(".prisma/client").Prisma.Prisma__CategoryClient<({
        products: {
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
        }[];
    } & {
        id: string;
        name: string;
        organizationId: string;
        tenantId: string;
        createdAt: Date;
    }) | null, null, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    update(id: string, updateCategoryDto: UpdateCategoryDto, tenantId: string, organizationId: string): import(".prisma/client").Prisma.PrismaPromise<import(".prisma/client").Prisma.BatchPayload>;
    remove(id: string, tenantId: string, organizationId: string): import(".prisma/client").Prisma.PrismaPromise<import(".prisma/client").Prisma.BatchPayload>;
}
