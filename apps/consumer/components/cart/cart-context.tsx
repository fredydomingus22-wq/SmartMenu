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

export type OrderType = 'DINE_IN' | 'DINE_IN_GENERAL' | 'TAKEAWAY';

export interface LoyaltyReward {
    id: string;
    name: string;
    description?: string | null;
    pointsRequired: number;
    discountAmount?: number | null;
    productId?: string | null;
    isActive: boolean;
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
    // Order Flow
    tableId: string | null;
    setTableId: (id: string | null) => void;
    orderType: OrderType | null;
    setOrderType: (type: OrderType) => void;
    deliveryAddress: string | null;
    setDeliveryAddress: (addr: string | null) => void;
    // Loyalty Rewards
    appliedReward: LoyaltyReward | null;
    applyReward: (reward: LoyaltyReward) => void;
    removeReward: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [tenantId, setTenantId] = useState<string | null>(null);
    const [organizationId, setOrganizationId] = useState<string | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    // Order Flow State
    const [tableId, setTableId] = useState<string | null>(null);
    const [orderType, setOrderType] = useState<OrderType | null>(null);
    const [deliveryAddress, setDeliveryAddress] = useState<string | null>(null);

    // Loyalty Rewards State
    const [appliedReward, setAppliedReward] = useState<LoyaltyReward | null>(null);

    const applyReward = (reward: LoyaltyReward) => setAppliedReward(reward);
    const removeReward = () => setAppliedReward(null);

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

    const rawTotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

    const totalAmount = React.useMemo(() => {
        let currentTotal = rawTotal;

        if (!appliedReward) return currentTotal;

        // Apply Discount
        if (appliedReward.discountAmount) {
            currentTotal = Math.max(0, currentTotal - Number(appliedReward.discountAmount));
        }

        // Handle Free Product (One instance of linked productId is free)
        if (appliedReward.productId) {
            const rewardItem = items.find(i => i.productId === appliedReward.productId);
            if (rewardItem) {
                currentTotal -= Number(rewardItem.price);
            }
        }

        return currentTotal;
    }, [rawTotal, appliedReward, items]);

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
            closeCart,
            // Order Flow
            tableId,
            setTableId,
            orderType,
            setOrderType,
            deliveryAddress,
            setDeliveryAddress,
            // Loyalty Rewards
            appliedReward,
            applyReward,
            removeReward
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
