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
exports.OrdersPublicController = void 0;
const common_1 = require("@nestjs/common");
const supabase_auth_guard_1 = require("../common/guards/supabase-auth.guard");
const public_decorator_1 = require("../common/decorators/public.decorator");
const orders_service_1 = require("./orders.service");
const create_order_dto_1 = require("./dto/create-order.dto");
let OrdersPublicController = class OrdersPublicController {
    ordersService;
    constructor(ordersService) {
        this.ordersService = ordersService;
    }
    async create(createOrderDto, req) {
        const userId = req.user?.userId;
        return this.ordersService.create(createOrderDto, createOrderDto.tenantId, createOrderDto.organizationId, userId);
    }
    async findOne(id) {
        return this.ordersService.findOnePublic(id);
    }
};
exports.OrdersPublicController = OrdersPublicController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_order_dto_1.CreateOrderDto, Object]),
    __metadata("design:returntype", Promise)
], OrdersPublicController.prototype, "create", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OrdersPublicController.prototype, "findOne", null);
exports.OrdersPublicController = OrdersPublicController = __decorate([
    (0, common_1.Controller)('public/orders'),
    (0, common_1.UseGuards)(supabase_auth_guard_1.SupabaseAuthGuard),
    __metadata("design:paramtypes", [orders_service_1.OrdersService])
], OrdersPublicController);
//# sourceMappingURL=orders-public.controller.js.map