"use client";

import { User } from "@supabase/supabase-js";
import { UserNav } from "./user-nav";
import { MobileSidebarTrigger } from "./mobile-sidebar-trigger";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
    NavItem,
} from "@smart-menu/ui";
import { usePathname } from "next/navigation";
import React from "react";
import { Search } from "lucide-react";
import { Input, PWAStatus } from "@smart-menu/ui";

interface DashboardHeaderProps {
    user: User;
    navItems: NavItem[];
}

export function DashboardHeader({ user, navItems }: DashboardHeaderProps) {
    const pathname = usePathname();
    const paths = pathname.split('/').filter(Boolean);

    // Map common paths to readable names
    const labels: Record<string, string> = {
        dashboard: "Dashboard",
        menu: "Cardápio",
        products: "Produtos",
        kds: "Cozinha (KDS)",
        orders: "Pedidos",
        settings: "Configurações",
        loyalty: "Fidelidade"
    };

    return (
        <header className="sticky top-0 z-[var(--z-header)] flex h-16 w-full items-center gap-4 border-b bg-background/95 backdrop-blur px-6 shadow-sm">
            <div className="flex items-center gap-4">
                <MobileSidebarTrigger navItems={navItems} />

                <Breadcrumb className="hidden md:flex">
                    <BreadcrumbList>
                        {paths.map((path, index) => {
                            const href = `/${paths.slice(0, index + 1).join('/')}`;
                            const isLast = index === paths.length - 1;
                            const label = labels[path] || path.charAt(0).toUpperCase() + path.slice(1);

                            return (
                                <React.Fragment key={path}>
                                    <BreadcrumbItem>
                                        {isLast ? (
                                            <BreadcrumbPage>{label}</BreadcrumbPage>
                                        ) : (
                                            <BreadcrumbLink href={href}>{label}</BreadcrumbLink>
                                        )}
                                    </BreadcrumbItem>
                                    {!isLast && <BreadcrumbSeparator />}
                                </React.Fragment>
                            );
                        })}
                    </BreadcrumbList>
                </Breadcrumb>
            </div>

            <div className="ml-auto flex items-center gap-4">
                {/* Search Input Placeholder */}
                <div className="relative hidden md:block w-64">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Pesquisar..."
                        className="w-full rounded-full bg-background pl-9 h-9 border-muted-foreground/20 focus-visible:ring-primary/20"
                    />
                </div>

                <PWAStatus />
                <UserNav user={user} />
            </div>
        </header>
    );
}
