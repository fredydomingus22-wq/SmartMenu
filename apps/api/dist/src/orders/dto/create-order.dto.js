"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateOrderDto = exports.CreateOrderItemDto = void 0;
class CreateOrderItemDto {
    productId;
    quantity;
    notes;
    options;
}
exports.CreateOrderItemDto = CreateOrderItemDto;
class CreateOrderDto {
    tenantId;
    organizationId;
    tableId;
    items;
}
exports.CreateOrderDto = CreateOrderDto;
//# sourceMappingURL=create-order.dto.js.map