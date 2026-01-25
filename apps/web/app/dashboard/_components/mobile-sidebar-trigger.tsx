"use client";

import { Button } from "@smart-menu/ui";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@smart-menu/ui";
import { Menu } from "lucide-react";
import { DashboardSidebar } from "./dashboard-sidebar";

// We need to redefine navItems here or pass them as props. 
// For simplicity, I'll keep them here or import a constant.
const navItems = [
    { label: "Visão Geral", icon: "layout-dashboard", href: "/dashboard" },
    { label: "Cardápio", icon: "utensils", href: "/dashboard/menu" },
    { label: "Pedidos", icon: "shopping-bag", href: "/dashboard/orders" },
    { label: "Cozinha (KDS)", icon: "chef-hat", href: "/dashboard/kds" },
    { label: "Fidelidade", icon: "gift", href: "/dashboard/loyalty" },
    { label: "Mesas & QR", icon: "clipboard-list", href: "/dashboard/settings/tables" },
    { label: "Configurações", icon: "settings", href: "/dashboard/settings" },
];

export function MobileSidebarTrigger() {
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
