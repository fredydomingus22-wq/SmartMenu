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
exports.TenantsController = void 0;
const common_1 = require("@nestjs/common");
const tenants_service_1 = require("./tenants.service");
const update_tenant_dto_1 = require("./dto/update-tenant.dto");
const update_organization_dto_1 = require("./dto/update-organization.dto");
const update_branding_dto_1 = require("./dto/update-branding.dto");
const update_menu_config_dto_1 = require("./dto/update-menu-config.dto");
const supabase_auth_guard_1 = require("../common/guards/supabase-auth.guard");
const public_decorator_1 = require("../common/decorators/public.decorator");
let TenantsController = class TenantsController {
    tenantsService;
    constructor(tenantsService) {
        this.tenantsService = tenantsService;
    }
    getTenant(req) {
        return this.tenantsService.findTenant(req.user.tenantId, req.user.organizationId);
    }
    updateTenant(req, updateTenantDto) {
        return this.tenantsService.updateTenant(req.user.tenantId, req.user.organizationId, updateTenantDto);
    }
    getOrganization(req) {
        return this.tenantsService.findOrganization(req.user.organizationId);
    }
    updateOrganization(req, updateOrganizationDto) {
        return this.tenantsService.updateOrganization(req.user.organizationId, updateOrganizationDto);
    }
    getBranding(id) {
        return this.tenantsService.findBranding(id);
    }
    updateBranding(req, updateBrandingDto) {
        return this.tenantsService.updateBranding(req.user.tenantId, updateBrandingDto);
    }
    updateMenuConfig(req, updateMenuConfigDto) {
        return this.tenantsService.updateMenuConfig(req.user.tenantId, updateMenuConfigDto.sections);
    }
};
exports.TenantsController = TenantsController;
__decorate([
    (0, common_1.Get)('me'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TenantsController.prototype, "getTenant", null);
__decorate([
    (0, common_1.Patch)('me'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_tenant_dto_1.UpdateTenantDto]),
    __metadata("design:returntype", void 0)
], TenantsController.prototype, "updateTenant", null);
__decorate([
    (0, common_1.Get)('organization'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TenantsController.prototype, "getOrganization", null);
__decorate([
    (0, common_1.Patch)('organization'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_organization_dto_1.UpdateOrganizationDto]),
    __metadata("design:returntype", void 0)
], TenantsController.prototype, "updateOrganization", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(':id/branding'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TenantsController.prototype, "getBranding", null);
__decorate([
    (0, common_1.Patch)('me/branding'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_branding_dto_1.UpdateBrandingDto]),
    __metadata("design:returntype", void 0)
], TenantsController.prototype, "updateBranding", null);
__decorate([
    (0, common_1.Patch)('me/menu-config'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_menu_config_dto_1.UpdateMenuConfigDto]),
    __metadata("design:returntype", void 0)
], TenantsController.prototype, "updateMenuConfig", null);
exports.TenantsController = TenantsController = __decorate([
    (0, common_1.Controller)('tenants'),
    (0, common_1.UseGuards)(supabase_auth_guard_1.SupabaseAuthGuard),
    __metadata("design:paramtypes", [tenants_service_1.TenantsService])
], TenantsController);
//# sourceMappingURL=tenants.controller.js.map