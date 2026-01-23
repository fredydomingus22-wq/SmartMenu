import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UsersService } from '../../users/users.service';
declare const SupabaseAuthGuard_base: import("@nestjs/passport").Type<import("@nestjs/passport").IAuthGuard>;
export declare class SupabaseAuthGuard extends SupabaseAuthGuard_base {
    private usersService;
    private reflector;
    constructor(usersService: UsersService, reflector: Reflector);
    canActivate(context: ExecutionContext): Promise<boolean>;
    private readonly logger;
    handleRequest<TUser = unknown>(err: unknown, user: TUser, info: unknown): TUser;
}
export {};
