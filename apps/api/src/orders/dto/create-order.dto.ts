export class CreateOrderItemDto {
  productId!: string;
  quantity!: number;
  notes?: string;
  options?: {
    valueId: string;
    price?: number;
  }[];
}

export type OrderType = 'DINE_IN' | 'DINE_IN_GENERAL' | 'TAKEAWAY';

export class CreateOrderDto {
  tenantId!: string;
  organizationId!: string;
  tableId?: string;
  orderType?: OrderType;
  deliveryAddress?: string;
  items!: CreateOrderItemDto[];
  loyaltyRewardId?: string;
}
