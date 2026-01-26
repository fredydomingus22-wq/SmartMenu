"use client";

import { FlyingProduct as SharedFlyingProduct } from "@smart-menu/ui";
import { useCartAnimation } from "./cart-animation-context";

export function FlyingProduct() {
    const { animatingItem, cartIconRect, clearAnimation } = useCartAnimation();

    return (
        <SharedFlyingProduct
            animatingItem={animatingItem}
            cartIconRect={cartIconRect}
            onAnimationComplete={clearAnimation}
        />
    );
}
