export class CreateOrderItemDto {
  productId!: string;
  quantity!: number;
  notes?: string;
  options?: {
    valueId: string;
    price?: number;
  }[];
}

export class CreateOrderDto {
  tenantId!: string;
  organizationId!: string;
  tableId?: string;
  items!: CreateOrderItemDto[];
}
