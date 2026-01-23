"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';

export interface CartItem {
    productId: string;
    variantId?: string;
    name: string;
    price: number;
    quantity: number;
    notes?: string;
    imageUrl?: string;
    options?: {
        valueId: string;
        name: string;
        price: number;
    }[];
}

interface CartContextType {
    items: CartItem[];
    addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
    removeItem: (productId: string, optionsHash?: string) => void;
    updateQuantity: (productId: string, quantity: number, optionsHash?: string) => void;
    clearCart: () => void;
    totalAmount: number;
    totalItems: number;
    tenantId: string | null;
    organizationId: string | null;
    setTenantContext: (tenantId: string, organizationId: string) => void;
    isCartOpen: boolean;
    openCart: () => void;
    closeCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [tenantId, setTenantId] = useState<string | null>(null);
    const [organizationId, setOrganizationId] = useState<string | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);

    // Persistence Key
    const STORAGE_KEY = tenantId ? `smartmenu_cart_${tenantId}` : 'smartmenu_cart_guest';

    // Hydrate from LocalStorage
    useEffect(() => {
        if (!tenantId) return; // Wait for tenantId to be set

        const savedCart = localStorage.getItem(STORAGE_KEY);
        if (savedCart) {
            try {
                const parsed = JSON.parse(savedCart);
                // Deferring the update to avoid synchronous cascading renders warning in Next.js
                // especially during hydration or initial mount phases.
                setTimeout(() => setItems(parsed), 0);
            } catch (error) {
                console.error("Failed to parse cart", error);
            }
        }
        setTimeout(() => setIsLoaded(true), 0);
    }, [tenantId, STORAGE_KEY]);

    // Persist to LocalStorage
    useEffect(() => {
        if (isLoaded && tenantId) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
        }
    }, [items, isLoaded, tenantId, STORAGE_KEY]);

    const getItemId = (item: { productId: string; options?: { valueId: string }[] }) => {
        const optionsPart = item.options
            ?.map(o => o.valueId)
            .sort()
            .join(',') || 'none';
        return `${item.productId}-${optionsPart}`;
    };

    const addItem = (newItem: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
        setItems((prev) => {
            const newItemId = getItemId(newItem);
            const existing = prev.find(i => getItemId(i) === newItemId);

            if (existing) {
                return prev.map(i =>
                    getItemId(i) === newItemId
                        ? { ...i, quantity: i.quantity + (newItem.quantity || 1) }
                        : i
                );
            }
            return [...prev, { ...newItem, quantity: newItem.quantity || 1 }];
        });
    };

    const removeItem = (productId: string, optionsHash?: string) => {
        setItems(prev => prev.filter(i => {
            const itemId = getItemId(i);
            const targetId = optionsHash ? `${productId}-${optionsHash}` : `${productId}-none`;
            return itemId !== targetId;
        }));
    };

    const updateQuantity = (productId: string, quantity: number, optionsHash?: string) => {
        const targetId = optionsHash ? `${productId}-${optionsHash}` : `${productId}-none`;
        if (quantity <= 0) {
            setItems(prev => prev.filter(i => getItemId(i) !== targetId));
            return;
        }
        setItems(prev => prev.map(i =>
            getItemId(i) === targetId ? { ...i, quantity } : i
        ));
    };

    const clearCart = () => setItems([]);

    const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

    const setTenantContext = (tid: string, oid: string) => {
        setTenantId(tid);
        setOrganizationId(oid);
    };

    const openCart = () => setIsCartOpen(true);
    const closeCart = () => setIsCartOpen(false);

    return (
        <CartContext.Provider value={{
            items,
            addItem,
            removeItem,
            updateQuantity,
            clearCart,
            totalAmount,
            totalItems,
            tenantId,
            organizationId,
            setTenantContext,
            isCartOpen,
            openCart,
            closeCart
        }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
}
