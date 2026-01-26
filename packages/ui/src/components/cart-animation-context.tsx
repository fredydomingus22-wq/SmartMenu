"use client";

import React, { createContext, useContext, useState, useRef, useCallback } from 'react';

export interface AnimatingItem {
    src: string;
    startRect: DOMRect;
    onComplete?: () => void;
}

interface CartAnimationContextType {
    startAnimation: (item: AnimatingItem) => void;
    registerCartIcon: (element: HTMLElement | null) => void;
    cartIconRect: DOMRect | null;
    animatingItem: AnimatingItem | null;
    clearAnimation: () => void;
}

const CartAnimationContext = createContext<CartAnimationContextType | undefined>(undefined);

export function CartAnimationProvider({ children }: { children: React.ReactNode }) {
    const [animatingItem, setAnimatingItem] = useState<AnimatingItem | null>(null);
    const [cartIconRect, setCartIconRect] = useState<DOMRect | null>(null);
    const cartIconRef = useRef<HTMLElement | null>(null);

    const registerCartIcon = useCallback((element: HTMLElement | null) => {
        cartIconRef.current = element;
    }, []);

    const startAnimation = useCallback((item: AnimatingItem) => {
        // Refresh destination rect just in case
        if (cartIconRef.current) {
            setCartIconRect(cartIconRef.current.getBoundingClientRect());
        }
        setAnimatingItem(item);
    }, []);

    const clearAnimation = useCallback(() => {
        setAnimatingItem(null);
    }, []);

    return (
        <CartAnimationContext.Provider value={{
            startAnimation,
            registerCartIcon,
            cartIconRect,
            animatingItem,
            clearAnimation
        }}>
            {children}
        </CartAnimationContext.Provider>
    );
}

export function useCartAnimation() {
    const context = useContext(CartAnimationContext);
    if (!context) {
        throw new Error("useCartAnimation must be used within a CartAnimationProvider");
    }
    return context;
}
