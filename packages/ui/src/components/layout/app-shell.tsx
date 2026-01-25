"use client";

import { ReactNode } from "react";

interface AppShellProps {
    children: ReactNode;
    header?: ReactNode;
    footer?: ReactNode;
    className?: string;
    safeArea?: boolean;
}

export function AppShell({ children, header, footer, className = "", safeArea = true }: AppShellProps) {
    const safeAreaClasses = safeArea ? "pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]" : "";

    return (
        <div className={`min-h-[100dvh] flex flex-col ${safeAreaClasses} ${className}`}>
            {header && (
                <header className="sticky top-0 z-50 w-full">
                    {header}
                </header>
            )}
            <main className="flex-1 overflow-y-auto">
                {children}
            </main>
            {footer && (
                <footer className="sticky bottom-0 z-50 w-full">
                    {footer}
                </footer>
            )}
        </div>
    );
}