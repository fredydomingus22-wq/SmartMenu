import { PrismaService } from '../prisma/prisma.service';
export declare class TablesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createTableDto: {
        number: number;
        organizationId: string;
        tenantId: string;
    }): Promise<{
        number: number;
        id: string;
        organizationId: string;
        tenantId: string;
        qrCode: string | null;
    }>;
    findAll(tenantId: string): Promise<({
        _count: {
            orders: number;
        };
    } & {
        number: number;
        id: string;
        organizationId: string;
        tenantId: string;
        qrCode: string | null;
    })[]>;
    remove(id: string, tenantId: string): Promise<{
        number: number;
        id: string;
        organizationId: string;
        tenantId: string;
        qrCode: string | null;
    }>;
}
