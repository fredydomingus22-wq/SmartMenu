import {
  Injectable,
  ExecutionContext,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

import { UsersService } from '../../users/users.service';
import { AuthenticatedRequest } from '../interfaces/request.interface';

@Injectable()
export class SupabaseAuthGuard extends AuthGuard('supabase') {
  constructor(
    private usersService: UsersService,
    private reflector: Reflector,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }
    const result = (await super.canActivate(context)) as boolean;
    if (!result) return false;

    const request: AuthenticatedRequest = context.switchToHttp().getRequest();
    const user = request.user;

    // Trigger lazy sync or forced fetch if tenantId is missing or incorrectly set to userId
    if (
      user &&
      (!user.tenantId ||
        user.tenantId === user.userId ||
        user.tenantId.length < 10)
    ) {
      this.logger.debug(
        `Forcing tenant resolution for user ${user.email} (current tenantId: '${user.tenantId}')`,
      );
      try {
        const profile = await this.usersService.syncUser({
          id: user.userId,
          email: user.email,
        });

        if (profile) {
          this.logger.log(
            `Resolved tenantId: ${profile.tenantId} for user ${user.email}`,
          );
          // Force update request user
          if (profile.tenantId) request.user.tenantId = profile.tenantId;
          if (profile.organizationId)
            request.user.organizationId = profile.organizationId;
        }
      } catch (err: unknown) {
        this.logger.error(`Failed to force resolve tenant for ${user.userId}`);
      }
    } else if (user) {
      this.logger.debug(
        `Tenant context valid: ${user.tenantId} for ${user.email}`,
      );
    }

    return true;
  }

  private readonly logger = new Logger(SupabaseAuthGuard.name);

  handleRequest<TUser = unknown>(
    err: unknown,
    user: TUser,
    info: unknown,
  ): TUser {
    if (err || !user) {
      const errorMsg =
        (err instanceof Error ? err.message : '') ||
        (info instanceof Error ? info.message : '') ||
        'Unknown error';
      this.logger.error(`Authentication failed: ${errorMsg}`);

      if (info) {
        this.logger.debug(`Auth Debug Info: ${JSON.stringify(info)}`);
      }

      throw (
        (err instanceof Error ? err : null) ||
        new UnauthorizedException('Invalid or missing authentication token')
      );
    }
    return user;
  }
}
