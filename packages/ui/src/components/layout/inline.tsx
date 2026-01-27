"use client";

import { ReactNode } from "react";
import { cn } from "../../lib/utils";

interface InlineProps {
    children: ReactNode;
    gap?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
    align?: "start" | "center" | "end" | "baseline" | "stretch";
    justify?: "start" | "center" | "end" | "between" | "around" | "evenly";
    wrap?: boolean;
    className?: string;
}

export function Inline({
    children,
    gap = "md",
    align = "center",
    justify = "start",
    wrap = false,
    className = ""
}: InlineProps) {
    const gapClasses = {
        xs: "gap-1",
        sm: "gap-2",
        md: "gap-4",
        lg: "gap-6",
        xl: "gap-8",
        "2xl": "gap-12",
        "3xl": "gap-16"
    };

    const alignClasses = {
        start: "items-start",
        center: "items-center",
        end: "items-end",
        baseline: "items-baseline",
        stretch: "items-stretch"
    };

    const justifyClasses = {
        start: "justify-start",
        center: "justify-center",
        end: "justify-end",
        between: "justify-between",
        around: "justify-around",
        evenly: "justify-evenly"
    };

    return (
        <div className={cn(
            "flex flex-row",
            gapClasses[gap],
            alignClasses[align],
            justifyClasses[justify],
            wrap && "flex-wrap",
            className
        )}>
            {children}
        </div>
    );
}