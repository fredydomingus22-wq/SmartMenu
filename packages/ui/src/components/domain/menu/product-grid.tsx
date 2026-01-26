"use client";

import { ReactNode } from "react";
import { cn } from "../../../lib/utils";

interface ProductGridProps {
    children: ReactNode;
    columns?: 2 | 3 | 4 | 5;
    className?: string;
}

/**
 * Unified Grid for Product items.
 * Standardizes responsive behavior (Mobile 2 cols, Desktop Configurable).
 */
export function ProductGrid({
    children,
    columns = 4,
    className
}: ProductGridProps) {
    const gridCols = {
        2: "grid-cols-2 lg:grid-cols-2",
        3: "grid-cols-2 lg:grid-cols-3",
        4: "grid-cols-2 lg:grid-cols-4",
        5: "grid-cols-2 lg:grid-cols-5",
    }[columns];

    return (
        <div className={cn(
            "grid gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-12",
            gridCols,
            className
        )}>
            {children}
        </div>
    );
}
