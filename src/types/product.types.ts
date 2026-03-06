export interface Category {
    id: string;
    name: string;
    slug: string;
    description?: string;
    imageUrl?: string;
    isActive: boolean;
}

export interface Inventory {
    id: string;
    quantity: number;
    minStock: number;
    productId: string;
}

export interface Product {
    id: string;
    name: string;
    slug: string;
    description?: string;
    price: string;
    images: string[];
    isActive: boolean;
    categoryId: string;
    category: Category;
    inventory?: Inventory;
    createdAt: string;
}

export interface ProductsResponse {
    data: Product[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export interface ProductQuery {
    search?: string;
    categoryId?: string;
    page?: number;
    limit?: number;
}
