"use client";

import { ReactNode } from "react";
import { cn } from "../../lib/utils";
import { PageContainer } from "./page-container";

interface SectionProps {
    children: ReactNode;
    className?: string;
    innerContainer?: boolean;
    spacing?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
    id?: string;
}

export function Section({
    children,
    className = "",
    innerContainer = true,
    spacing = "md",
    id
}: SectionProps) {
    const spacingClasses = {
        xs: "py-4 sm:py-6",
        sm: "py-8 sm:py-12",
        md: "py-12 sm:py-16",
        lg: "py-16 sm:py-24",
        xl: "py-24 sm:py-32",
        "2xl": "py-32 sm:py-48",
        "3xl": "py-48 sm:py-64"
    };

    const content = innerContainer ? (
        <PageContainer>{children}</PageContainer>
    ) : (
        children
    );

    return (
        <section
            id={id}
            className={cn(
                "w-full relative overflow-hidden",
                spacingClasses[spacing],
                className
            )}
        >
            {content}
        </section>
    );
}
