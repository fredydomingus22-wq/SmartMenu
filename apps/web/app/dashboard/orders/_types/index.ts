export interface OrderItem {
    id: string;
    quantity: number;
    notes?: string;
    product: {
        name: string;
    };
}

export interface Order {
    id: string;
    total: number;
    status: string;
    createdAt: string;
    table: {
        number: string;
    } | null;
    items: OrderItem[];
}
