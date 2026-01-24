"use client";

import { useCartAnimation } from "./cart-animation-context";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export function FlyingProduct() {
    const { animatingItem, cartIconRect, clearAnimation } = useCartAnimation();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    if (!mounted || !animatingItem || !cartIconRect) return null;

    // Calculate deltas
    // We want to move from startRect (fixed) to cartIconRect (fixed)

    // Initial position: startRect.left, startRect.top
    // Target position: cartIconRect.left, cartIconRect.top

    // We can use layoutId or simple absolute positioning with AnimatePresence

    const initial = {
        top: animatingItem.startRect.top,
        left: animatingItem.startRect.left,
        width: animatingItem.startRect.width,
        height: animatingItem.startRect.height,
        opacity: 1,
        scale: 1,
        borderRadius: "0.75rem", // rounded-xl
        zIndex: 9999,
        position: "fixed" as const, // fixed to viewport
    };

    const target = {
        top: cartIconRect.top + (cartIconRect.height / 2) - 10, // Center to center roughly
        left: cartIconRect.left + (cartIconRect.width / 2) - 10,
        width: 20, // Shrimp to nothing
        height: 20,
        opacity: 0,
        scale: 0.2,
        borderRadius: "50%",
        rotate: 360, // Spin effect
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
                    // Custom bezier for arc effect? 
                    // For now simple direct flight, complex arc needs SVG path or keyframes
                }}
                onAnimationComplete={() => {
                    animatingItem.onComplete?.();
                    clearAnimation();
                }}
                className="pointer-events-none shadow-2xl object-cover"
                style={{ position: 'fixed' }} // Redundant but safe
            />
        </AnimatePresence>,
        document.body
    );
}
