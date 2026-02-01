"use client";

import { ReactNode, useState, createContext, useContext } from "react";
import { PanelLeftClose, PanelLeft } from "lucide-react";
import { cn } from "../../lib/utils";

interface SidebarContextType {
    collapsed: boolean;
    setCollapsed: (collapsed: boolean) => void;
}

const SidebarContext = createContext<SidebarContextType>({
    collapsed: false,
    setCollapsed: () => { },
});

export const useSidebar = () => useContext(SidebarContext);

interface AppShellProps {
    children: ReactNode;
    header?: ReactNode;
    footer?: ReactNode;
    sidebar?: ReactNode;
    className?: string;
    safeArea?: boolean;
    collapsible?: boolean;
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
    collapsible = true,
}: AppShellProps) {
    const [collapsed, setCollapsed] = useState(false);

    const safeAreaClasses = safeArea
        ? "pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] px-[env(safe-area-inset-left)]"
        : "";

    return (
        <SidebarContext.Provider value={{ collapsed, setCollapsed }}>
            <div
                className={cn(
                    "relative flex h-[100dvh] w-full flex-row overflow-hidden bg-white dark:bg-zinc-950 bg-background",
                    className
                )}
            >
                {/* Sidebar - Desktop Only */}
                {sidebar && (
                    <aside className={cn(
                        "hidden md:flex shrink-0 border-r bg-background flex-col z-30 transition-all duration-300 ease-in-out",
                        collapsed ? "w-16" : "w-64",
                        safeArea && "pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] pl-[env(safe-area-inset-left)]"
                    )}>
                        <div className="flex-1 overflow-hidden">
                            {sidebar}
                        </div>
                        {collapsible && (
                            <button
                                onClick={() => setCollapsed(!collapsed)}
                                className="flex h-12 w-full items-center justify-center border-t text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                                aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                            >
                                {collapsed ? (
                                    <PanelLeft className="h-5 w-5" />
                                ) : (
                                    <PanelLeftClose className="h-5 w-5" />
                                )}
                            </button>
                        )}
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

                    <main id="main-content" className="relative flex-1 overflow-y-auto overflow-x-clip overscroll-contain focus:outline-none">
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
        </SidebarContext.Provider>
    );
}

