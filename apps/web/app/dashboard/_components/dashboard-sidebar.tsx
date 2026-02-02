"use client";

import Link from "next/link";
import { DashboardNav, NavItem, NavGroup, ScrollArea, useSidebar } from "@smart-menu/ui";
import Image from "next/image";

interface DashboardSidebarProps {
    navItems?: NavItem[];
    navGroups?: NavGroup[];
}

/**
 * Dashboard Sidebar - App-level component for desktop navigation.
 * Wraps the library DashboardNav with branding and footer.
 */
export function DashboardSidebar({ navItems, navGroups }: DashboardSidebarProps) {
    const { collapsed } = useSidebar();

    return (
        <div className="flex flex-col h-screen overflow-hidden border-r bg-white dark:bg-zinc-950">
            {/* Branding */}
            <div className="p-4 border-b flex items-center justify-center">
                <Link href="/dashboard" className="flex items-center gap-2">
                    {collapsed ? (
                        <div className="h-8 w-8 relative">
                            <Image
                                src="/favicon.png"
                                alt="SmartMenu Logo"
                                fill
                                className="object-contain"
                            />
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <div className="h-8 w-8 relative">
                                <Image
                                    src="/logo.png"
                                    alt="SmartMenu Logo"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                            <span className="text-xl font-bold tracking-tight text-primary">SmartMenu</span>
                        </div>
                    )}
                </Link>
            </div>

            {/* Navigation */}
            <ScrollArea className="flex-1 p-2">
                <DashboardNav
                    items={navItems}
                    groups={navGroups}
                    collapsed={collapsed}
                />
            </ScrollArea>

            {/* Footer */}
            {!collapsed && (
                <div className="p-4 border-t text-xs text-muted-foreground">
                    © 2026 SmartMenu
                </div>
            )}
        </div>
    );
}

