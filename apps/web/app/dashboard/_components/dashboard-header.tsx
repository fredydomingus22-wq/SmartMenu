"use client";

import * as React from "react";
import { useState, useEffect, useMemo, Fragment } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Menu, Plus, ChevronRight, UtensilsCrossed, ShoppingBag, ClipboardList } from "lucide-react";
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
    ScrollArea,
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    Breadcrumb,
    BreadcrumbList,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbSeparator,
    BreadcrumbPage,
} from "@smart-menu/ui";
import { UserNav } from "./user-nav";
import { User } from "@supabase/supabase-js";
import { ServiceRequestsWidget } from "./service-requests-widget";

interface DashboardHeaderProps {
    user: User;
    navItems: NavItem[];
}

// Route to label mapping for breadcrumbs
const routeLabels: Record<string, string> = {
    dashboard: "Dashboard",
    menu: "Cardápio",
    analytics: "Relatórios",
    orders: "Pedidos",
    kds: "Cozinha",
    loyalty: "Fidelidade",
    settings: "Configurações",
    tables: "Mesas & QR",
    products: "Produtos",
    categories: "Categorias",
};

/**
 * Dashboard Header - App-level component.
 * Composes library components (Sheet, DashboardNav) without duplication.
 */
export function DashboardHeader({ user, navItems }: DashboardHeaderProps) {
    const [mounted, setMounted] = useState(false);
    const pathname = usePathname();
    const tenantId = user.user_metadata?.tenantId as string;

    useEffect(() => {
        setMounted(true);
    }, []);

    // Generate breadcrumb items from pathname
    const breadcrumbs = useMemo(() => {
        const segments = pathname.split("/").filter(Boolean);
        return segments.map((segment, index) => {
            const href = "/" + segments.slice(0, index + 1).join("/");
            const label = routeLabels[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
            const isLast = index === segments.length - 1;
            return { href, label, isLast };
        });
    }, [pathname]);

    return (
        <header className="sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b bg-background/95 px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            {/* Left: Mobile Menu Trigger + Breadcrumbs */}
            <div className="flex items-center gap-3">
                {mounted ? (
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
                ) : (
                    <Button variant="ghost" size="icon" className="md:hidden" disabled>
                        <Menu className="h-5 w-5 text-muted-foreground opacity-50" />
                    </Button>
                )}

                <Breadcrumb className="hidden md:flex">
                    <BreadcrumbList>
                        {breadcrumbs.map((crumb) => (
                            <Fragment key={crumb.href}>
                                <BreadcrumbItem>
                                    {crumb.isLast ? (
                                        <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                                    ) : (
                                        <BreadcrumbLink asChild>
                                            <Link href={crumb.href}>{crumb.label}</Link>
                                        </BreadcrumbLink>
                                    )}
                                </BreadcrumbItem>
                                {!crumb.isLast && (
                                    <BreadcrumbSeparator>
                                        <ChevronRight className="h-4 w-4" />
                                    </BreadcrumbSeparator>
                                )}
                            </Fragment>
                        ))}
                    </BreadcrumbList>
                </Breadcrumb>
            </div>

            {/* Center: Search (Desktop) */}
            <div className="hidden lg:flex flex-1 max-w-md mx-4">
                <Input
                    type="search"
                    placeholder="Pesquisar..."
                    className="w-full bg-background"
                />
            </div>

            {/* Right: Quick Actions & User Nav */}
            <div className="flex items-center gap-2">
                {mounted ? (
                    <>
                        {/* Quick Actions */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="default" size="sm" className="gap-1.5">
                                    <Plus className="h-4 w-4" />
                                    <span className="hidden sm:inline">Criar</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuItem asChild>
                                    <Link href="/dashboard/menu/products/new" className="flex items-center gap-2">
                                        <UtensilsCrossed className="h-4 w-4" />
                                        Novo Produto
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href="/dashboard/orders/new" className="flex items-center gap-2">
                                        <ShoppingBag className="h-4 w-4" />
                                        Novo Pedido
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href="/dashboard/settings/tables" className="flex items-center gap-2">
                                        <ClipboardList className="h-4 w-4" />
                                        Nova Mesa
                                    </Link>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {tenantId && <ServiceRequestsWidget tenantId={tenantId} />}
                        <UserNav user={user} />
                    </>
                ) : (
                    <div className="w-20 h-9 bg-muted animate-pulse rounded-md" />
                )}
            </div>
        </header>
    );
}

