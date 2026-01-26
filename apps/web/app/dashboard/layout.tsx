export const dynamic = "force-dynamic";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { DashboardSidebar } from "./_components/dashboard-sidebar";
import { ContentTransition } from "./_components/content-transition";
import { DashboardHeader } from "./_components/dashboard-header";
import { NavItem, ErrorBoundary } from "@smart-menu/ui";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
        console.warn("Auth check failed in DashboardLayout");
        return redirect("/login");
    }
    console.log("DashboardLayout: User authenticated", user.email);

    const navItems: NavItem[] = [
        { label: "Visão Geral", icon: "LayoutDashboard", href: "/dashboard" },
        { label: "Cardápio", icon: "UtensilsCrossed", href: "/dashboard/menu" },
        { label: "Pedidos", icon: "ShoppingBag", href: "/dashboard/orders" },
        { label: "Cozinha (KDS)", icon: "ChefHat", href: "/dashboard/kds" },
        { label: "Fidelidade", icon: "Gift", href: "/dashboard/loyalty" },
        { label: "Mesas & QR", icon: "ClipboardList", href: "/dashboard/settings/tables" },
        { label: "Configurações", icon: "Settings", href: "/dashboard/settings" },
    ];

    return (
        <div className="flex min-h-screen bg-zinc-50 dark:bg-black">
            {/* Desktop Sidebar */}
            <DashboardSidebar className="hidden md:flex border-r" navItems={navItems} />

            {/* Mobile Sidebar (Sheet) */}
            {/* Note: The trigger is in the header, but we can place the sheet logic here or better: 
                The Sheet Trigger usually needs to be where the button is. 
                However, since this is a layout, we can put the SheetContent here? 
                Actually, separating trigger and content across the tree is tricky without context.
                Best approach: Put the Sheet in the Header or wrapping a mobile nav component.
                But layout header is below. Let's look at the structure.
                The layout has sidebar separate from main content.
                Let's put the mobile sheet completely inside the header or just render it? 
                Wait, for the Sheet to be triggered by a button in the header, the button needs to be inside the Sheet Root.
                So we wrap the mobile menu button in the header with the Sheet.
            */}

            {/* Main Content */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                <DashboardHeader user={user} navItems={navItems} />

                <main className="flex-1 overflow-y-auto p-8 scrollbar-hide">
                    <div className="mx-auto max-w-5xl">
                        <ErrorBoundary>
                            <ContentTransition>
                                {children}
                            </ContentTransition>
                        </ErrorBoundary>
                    </div>
                </main>
            </div>
        </div>
    );
}
