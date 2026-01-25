"use client";

import { cn } from "@/lib/utils";

interface SpacerProps {
    size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
    className?: string;
}

export function Spacer({ size = "md", className = "" }: SpacerProps) {
    const sizeClasses = {
        xs: "h-1",
        sm: "h-2",
        md: "h-4",
        lg: "h-6",
        xl: "h-8",
        "2xl": "h-12",
        "3xl": "h-16"
    };

    return <div className={cn(sizeClasses[size], className)} />;
}