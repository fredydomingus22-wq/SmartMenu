export class StockLowEvent {
  constructor(
    public readonly productId: string,
    public readonly tenantId: string,
    public readonly currentStock: number,
    public readonly threshold: number,
  ) {}
}
