"use client";

import Link from "next/link";
import { DashboardNav, NavItem, NavGroup, ScrollArea, useSidebar } from "@smart-menu/ui";

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
        <div className="flex flex-col h-full">
            {/* Branding */}
            <div className="p-4 border-b flex items-center justify-center">
                <Link href="/dashboard" className="flex items-center gap-2">
                    {collapsed ? (
                        <span className="text-xl font-bold text-primary">SM</span>
                    ) : (
                        <span className="text-xl font-bold tracking-tight text-primary">SmartMenu</span>
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

