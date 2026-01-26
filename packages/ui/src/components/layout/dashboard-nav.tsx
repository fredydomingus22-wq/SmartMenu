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
}

export interface DashboardNavProps {
    items: NavItem[];
    activeClassName?: string;
    inactiveClassName?: string;
}

export function DashboardNav({
    items,
    activeClassName = "text-orange-600 dark:text-orange-500",
    inactiveClassName = "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
}: DashboardNavProps) {
    const pathname = usePathname();

    return (
        <nav className="space-y-2">
            {items.map((item) => {
                const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
                const IconComponent = IconMap[item.icon] || Home;

                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            "group relative flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300",
                            isActive ? activeClassName : inactiveClassName
                        )}
                    >
                        {isActive && (
                            <motion.div
                                layoutId="active-nav"
                                className="absolute inset-0 bg-orange-50 dark:bg-orange-950/20 rounded-xl"
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
                                isActive ? "text-orange-600" : "text-zinc-400"
                            )} />
                            <span className="tracking-tight">{item.label}</span>
                        </div>

                        <ChevronRight className={cn(
                            "relative h-4 w-4 transition-all duration-300",
                            isActive ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"
                        )} />
                    </Link>
                );
            })}
        </nav>
    );
}
