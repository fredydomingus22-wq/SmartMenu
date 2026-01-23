export declare class CreateOrderItemDto {
    productId: string;
    quantity: number;
    notes?: string;
    options?: {
        valueId: string;
        price?: number;
    }[];
}
export declare class CreateOrderDto {
    tenantId: string;
    organizationId: string;
    tableId?: string;
    items: CreateOrderItemDto[];
}
