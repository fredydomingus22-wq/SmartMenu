import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name);
  private readonly jwtSecret: string;

  constructor(private configService: ConfigService) {
    this.jwtSecret = this.configService.get<string>('JWT_SECRET') || '';
    if (!this.jwtSecret) {
      this.logger.error('JWT_SECRET is not defined in environment variables');
      throw new Error('JWT_SECRET configuration missing');
    }
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      this.logger.warn('Initial Request rejected: No bearer token found');
      throw new UnauthorizedException('Authentication token missing');
    }

    try {
      // Robust Validation Strategy: "Dual Try"
      // 1. Try verifying with the secret treated as a Raw String (Standard)
      // 2. If signature fails, try treating secret as Base64 (Common Supabase)

      let payload: any;
      try {
        payload = jwt.verify(token, this.jwtSecret);
      } catch (err: any) {
        if (err.message === 'invalid signature') {
          // Fallback: Try decoding the secret from Base64
          const bufferSecret = Buffer.from(this.jwtSecret, 'base64');
          try {
            payload = jwt.verify(token, bufferSecret);
            this.logger.debug('Token verified using Base64 decoded secret');
          } catch (innerErr) {
            throw innerErr; // Throw original or new error if both fail
          }
        } else {
          throw err;
        }
      }

      // Map Supabase Payload to our Internal User Interface
      request.user = {
        userId: payload.sub,
        email: payload.email,
        role: payload.role || 'authenticated',
        // Extract Metadata (Supabase specific structure)
        tenantId:
          payload.app_metadata?.tenant_id ||
          payload.user_metadata?.tenant_id ||
          '',
        organizationId:
          payload.app_metadata?.organization_id ||
          payload.user_metadata?.organization_id ||
          '',
      };

      return true;
    } catch (error: any) {
      this.logger.warn(`Token validation failed: ${error.message}`);
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  private extractTokenFromHeader(request: any): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
