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
exports.ProductsController = void 0;
const common_1 = require("@nestjs/common");
const products_service_1 = require("./products.service");
const create_product_dto_1 = require("./dto/create-product.dto");
const update_product_dto_1 = require("./dto/update-product.dto");
const supabase_auth_guard_1 = require("../common/guards/supabase-auth.guard");
let ProductsController = class ProductsController {
    productsService;
    constructor(productsService) {
        this.productsService = productsService;
    }
    async create(createProductDto, req) {
        try {
            return await this.productsService.create(createProductDto, req.user.tenantId, req.user.organizationId);
        }
        catch (err) {
            const error = err;
            console.error('[ProductsController] Error in create:', error.message, error.stack);
            if (error.code === 'P2003') {
                throw new common_1.BadRequestException('Categoria ou dado relacionado não encontrado');
            }
            throw error;
        }
    }
    async findAll(req, categoryId) {
        try {
            return await this.productsService.findAll(req.user.tenantId, req.user.organizationId, categoryId);
        }
        catch (err) {
            const error = err;
            console.error('[ProductsController] Error in findAll:', error.message);
            throw error;
        }
    }
    async findOne(id, req) {
        try {
            const product = await this.productsService.findOne(id, req.user.tenantId, req.user.organizationId);
            if (!product) {
                throw new common_1.NotFoundException('Produto não encontrado');
            }
            return product;
        }
        catch (err) {
            const error = err;
            console.error(`[ProductsController] Error in findOne (${id}):`, error.message);
            throw error;
        }
    }
    async update(id, updateProductDto, req) {
        try {
            return await this.productsService.update(id, updateProductDto, req.user.tenantId, req.user.organizationId);
        }
        catch (err) {
            const error = err;
            console.error(`[ProductsController] Error in update (${id}):`, error.message, error.stack);
            throw error;
        }
    }
    remove(id, req) {
        return this.productsService.remove(id, req.user.tenantId, req.user.organizationId);
    }
    createOption(productId, createOptionDto, req) {
        return this.productsService.createOption(productId, createOptionDto, req.user.tenantId, req.user.organizationId);
    }
    findOptions(productId, req) {
        return this.productsService.findOptions(productId, req.user.tenantId, req.user.organizationId);
    }
    removeOption(optionId, req) {
        return this.productsService.removeOption(optionId, req.user.tenantId, req.user.organizationId);
    }
};
exports.ProductsController = ProductsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_product_dto_1.CreateProductDto, Object]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('categoryId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_product_dto_1.UpdateProductDto, Object]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/options'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "createOption", null);
__decorate([
    (0, common_1.Get)(':id/options'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "findOptions", null);
__decorate([
    (0, common_1.Delete)('options/:optionId'),
    __param(0, (0, common_1.Param)('optionId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "removeOption", null);
exports.ProductsController = ProductsController = __decorate([
    (0, common_1.Controller)('products'),
    (0, common_1.UseGuards)(supabase_auth_guard_1.SupabaseAuthGuard),
    __metadata("design:paramtypes", [products_service_1.ProductsService])
], ProductsController);
//# sourceMappingURL=products.controller.js.map