"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Package, Calendar, PartyPopper, LucideIcon } from "lucide-react";

const IconMap: Record<string, LucideIcon> = {
    "package": Package,
    "calendar": Calendar,
    "party": PartyPopper,
};

const sidebarNavItems = [
    {
        title: "Grupos de Produtos",
        href: "/dashboard/marketing/groups",
        icon: "package",
        description: "Coleções promocionais"
    },
    {
        title: "Calendário Promocional",
        href: "/dashboard/marketing/calendar",
        icon: "calendar",
        description: "Promoções agendadas"
    },
    {
        title: "Eventos",
        href: "/dashboard/marketing/events",
        icon: "party",
        description: "Eventos no restaurante"
    },
];

interface MarketingLayoutProps {
    children: React.ReactNode;
}

export default function MarketingLayout({ children }: MarketingLayoutProps) {
    const pathname = usePathname();

    return (
        <div className="space-y-6 p-10 pb-16 block">
            <div className="space-y-0.5">
                <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Marketing & Promoções</h2>
                <p className="text-zinc-500 dark:text-zinc-400">
                    Gerencie grupos de produtos, promoções e eventos do seu restaurante.
                </p>
            </div>
            <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
                <aside className="-mx-4 lg:w-1/5">
                    <nav className="flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1">
                        {sidebarNavItems.map((item) => {
                            const IconComponent = IconMap[item.icon] || Package;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-3 justify-start rounded-md p-3 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors",
                                        pathname === item.href
                                            ? "bg-zinc-100 dark:bg-zinc-800 font-semibold text-orange-600"
                                            : "bg-transparent text-zinc-600 dark:text-zinc-400"
                                    )}
                                >
                                    <IconComponent className="h-5 w-5" />
                                    <div>
                                        <p className="text-sm">{item.title}</p>
                                        <p className="text-xs text-zinc-400">{item.description}</p>
                                    </div>
                                </Link>
                            );
                        })}
                    </nav>
                </aside>
                <div className="flex-1 lg:max-w-4xl">{children}</div>
            </div>
        </div>
    );
}
