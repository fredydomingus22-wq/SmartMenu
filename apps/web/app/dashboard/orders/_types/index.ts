export interface OrderItem {
    id: string;
    quantity: number;
    price: number;
    notes?: string;
    product: {
        name: string;
    };
    options?: {
        id: string;
        optionValue: {
            name: string;
        };
    }[];
}

export interface Order {
    id: string;
    total: number;
    status: string;
    orderType: string;
    cancellationReason?: string | null;
    createdAt: string;
    table: {
        number: string;
    } | null;
    items: OrderItem[];
}
