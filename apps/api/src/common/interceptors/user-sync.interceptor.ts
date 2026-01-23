import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { UsersService } from '../../users/users.service';

@Injectable()
export class UserSyncInterceptor implements NestInterceptor {
  private readonly logger = new Logger(UserSyncInterceptor.name);

  constructor(private readonly usersService: UsersService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Only run if user is authenticated via AuthGuard
    if (user && user.userId) {
      try {
        // JIT Sync Logic:
        // 1. Check if profile exists in DB (Single Source of Truth)
        let profile = await this.usersService.findById(user.userId);

        if (!profile) {
          this.logger.log(
            `UserProfile missing for ${user.userId}. Triggering JIT Sync...`,
          );
          // 2. If missing, create it immediately
          profile = await this.usersService.syncUser({
            id: user.userId,
            email: user.email,
          });
        }

        // 3. Enrich Request User with Fresh DB Data (Overrides Stale JWT Claims)
        request.user.tenantId = profile.tenantId;
        request.user.organizationId = profile.organizationId;
        request.user.role = profile.role; // Ensure RBAC uses DB role
      } catch (error: any) {
        this.logger.error(
          `JIT Sync Failed for ${user.userId}: ${error.message}`,
        );
        // We do NOT block the request if sync fails, but tenantId might be missing.
        // Actually, if sync fails, most operations will fail anyway due to missing tenantId.
        // Let's allow it to proceed and fail at the Controller/Service layer if needed.
      }
    }

    return next.handle();
  }
}
