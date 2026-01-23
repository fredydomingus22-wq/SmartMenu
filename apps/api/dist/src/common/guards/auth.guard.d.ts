import { CanActivate, ExecutionContext } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
export declare class AuthGuard implements CanActivate {
    private configService;
    private readonly logger;
    private readonly jwtSecret;
    constructor(configService: ConfigService);
    canActivate(context: ExecutionContext): Promise<boolean>;
    private extractTokenFromHeader;
}
