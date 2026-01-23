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
var UserSyncInterceptor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSyncInterceptor = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("../../users/users.service");
let UserSyncInterceptor = UserSyncInterceptor_1 = class UserSyncInterceptor {
    usersService;
    logger = new common_1.Logger(UserSyncInterceptor_1.name);
    constructor(usersService) {
        this.usersService = usersService;
    }
    async intercept(context, next) {
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        if (user && user.userId) {
            try {
                let profile = await this.usersService.findById(user.userId);
                if (!profile) {
                    this.logger.log(`UserProfile missing for ${user.userId}. Triggering JIT Sync...`);
                    profile = await this.usersService.syncUser({
                        id: user.userId,
                        email: user.email,
                    });
                }
                request.user.tenantId = profile.tenantId;
                request.user.organizationId = profile.organizationId;
                request.user.role = profile.role;
            }
            catch (error) {
                this.logger.error(`JIT Sync Failed for ${user.userId}: ${error.message}`);
            }
        }
        return next.handle();
    }
};
exports.UserSyncInterceptor = UserSyncInterceptor;
exports.UserSyncInterceptor = UserSyncInterceptor = UserSyncInterceptor_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UserSyncInterceptor);
//# sourceMappingURL=user-sync.interceptor.js.map