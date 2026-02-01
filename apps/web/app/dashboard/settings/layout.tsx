"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { User, Building2, Grid3X3, CreditCard, Palette, Layout, Image, LucideIcon } from "lucide-react";

const IconMap: Record<string, LucideIcon> = {
    "building": Building2,
    "grid": Grid3X3,
    "user": User,
    "credit-card": CreditCard,
    "palette": Palette,
    "layout": Layout,
    "image": Image,
};

const sidebarNavItems = [
    {
        title: "Restaurante",
        href: "/dashboard/settings/tenant",
        icon: "building"
    },
    {
        title: "Identidade Visual",
        href: "/dashboard/settings/branding",
        icon: "palette"
    },
    {
        title: "Layout do Cardápio",
        href: "/dashboard/settings/menu-design",
        icon: "layout"
    },
    {
        title: "Banners & Links",
        href: "/dashboard/settings/banners",
        icon: "image"
    },
    {
        title: "Mesas",
        href: "/dashboard/settings/tables",
        icon: "grid"
    },
    {
        title: "Organização",
        href: "/dashboard/settings/organization",
        icon: "user"
    },
    {
        title: "Assinatura",
        href: "/dashboard/settings/billing",
        icon: "credit-card",
        disabled: true
    },
];

interface SettingsLayoutProps {
    children: React.ReactNode;
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
    const pathname = usePathname();

    return (
        <div className="space-y-6 p-10 pb-16 block">
            <div className="space-y-0.5">
                <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Configurações</h2>
                <p className="text-zinc-500 dark:text-zinc-400">
                    Gerencie as configurações do seu estabelecimento e conta.
                </p>
            </div>
            <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
                <aside className="-mx-4 lg:w-1/5 overflow-x-auto lg:overflow-visible">
                    <nav className="flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1 min-w-max lg:min-w-0 px-4 lg:px-0 pb-2 lg:pb-0">
                        {sidebarNavItems.map((item) => {
                            const IconComponent = IconMap[item.icon] || User;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.disabled ? "#" : item.href}
                                    className={cn(
                                        "flex items-center gap-2 justify-start rounded-md p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800",
                                        pathname === item.href
                                            ? "bg-zinc-100 dark:bg-zinc-800 font-semibold text-orange-600"
                                            : "bg-transparent text-zinc-600 dark:text-zinc-400",
                                        item.disabled && "opacity-50 cursor-not-allowed"
                                    )}
                                >
                                    <IconComponent className="h-4 w-4" />
                                    {item.title}
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
