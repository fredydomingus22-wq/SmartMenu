"use client";

import Link from "next/link";
import { DashboardNav, NavItem, ScrollArea } from "@smart-menu/ui";

interface DashboardSidebarProps {
    navItems: NavItem[];
}

/**
 * Dashboard Sidebar - App-level component for desktop navigation.
 * Wraps the library DashboardNav with branding and footer.
 */
export function DashboardSidebar({ navItems }: DashboardSidebarProps) {
    return (
        <div className="flex flex-col h-full">
            {/* Branding */}
            <div className="p-4 border-b">
                <Link href="/dashboard" className="flex items-center gap-2">
                    <span className="text-xl font-bold tracking-tight text-orange-600">SmartMenu</span>
                </Link>
            </div>

            {/* Navigation */}
            <ScrollArea className="flex-1 p-4">
                <DashboardNav items={navItems} />
            </ScrollArea>

            {/* Footer */}
            <div className="p-4 border-t text-xs text-muted-foreground">
                © 2026 SmartMenu
            </div>
        </div>
    );
}
