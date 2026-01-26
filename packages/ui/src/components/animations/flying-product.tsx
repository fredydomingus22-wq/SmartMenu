"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import { AnimatingItem } from "../cart-animation-context";

export interface FlyingProductProps {
    animatingItem: AnimatingItem | null;
    cartIconRect: DOMRect | null;
    onAnimationComplete: () => void;
}

export function FlyingProduct({ animatingItem, cartIconRect, onAnimationComplete }: FlyingProductProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    if (!mounted || !animatingItem || !cartIconRect) return null;

    const initial = {
        top: animatingItem.startRect.top,
        left: animatingItem.startRect.left,
        width: animatingItem.startRect.width,
        height: animatingItem.startRect.height,
        opacity: 1,
        scale: 1,
        borderRadius: "0.75rem",
        zIndex: "var(--z-flying-item)",
        position: "fixed" as const,
    };

    const target = {
        top: cartIconRect.top + (cartIconRect.height / 2) - 10,
        left: cartIconRect.left + (cartIconRect.width / 2) - 10,
        width: 20,
        height: 20,
        opacity: 0,
        scale: 0.2,
        borderRadius: "50%",
        rotate: 360,
    };

    return createPortal(
        <AnimatePresence>
            <motion.img
                key={animatingItem.src + Date.now()}
                src={animatingItem.src}
                initial={initial}
                animate={target}
                transition={{
                    duration: 0.8,
                    ease: "easeInOut",
                }}
                onAnimationComplete={() => {
                    animatingItem.onComplete?.();
                    onAnimationComplete();
                }}
                className="pointer-events-none shadow-2xl object-cover"
                style={{ position: 'fixed' }}
            />
        </AnimatePresence>,
        document.body
    );
}
