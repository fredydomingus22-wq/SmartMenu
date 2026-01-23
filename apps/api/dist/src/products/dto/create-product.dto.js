"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateProductOptionFromProductDto = exports.CreateProductDto = void 0;
class CreateProductDto {
    name;
    description;
    price;
    categoryId;
    imageUrl;
    isAvailable;
    images;
    options;
}
exports.CreateProductDto = CreateProductDto;
class CreateProductOptionFromProductDto {
    name;
    description;
    minChoices;
    maxChoices;
    isRequired;
    values;
}
exports.CreateProductOptionFromProductDto = CreateProductOptionFromProductDto;
//# sourceMappingURL=create-product.dto.js.map