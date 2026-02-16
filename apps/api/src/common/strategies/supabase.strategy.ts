import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { passportJwtSecret } from 'jwks-rsa';
import { AuthenticatedUser } from '../interfaces/request.interface';

export interface SupabaseJwtPayload {
  sub: string;
  email: string;
  role?: string;
  app_metadata: {
    tenant_id?: string;
    organization_id?: string;
    [key: string]: unknown;
  };
  user_metadata: {
    tenant_id?: string;
    organization_id?: string;
    [key: string]: unknown;
  };
}

@Injectable()
export class SupabaseStrategy extends PassportStrategy(Strategy, 'supabase') {
  constructor(private configService: ConfigService) {
    const supabaseUrl = configService.get<string>('SUPABASE_URL');

    if (!supabaseUrl) {
      throw new Error(
        'SUPABASE_URL is not defined. Required for JWKS verification.',
      );
    }

    const jwksUri = `${supabaseUrl}/auth/v1/.well-known/jwks.json`;
    console.log(`[SupabaseStrategy] Configured JWKS: ${jwksUri}`);

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: jwksUri,
      }),
      algorithms: ['RS256', 'ES256'], // Supabase typically uses HS256 (dev) or RS256/ES256 (prod/custom)
      // Note: For local HS256 secrets, jwks-rsa MIGHT fail if it expects asymmetric keys.
      // But user's case is ES256 (Asymmetric), so JWKS is the correct solution.
    });
  }

  validate(payload: SupabaseJwtPayload): AuthenticatedUser {
    if (!payload) {
      throw new UnauthorizedException();
    }

    const tenantId: string | undefined =
      payload.app_metadata?.tenant_id || payload.user_metadata?.tenant_id;
    const organizationId: string | undefined =
      payload.app_metadata?.organization_id ||
      payload.user_metadata?.organization_id;

    // We allow missing tenantId here so the /users/sync endpoint can handle it.
    // However, other controllers will still check for it if they need it.

    const user: AuthenticatedUser = {
      userId: payload.sub,
      email: payload.email,
      role: payload.role || 'authenticated',
      tenantId: tenantId || '', // Default to empty string if not found
      organizationId: organizationId || '',
    };

    return user;
  }
}
