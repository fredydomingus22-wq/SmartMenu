import { Request } from 'express';

export interface AuthenticatedUser {
  id: string;
  tenantId: string;
  organizationId: string;
  email?: string;
}

export interface AuthenticatedRequest extends Request {
  user: AuthenticatedUser;
}
