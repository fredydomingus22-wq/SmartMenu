export class OrderStatusUpdatedEvent {
    constructor(
        public readonly orderId: string,
        public readonly tenantId: string,
        public readonly userId: string | null,
        public readonly status: string,
        public readonly total: number,
    ) { }
}
