"use client";

import { ReactNode } from "react";
import { cn } from "../../../lib/utils";

interface PublicMenuHeaderProps {
    logo?: ReactNode;
    title: ReactNode;
    subtitle?: ReactNode;
    actions?: ReactNode;
    className?: string;
}

/**
 * Unified Header for Public Menu pages.
 * Enforces z-index from Design System variables and standardizes layout.
 */
export function PublicMenuHeader({
    logo,
    title,
    subtitle,
    actions,
    className
}: PublicMenuHeaderProps) {
    return (
        <header className={cn(
            "sticky top-0 w-full bg-background/80 backdrop-blur-xl border-b transition-all duration-300",
            "z-[var(--z-header,50)]",
            className
        )}>
            <div className="w-full px-4 sm:px-8 lg:px-12 h-16 sm:h-20 flex items-center justify-between gap-4">
                {/* Brand Section */}
                <div className="flex items-center gap-3 overflow-hidden">
                    {logo && (
                        <div className="relative h-10 w-10 sm:h-12 sm:w-12 rounded-xl overflow-hidden flex-shrink-0 border bg-white">
                            {logo}
                        </div>
                    )}
                    <div className="flex flex-col min-w-0">
                        <div className="font-black text-sm sm:text-lg tracking-tight truncate uppercase leading-none">
                            {title}
                        </div>
                        {subtitle && (
                            <div className="mt-1">
                                {subtitle}
                            </div>
                        )}
                    </div>
                </div>

                {/* Actions Section */}
                <div className="flex items-center gap-2">
                    {actions}
                </div>
            </div>
        </header>
    );
}
