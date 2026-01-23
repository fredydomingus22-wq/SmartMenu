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
exports.MenuController = void 0;
const common_1 = require("@nestjs/common");
const menu_service_1 = require("./menu.service");
let MenuController = class MenuController {
    menuService;
    constructor(menuService) {
        this.menuService = menuService;
    }
    getMenu(tenantId) {
        return this.menuService.getPublicMenu(tenantId);
    }
    getMenuConfig(tenantId) {
        return this.menuService.getMenuConfig(tenantId);
    }
    async getProduct(tenantId, productId) {
        try {
            const product = await this.menuService.getPublicProduct(tenantId, productId);
            if (!product) {
                throw new common_1.NotFoundException('Product not found');
            }
            return product;
        }
        catch (error) {
            console.error('[MenuController] Error fetching product:', error);
            throw error;
        }
    }
};
exports.MenuController = MenuController;
__decorate([
    (0, common_1.Get)(':tenantId'),
    __param(0, (0, common_1.Param)('tenantId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MenuController.prototype, "getMenu", null);
__decorate([
    (0, common_1.Get)(':tenantId/config'),
    __param(0, (0, common_1.Param)('tenantId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MenuController.prototype, "getMenuConfig", null);
__decorate([
    (0, common_1.Get)(':tenantId/product/:productId'),
    __param(0, (0, common_1.Param)('tenantId')),
    __param(1, (0, common_1.Param)('productId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], MenuController.prototype, "getProduct", null);
exports.MenuController = MenuController = __decorate([
    (0, common_1.Controller)('public/menu'),
    __metadata("design:paramtypes", [menu_service_1.MenuService])
], MenuController);
//# sourceMappingURL=menu.controller.js.map