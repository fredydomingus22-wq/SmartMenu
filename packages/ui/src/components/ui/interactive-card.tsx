"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { ReactNode } from "react";
import { cn } from "../../lib/utils";

interface InteractiveCardProps extends HTMLMotionProps<"div"> {
    children: ReactNode;
    glass?: boolean;
}

export function InteractiveCard({
    children,
    className,
    glass = false,
    ...props
}: InteractiveCardProps) {
    return (
        <motion.div
            whileHover={{ scale: 1.01, y: -2 }}
            whileTap={{ scale: 0.98 }}
            transition={{
                type: "spring",
                stiffness: 400,
                damping: 25
            }}
            className={cn(
                "rounded-3xl border transition-shadow hover:shadow-xl",
                glass ? "bg-white/5 dark:bg-zinc-900/40 backdrop-blur-md border-white/10" : "bg-card text-card-foreground shadow-sm",
                className
            )}
            {...props}
        >
            {children}
        </motion.div>
    );
}
