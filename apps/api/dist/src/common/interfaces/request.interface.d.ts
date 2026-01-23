import { Request } from 'express';
export interface AuthenticatedUser {
    userId: string;
    email: string;
    role: string;
    tenantId: string;
    organizationId: string;
}
export interface AuthenticatedRequest extends Request {
    user: AuthenticatedUser;
}
