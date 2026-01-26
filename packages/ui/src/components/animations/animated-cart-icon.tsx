"use client";

import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../lib/utils";

interface AnimatedCartIconProps {
    state: "idle" | "active" | "success";
    itemCount: number;
    className?: string;
}

export function AnimatedCartIcon({ state, itemCount, className }: AnimatedCartIconProps) {
    return (
        <div className={cn("relative flex items-center justify-center", className)}>
            <motion.svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={false}
                animate={state === "success" ? { scale: [1, 1.2, 1], rotate: [0, -5, 5, 0] } : { scale: 1, rotate: 0 }}
                transition={{ duration: 0.4 }}
            >
                {/* Cart Body */}
                <motion.path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />

                {/* Lid / Top Line */}
                <motion.path
                    d="M3 6h18"
                    animate={state === "active" ? { originX: "3px", rotate: -15, y: -2 } : { rotate: 0, y: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                />

                <motion.path d="M16 10a4 4 0 0 1-8 0" />
            </motion.svg>

            {/* Badge */}
            <AnimatePresence>
                {itemCount > 0 && (
                    <motion.div
                        key={itemCount}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 500, damping: 25 }}
                        className="absolute -top-3 -right-3 h-5 w-5 bg-destructive text-destructive-foreground text-[10px] flex items-center justify-center rounded-full font-bold border-2 border-background"
                    >
                        {itemCount}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
