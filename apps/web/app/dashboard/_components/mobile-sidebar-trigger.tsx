"use client";

import { Button, NavItem } from "@smart-menu/ui";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@smart-menu/ui";
import { Menu } from "lucide-react";
import { DashboardSidebar } from "./dashboard-sidebar";

interface MobileSidebarTriggerProps {
    navItems: NavItem[];
}

export function MobileSidebarTrigger({ navItems }: MobileSidebarTriggerProps) {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 border-r-0 w-72">
                <SheetTitle className="sr-only">Menu de Navegação</SheetTitle>
                <DashboardSidebar navItems={navItems} className="w-full border-none shadow-none" />
            </SheetContent>
        </Sheet>
    );
}
