"use client";

import { ProductGrid as SharedGrid } from "@smart-menu/ui";
import { ReactNode } from "react";

interface ProductGridProps {
    children: ReactNode;
    columns?: 2 | 3 | 4 | 5;
}

export function ProductGrid({ children, columns = 4 }: ProductGridProps) {
    return (
        <SharedGrid columns={columns}>
            {children}
        </SharedGrid>
    );
}
