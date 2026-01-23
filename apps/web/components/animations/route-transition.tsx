"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface RouteTransitionProps {
    children: ReactNode;
    className?: string;
}

export function RouteTransition({ children, className }: RouteTransitionProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
            transition={{
                duration: 0.4,
                ease: [0.22, 1, 0.36, 1] // Custom cubic-bezier for a more "premium" feel
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}
