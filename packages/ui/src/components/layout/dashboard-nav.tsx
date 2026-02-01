"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
    ChevronRight,
    LayoutDashboard,
    UtensilsCrossed,
    ShoppingBag,
    ChefHat,
    Gift,
    ClipboardList,
    Settings,
    LogOut,
    Home,
    User,
    Store,
    CreditCard,
    Bell,
    HelpCircle
} from "lucide-react";
import { cn } from "../../lib/utils";

const IconMap = {
    Home,
    LayoutDashboard,
    UtensilsCrossed,
    ShoppingBag,
    ChefHat,
    Gift,
    ClipboardList,
    Settings,
    LogOut,
    User,
    Store,
    CreditCard,
    Bell,
    HelpCircle
} as const;

export type IconName = keyof typeof IconMap;

export interface NavItem {
    label: string;
    icon: IconName;
    href: string;
    badge?: number | string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface DashboardNavProps {
    items?: NavItem[];
    groups?: NavGroup[];
    collapsed?: boolean;
    activeClassName?: string;
    inactiveClassName?: string;
}

export function DashboardNav({
    items,
    groups,
    collapsed = false,
    activeClassName = "text-primary dark:text-primary",
    inactiveClassName = "text-muted-foreground hover:text-foreground"
}: DashboardNavProps) {
    const pathname = usePathname();

    const renderNavItem = (item: NavItem) => {
        const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
        const IconComponent = IconMap[item.icon] || Home;

        return (
            <Link
                key={item.href}
                href={item.href}
                title={collapsed ? item.label : undefined}
                className={cn(
                    "group relative flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300",
                    collapsed && "justify-center px-3",
                    isActive ? activeClassName : inactiveClassName
                )}
            >
                {isActive && (
                    <motion.div
                        layoutId="active-nav"
                        className="absolute inset-0 bg-primary/10 dark:bg-primary/20 rounded-xl"
                        initial={false}
                        transition={{
                            type: "spring",
                            stiffness: 380,
                            damping: 30,
                        }}
                    />
                )}

                <div className="relative flex items-center gap-3">
                    <IconComponent className={cn(
                        "h-5 w-5 transition-transform duration-300 group-hover:scale-110",
                        isActive ? "text-primary" : "text-muted-foreground"
                    )} />
                    {!collapsed && <span className="tracking-tight">{item.label}</span>}
                </div>

                {!collapsed && (
                    <div className="relative flex items-center gap-2">
                        {item.badge !== undefined && (
                            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-bold text-primary-foreground">
                                {item.badge}
                            </span>
                        )}
                        <ChevronRight className={cn(
                            "h-4 w-4 transition-all duration-300",
                            isActive ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"
                        )} />
                    </div>
                )}
            </Link>
        );
    };

    // If groups are provided, render grouped navigation
    if (groups && groups.length > 0) {
        return (
            <nav className="space-y-6">
                {groups.map((group) => (
                    <div key={group.title} className="space-y-1">
                        {!collapsed && (
                            <h3 className="mb-2 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
                                {group.title}
                            </h3>
                        )}
                        <div className="space-y-1">
                            {group.items.map(renderNavItem)}
                        </div>
                    </div>
                ))}
            </nav>
        );
    }

    // Fallback to flat items list
    return (
        <nav className="space-y-1">
            {items?.map(renderNavItem)}
        </nav>
    );
}
