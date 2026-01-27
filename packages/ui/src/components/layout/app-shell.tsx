"use client";

import { ReactNode } from "react";
import { cn } from "../../lib/utils";

interface AppShellProps {
    children: ReactNode;
    header?: ReactNode;
    footer?: ReactNode;
    sidebar?: ReactNode;
    className?: string;
    safeArea?: boolean;
}

/**
 * Unified App Shell - supports both dashboard (with sidebar) and consumer (without) layouts.
 * Uses 100dvh for mobile viewport stability.
 */
export function AppShell({
    children,
    header,
    footer,
    sidebar,
    className = "",
    safeArea = true,
}: AppShellProps) {
    const safeAreaClasses = safeArea
        ? "pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] px-[env(safe-area-inset-left)]"
        : "";

    return (
        <div
            className={cn(
                "relative flex h-[100dvh] w-full flex-row overflow-hidden bg-white dark:bg-zinc-950 bg-background",
                className
            )}
        >
            {/* Sidebar - Desktop Only */}
            {sidebar && (
                <aside className={cn(
                    "hidden md:flex w-64 shrink-0 border-r bg-background flex-col z-30",
                    safeArea && "pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] pl-[env(safe-area-inset-left)]"
                )}>
                    {sidebar}
                </aside>
            )}

            {/* Main Content Stack */}
            <div className="relative flex flex-1 flex-col min-w-0 h-full overflow-hidden">
                {header && (
                    <header className={cn(
                        "sticky top-0 z-header bg-background/95 backdrop-blur-xl border-b shrink-0",
                        safeArea && "pt-[env(safe-area-inset-top)] px-[env(safe-area-inset-left,env(safe-area-inset-right))]"
                    )}>
                        {header}
                    </header>
                )}

                <main id="main-content" className="relative flex-1 overflow-y-auto overscroll-contain focus:outline-none">
                    {children}
                </main>

                {footer && (
                    <footer className={cn(
                        "sticky bottom-0 z-category-nav border-t bg-background shrink-0",
                        safeArea && "pb-[env(safe-area-inset-bottom)] px-[env(safe-area-inset-left,env(safe-area-inset-right))]"
                    )}>
                        {footer}
                    </footer>
                )}
            </div>
        </div>
    );
}
