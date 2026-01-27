"use client";

import { Menu } from "lucide-react";
import { DashboardNav, NavItem, Button, Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, Input, ScrollArea } from "@smart-menu/ui";
import { UserNav } from "./user-nav";
import { User } from "@supabase/supabase-js";

interface DashboardHeaderProps {
    user: User;
    navItems: NavItem[];
}

/**
 * Dashboard Header - App-level component.
 * Composes library components (Sheet, DashboardNav) without duplication.
 */
export function DashboardHeader({ user, navItems }: DashboardHeaderProps) {
    return (
        <div className="flex items-center justify-between px-4 py-3">
            {/* Left: Mobile Menu Trigger */}
            <div className="flex items-center gap-3">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="md:hidden">
                            <Menu className="h-5 w-5 text-zinc-600 dark:text-zinc-400" />
                            <span className="sr-only">Menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-72 p-0 flex flex-col">
                        <SheetHeader className="p-4 border-b shrink-0">
                            <SheetTitle className="text-lg font-bold">SmartMenu</SheetTitle>
                        </SheetHeader>
                        <ScrollArea className="flex-1 p-4">
                            <DashboardNav items={navItems} />
                        </ScrollArea>
                    </SheetContent>
                </Sheet>

                {/* Branding - Desktop */}
                <span className="hidden md:block text-lg font-bold tracking-tight">Dashboard</span>
            </div>

            {/* Center: Search (Desktop) */}
            <div className="hidden md:flex flex-1 max-w-md mx-4">
                <Input
                    type="search"
                    placeholder="Pesquisar..."
                    className="w-full"
                />
            </div>

            {/* Right: User Nav */}
            <UserNav user={user} />
        </div>
    );
}
