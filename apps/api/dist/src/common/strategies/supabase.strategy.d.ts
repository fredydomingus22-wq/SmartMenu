import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthenticatedUser } from '../interfaces/request.interface';
interface SupabaseJwtPayload {
    sub: string;
    email: string;
    role?: string;
    app_metadata: {
        tenant_id?: string;
        [key: string]: any;
    };
    user_metadata: {
        tenant_id?: string;
        [key: string]: any;
    };
}
declare const SupabaseStrategy_base: new (...args: any[]) => Strategy;
export declare class SupabaseStrategy extends SupabaseStrategy_base {
    private configService;
    constructor(configService: ConfigService);
    validate(payload: SupabaseJwtPayload): AuthenticatedUser;
}
export {};
