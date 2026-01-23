"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupabaseStrategy = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const passport_jwt_1 = require("passport-jwt");
const config_1 = require("@nestjs/config");
const jwks_rsa_1 = require("jwks-rsa");
let SupabaseStrategy = class SupabaseStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy, 'supabase') {
    configService;
    constructor(configService) {
        const supabaseUrl = configService.get('SUPABASE_URL');
        if (!supabaseUrl) {
            throw new Error('SUPABASE_URL is not defined. Required for JWKS verification.');
        }
        const jwksUri = `${supabaseUrl}/auth/v1/.well-known/jwks.json`;
        console.log(`[SupabaseStrategy] Configured JWKS: ${jwksUri}`);
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKeyProvider: (0, jwks_rsa_1.passportJwtSecret)({
                cache: true,
                rateLimit: true,
                jwksRequestsPerMinute: 5,
                jwksUri: jwksUri,
            }),
            algorithms: ['RS256', 'ES256'],
        });
        this.configService = configService;
    }
    validate(payload) {
        if (!payload) {
            throw new common_1.UnauthorizedException();
        }
        const tenantId = payload.app_metadata?.tenant_id || payload.user_metadata?.tenant_id;
        const organizationId = payload.app_metadata?.organization_id ||
            payload.user_metadata?.organization_id;
        const user = {
            userId: payload.sub,
            email: payload.email,
            role: payload.role || 'authenticated',
            tenantId: tenantId || '',
            organizationId: organizationId || '',
        };
        return user;
    }
};
exports.SupabaseStrategy = SupabaseStrategy;
exports.SupabaseStrategy = SupabaseStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], SupabaseStrategy);
//# sourceMappingURL=supabase.strategy.js.map