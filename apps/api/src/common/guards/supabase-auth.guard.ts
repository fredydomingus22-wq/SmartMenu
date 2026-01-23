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

    // Trigger lazy sync if tenantId is missing or incorrectly set to userId
    if (user && (!user.tenantId || user.tenantId === user.userId)) {
      try {
        const profile = await this.usersService.syncUser({
          id: user.userId,
          email: user.email,
        });

        if (profile) {
          // Update request user with the newly synced data
          if (profile.tenantId) request.user.tenantId = profile.tenantId;
          if (profile.organizationId)
            request.user.organizationId = profile.organizationId;
        }
      } catch (err: unknown) {
        const error = err instanceof Error ? err : new Error(String(err));
        this.logger.error(
          `Lazy-sync failed for user ${user?.userId}: ${error.message}`,
        );
        // We don't fail the request here, but the data might be missing
      }
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
