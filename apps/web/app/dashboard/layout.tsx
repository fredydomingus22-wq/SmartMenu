export const dynamic = "force-dynamic";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { AppShell, NavGroup, ErrorBoundary, ContentTransition } from "@smart-menu/ui";
import { DashboardHeader } from "./_components/dashboard-header";
import { DashboardSidebar } from "./_components/dashboard-sidebar";
import { User } from "@supabase/supabase-js";

const navGroups: NavGroup[] = [
    {
        title: "Gestão",
        items: [
            { label: "Visão Geral", icon: "LayoutDashboard", href: "/dashboard" },
            { label: "Análise & Relatórios", icon: "ClipboardList", href: "/dashboard/analytics" },
            { label: "Cardápio", icon: "UtensilsCrossed", href: "/dashboard/menu" },
        ]
    },
    {
        title: "Operações",
        items: [
            { label: "Pedidos", icon: "ShoppingBag", href: "/dashboard/orders" },
            { label: "Cozinha (KDS)", icon: "ChefHat", href: "/dashboard/kds" },
        ]
    },
    {
        title: "Clientes",
        items: [
            { label: "Fidelidade", icon: "Gift", href: "/dashboard/loyalty" },
            { label: "Mesas & QR", icon: "ClipboardList", href: "/dashboard/settings/tables" },
        ]
    },
    {
        title: "Sistema",
        items: [
            { label: "Configurações", icon: "Settings", href: "/dashboard/settings" },
        ]
    }
];

// Flat list for mobile menu in header
const flatNavItems = navGroups.flatMap(group => group.items);

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
        return redirect("/login");
    }

    return (
        <AppShell
            sidebar={<DashboardSidebar navGroups={navGroups} />}
            header={<DashboardHeader user={user as User} navItems={flatNavItems} />}
        >
            <ErrorBoundary>
                <ContentTransition>
                    <div className="p-4 md:p-8">
                        {children}
                    </div>
                </ContentTransition>
            </ErrorBoundary>
        </AppShell>
    );
}

