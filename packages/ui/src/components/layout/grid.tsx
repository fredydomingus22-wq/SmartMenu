"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface GridProps {
    children: ReactNode;
    columns?: 1 | 2 | 3 | 4 | 5 | 6 | 12;
    gap?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
    className?: string;
}

export function Grid({
    children,
    columns = 1,
    gap = "md",
    className = ""
}: GridProps) {
    const columnClasses = {
        1: "grid-cols-1",
        2: "grid-cols-2",
        3: "grid-cols-3",
        4: "grid-cols-4",
        5: "grid-cols-5",
        6: "grid-cols-6",
        12: "grid-cols-12"
    };

    const gapClasses = {
        xs: "gap-1",
        sm: "gap-2",
        md: "gap-4",
        lg: "gap-6",
        xl: "gap-8",
        "2xl": "gap-12",
        "3xl": "gap-16"
    };

    return (
        <div className={cn(
            "grid",
            columnClasses[columns],
            gapClasses[gap],
            className
        )}>
            {children}
        </div>
    );
}