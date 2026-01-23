"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Building2, Store } from "lucide-react";

export function SettingsTabs() {
    const pathname = usePathname();

    const tabs = [
        {
            label: "Restaurante",
            href: "/dashboard/settings/tenant",
            icon: Store,
        },
        {
            label: "Organização",
            href: "/dashboard/settings/organization",
            icon: Building2,
        },
    ];

    return (
        <div className="flex space-x-1 border-b pb-4 dark:border-zinc-800">
            {tabs.map((tab) => {
                const isActive = pathname === tab.href;
                return (
                    <Link
                        key={tab.href}
                        href={tab.href}
                        className={cn(
                            "flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors",
                            isActive
                                ? "bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-500"
                                : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-100"
                        )}
                    >
                        <tab.icon className="h-4 w-4" />
                        {tab.label}
                    </Link>
                );
            })}
        </div>
    );
}
