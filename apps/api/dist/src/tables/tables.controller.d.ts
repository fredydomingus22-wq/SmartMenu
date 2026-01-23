import { TablesService } from './tables.service';
import type { AuthenticatedRequest } from '../common/interfaces/request.interface';
export declare class TablesController {
    private readonly tablesService;
    constructor(tablesService: TablesService);
    create(body: {
        number: number;
    }, req: AuthenticatedRequest): Promise<{
        number: number;
        id: string;
        organizationId: string;
        tenantId: string;
        qrCode: string | null;
    }>;
    findAll(req: AuthenticatedRequest): Promise<({
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
    remove(id: string, req: AuthenticatedRequest): Promise<{
        number: number;
        id: string;
        organizationId: string;
        tenantId: string;
        qrCode: string | null;
    }>;
}
