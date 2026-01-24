"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface ProductGridProps {
    children: ReactNode;
    columns?: 2 | 3 | 4 | 5;
}

export function ProductGrid({ children, columns = 4 }: ProductGridProps) {
    // Mobile: Always 2
    // Desktop: Controlled by prop
    const gridCols = {
        2: "grid-cols-2 lg:grid-cols-2",
        3: "grid-cols-2 lg:grid-cols-3",
        4: "grid-cols-2 lg:grid-cols-4",
        5: "grid-cols-2 lg:grid-cols-5",
    }[columns];

    return (
        <div className={`grid ${gridCols} gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-12`}>
            {children}
        </div>
    );
}
