export type OrderStatus =
    | 'PENDING'
    | 'CONFIRMED'
    | 'PROCESSING'
    | 'SHIPPED'
    | 'DELIVERED'
    | 'CANCELLED';

export type PaymentStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'REFUNDED';

export interface OrderItem {
    id: string;
    quantity: number;
    unitPrice: string;
    productId: string;
    product: {
        name: string;
        images: string[];
        slug: string;
    };
}

export interface Order {
    id: string;
    status: OrderStatus;
    total: string;
    shippingAddress: string;
    notes?: string;
    paymentId?: string;
    paymentStatus: PaymentStatus;
    createdAt: string;
    userId: string;
    items: OrderItem[];
}
