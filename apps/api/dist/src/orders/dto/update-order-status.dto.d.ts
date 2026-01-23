export declare enum OrderStatus {
    PENDING = "PENDING",
    CONFIRMED = "CONFIRMED",
    PREPARING = "PREPARING",
    READY = "READY",
    DELIVERED = "DELIVERED",
    CANCELLED = "CANCELLED"
}
export declare class UpdateOrderStatusDto {
    status: OrderStatus;
}
