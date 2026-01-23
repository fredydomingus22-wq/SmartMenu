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
var SupabaseAuthGuard_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupabaseAuthGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const passport_1 = require("@nestjs/passport");
const public_decorator_1 = require("../decorators/public.decorator");
const users_service_1 = require("../../users/users.service");
let SupabaseAuthGuard = SupabaseAuthGuard_1 = class SupabaseAuthGuard extends (0, passport_1.AuthGuard)('supabase') {
    usersService;
    reflector;
    constructor(usersService, reflector) {
        super();
        this.usersService = usersService;
        this.reflector = reflector;
    }
    async canActivate(context) {
        const isPublic = this.reflector.getAllAndOverride(public_decorator_1.IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (isPublic) {
            return true;
        }
        const result = (await super.canActivate(context));
        if (!result)
            return false;
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        if (user && (!user.tenantId || user.tenantId === user.userId)) {
            try {
                const profile = await this.usersService.syncUser({
                    id: user.userId,
                    email: user.email,
                });
                if (profile) {
                    if (profile.tenantId)
                        request.user.tenantId = profile.tenantId;
                    if (profile.organizationId)
                        request.user.organizationId = profile.organizationId;
                }
            }
            catch (err) {
                const error = err instanceof Error ? err : new Error(String(err));
                this.logger.error(`Lazy-sync failed for user ${user?.userId}: ${error.message}`);
            }
        }
        return true;
    }
    logger = new common_1.Logger(SupabaseAuthGuard_1.name);
    handleRequest(err, user, info) {
        if (err || !user) {
            const errorMsg = (err instanceof Error ? err.message : '') ||
                (info instanceof Error ? info.message : '') ||
                'Unknown error';
            this.logger.error(`Authentication failed: ${errorMsg}`);
            if (info) {
                this.logger.debug(`Auth Debug Info: ${JSON.stringify(info)}`);
            }
            throw ((err instanceof Error ? err : null) ||
                new common_1.UnauthorizedException('Invalid or missing authentication token'));
        }
        return user;
    }
};
exports.SupabaseAuthGuard = SupabaseAuthGuard;
exports.SupabaseAuthGuard = SupabaseAuthGuard = SupabaseAuthGuard_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        core_1.Reflector])
], SupabaseAuthGuard);
//# sourceMappingURL=supabase-auth.guard.js.map