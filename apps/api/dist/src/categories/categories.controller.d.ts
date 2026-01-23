import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import type { AuthenticatedRequest } from '../common/interfaces/request.interface';
export declare class CategoriesController {
    private readonly categoriesService;
    constructor(categoriesService: CategoriesService);
    create(createCategoryDto: CreateCategoryDto, req: AuthenticatedRequest): import(".prisma/client").Prisma.Prisma__CategoryClient<{
        id: string;
        name: string;
        organizationId: string;
        tenantId: string;
        createdAt: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    findAll(req: AuthenticatedRequest): import(".prisma/client").Prisma.PrismaPromise<({
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
    findOne(id: string, req: AuthenticatedRequest): import(".prisma/client").Prisma.Prisma__CategoryClient<({
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
    update(id: string, updateCategoryDto: UpdateCategoryDto, req: AuthenticatedRequest): import(".prisma/client").Prisma.PrismaPromise<import(".prisma/client").Prisma.BatchPayload>;
    remove(id: string, req: AuthenticatedRequest): import(".prisma/client").Prisma.PrismaPromise<import(".prisma/client").Prisma.BatchPayload>;
}
