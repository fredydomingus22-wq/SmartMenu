import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { UsersService } from '../../users/users.service';
export declare class UserSyncInterceptor implements NestInterceptor {
    private readonly usersService;
    private readonly logger;
    constructor(usersService: UsersService);
    intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>>;
}
