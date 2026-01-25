"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface StackProps {
    children: ReactNode;
    direction?: "vertical" | "horizontal";
    gap?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
    align?: "start" | "center" | "end" | "stretch";
    justify?: "start" | "center" | "end" | "between" | "around" | "evenly";
    className?: string;
    wrap?: boolean;
}

export function Stack({
    children,
    direction = "vertical",
    gap = "md",
    align = "stretch",
    justify = "start",
    className = "",
    wrap = false
}: StackProps) {
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
            "flex",
            direction === "vertical" ? "flex-col" : "flex-row",
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