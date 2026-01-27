export class OrderCreatedEvent {
  constructor(
    public readonly orderId: string,
    public readonly tenantId: string,
    public readonly userId: string | null,
    public readonly items: { productId: string; quantity: number }[],
    public readonly total: number,
  ) {}
}
