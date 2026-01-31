"use client";

import { Menu } from "lucide-react";
import {
    DashboardNav,
    NavItem,
    Button,
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    Input,
    ScrollArea
} from "@smart-menu/ui";
import { UserNav } from "./user-nav";
import { User } from "@supabase/supabase-js";
import { ServiceRequestsWidget } from "./service-requests-widget";

interface DashboardHeaderProps {
    user: User;
    navItems: NavItem[];
}

/**
 * Dashboard Header - App-level component.
 * Composes library components (Sheet, DashboardNav) without duplication.
 */
export function DashboardHeader({ user, navItems }: DashboardHeaderProps) {
    const tenantId = user.user_metadata?.tenantId as string;

    return (
        <header className="sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b bg-background/95 px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            {/* Left: Mobile Menu Trigger */}
            <div className="flex items-center gap-3">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="md:hidden">
                            <Menu className="h-5 w-5 text-muted-foreground" />
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
                    className="w-full bg-background"
                />
            </div>

            {/* Right: Actions & User Nav */}
            <div className="flex items-center gap-2">
                {tenantId && <ServiceRequestsWidget tenantId={tenantId} />}
                <UserNav user={user} />
            </div>
        </header>
    );
}
