import { UsersService } from './users.service';
import { AuthenticatedRequest } from '../common/interfaces/request.interface';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    syncUser(req: AuthenticatedRequest, body: {
        restaurantName?: string;
    }): Promise<{
        organization: {
            id: string;
            email: string | null;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            taxId: string | null;
            address: string | null;
            city: string | null;
            country: string | null;
            phone: string | null;
        } | null;
        tenant: {
            id: string;
            email: string | null;
            name: string;
            organizationId: string;
            createdAt: Date;
            updatedAt: Date;
            address: string | null;
            city: string | null;
            phone: string | null;
            slug: string;
            plan: import(".prisma/client").$Enums.PlanTier;
            description: string | null;
            whatsapp: string | null;
            instagram: string | null;
            facebook: string | null;
            website: string | null;
            images: string[];
            fiscalName: string | null;
            nif: string | null;
        } | null;
    } & {
        id: string;
        email: string;
        name: string | null;
        role: import(".prisma/client").$Enums.Role;
        organizationId: string | null;
        tenantId: string | null;
        createdAt: Date;
    }>;
    getMe(req: AuthenticatedRequest): Promise<({
        organization: {
            id: string;
            email: string | null;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            taxId: string | null;
            address: string | null;
            city: string | null;
            country: string | null;
            phone: string | null;
        } | null;
        tenant: {
            id: string;
            email: string | null;
            name: string;
            organizationId: string;
            createdAt: Date;
            updatedAt: Date;
            address: string | null;
            city: string | null;
            phone: string | null;
            slug: string;
            plan: import(".prisma/client").$Enums.PlanTier;
            description: string | null;
            whatsapp: string | null;
            instagram: string | null;
            facebook: string | null;
            website: string | null;
            images: string[];
            fiscalName: string | null;
            nif: string | null;
        } | null;
    } & {
        id: string;
        email: string;
        name: string | null;
        role: import(".prisma/client").$Enums.Role;
        organizationId: string | null;
        tenantId: string | null;
        createdAt: Date;
    }) | null>;
}
