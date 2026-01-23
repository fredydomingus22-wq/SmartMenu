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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoyaltyController = void 0;
const common_1 = require("@nestjs/common");
const loyalty_service_1 = require("./loyalty.service");
const supabase_auth_guard_1 = require("../common/guards/supabase-auth.guard");
const update_loyalty_config_dto_1 = require("./dto/update-loyalty-config.dto");
const create_loyalty_reward_dto_1 = require("./dto/create-loyalty-reward.dto");
const public_decorator_1 = require("../common/decorators/public.decorator");
let LoyaltyController = class LoyaltyController {
    loyaltyService;
    constructor(loyaltyService) {
        this.loyaltyService = loyaltyService;
    }
    getConfig(req) {
        return this.loyaltyService.getOrCreateConfig(req.user.tenantId);
    }
    getPublicConfig(tenantId) {
        return this.loyaltyService.getOrCreateConfig(tenantId);
    }
    updateConfig(req, dto) {
        return this.loyaltyService.updateConfig(req.user.tenantId, dto);
    }
    createReward(req, dto) {
        return this.loyaltyService.createReward(req.user.tenantId, dto);
    }
    updateReward(id, req, dto) {
        return this.loyaltyService.updateReward(id, req.user.tenantId, dto);
    }
    deleteReward(id, req) {
        return this.loyaltyService.deleteReward(id, req.user.tenantId);
    }
    getPublicRewards(tenantId) {
        return this.loyaltyService.getRewards(tenantId);
    }
    getMyPoints(req) {
        return this.loyaltyService.getCustomerPoints(req.user.userId, req.user.tenantId);
    }
    getMyTransactions(req) {
        return this.loyaltyService.getTransactions(req.user.userId, req.user.tenantId);
    }
    redeem(req, rewardId) {
        return this.loyaltyService.redeemReward(req.user.userId, req.user.tenantId, rewardId);
    }
};
exports.LoyaltyController = LoyaltyController;
__decorate([
    (0, common_1.Get)('config'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], LoyaltyController.prototype, "getConfig", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('config/public'),
    __param(0, (0, common_1.Query)('tenantId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], LoyaltyController.prototype, "getPublicConfig", null);
__decorate([
    (0, common_1.Patch)('config'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_loyalty_config_dto_1.UpdateLoyaltyConfigDto]),
    __metadata("design:returntype", void 0)
], LoyaltyController.prototype, "updateConfig", null);
__decorate([
    (0, common_1.Post)('rewards'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_loyalty_reward_dto_1.CreateLoyaltyRewardDto]),
    __metadata("design:returntype", void 0)
], LoyaltyController.prototype, "createReward", null);
__decorate([
    (0, common_1.Patch)('rewards/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], LoyaltyController.prototype, "updateReward", null);
__decorate([
    (0, common_1.Delete)('rewards/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], LoyaltyController.prototype, "deleteReward", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('rewards/public'),
    __param(0, (0, common_1.Query)('tenantId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], LoyaltyController.prototype, "getPublicRewards", null);
__decorate([
    (0, common_1.Get)('my-points'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], LoyaltyController.prototype, "getMyPoints", null);
__decorate([
    (0, common_1.Get)('my-transactions'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], LoyaltyController.prototype, "getMyTransactions", null);
__decorate([
    (0, common_1.Post)('redeem/:rewardId'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('rewardId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], LoyaltyController.prototype, "redeem", null);
exports.LoyaltyController = LoyaltyController = __decorate([
    (0, common_1.Controller)('loyalty'),
    (0, common_1.UseGuards)(supabase_auth_guard_1.SupabaseAuthGuard),
    __metadata("design:paramtypes", [loyalty_service_1.LoyaltyService])
], LoyaltyController);
//# sourceMappingURL=loyalty.controller.js.map