import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/types/product.types';

export interface CartItem {
    product: Product;
    quantity: number;
}

interface CartState {
    items: CartItem[];
    addItem: (product: Product, quantity?: number) => void;
    removeItem: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
    getTotalItems: () => number;
    getTotalPrice: () => number;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],

            addItem: (product, quantity = 1) => {
                const items = get().items;
                const existing = items.find((i) => i.product.id === product.id);

                if (existing) {
                    set({
                        items: items.map((i) =>
                            i.product.id === product.id
                                ? { ...i, quantity: i.quantity + quantity }
                                : i,
                        ),
                    });
                } else {
                    set({ items: [...items, { product, quantity }] });
                }
            },

            removeItem: (productId) => {
                set({ items: get().items.filter((i) => i.product.id !== productId) });
            },

            updateQuantity: (productId, quantity) => {
                if (quantity <= 0) {
                    get().removeItem(productId);
                    return;
                }
                set({
                    items: get().items.map((i) =>
                        i.product.id === productId ? { ...i, quantity } : i,
                    ),
                });
            },

            clearCart: () => set({ items: [] }),

            getTotalItems: () =>
                get().items.reduce((total, i) => total + i.quantity, 0),

            getTotalPrice: () =>
                get().items.reduce(
                    (total, i) => total + Number(i.product.price) * i.quantity,
                    0,
                ),
        }),
        { name: 'unicampo_cart' },
    ),
);
