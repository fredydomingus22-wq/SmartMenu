import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { signOut } from "../actions/auth";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { DashboardSidebar } from "./_components/dashboard-sidebar";
import { ContentTransition } from "./_components/content-transition";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";

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

    const navItems = [
        { label: "Visão Geral", icon: "layout-dashboard", href: "/dashboard" },
        { label: "Cardápio", icon: "utensils", href: "/dashboard/menu" },
        { label: "Pedidos", icon: "shopping-bag", href: "/dashboard/orders" },
        { label: "Cozinha (KDS)", icon: "chef-hat", href: "/dashboard/kds" },
        { label: "Fidelidade", icon: "gift", href: "/dashboard/loyalty" },
        { label: "Mesas & QR", icon: "clipboard-list", href: "/dashboard/settings/tables" },
        { label: "Configurações", icon: "settings", href: "/dashboard/settings" },
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
                <header className="flex h-16 shrink-0 items-center justify-between border-b bg-white/80 backdrop-blur-md px-8 dark:border-zinc-800 dark:bg-zinc-950/80">
                    <div className="flex items-center gap-4">
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
                        {/* Placeholder for Breadcrumbs or Search */}
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100 leading-none">
                                {user.email?.split('@')[0]}
                            </p>
                            <span className="text-[10px] text-zinc-500 font-medium uppercase tracking-widest">
                                Admin
                            </span>
                        </div>
                        <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 text-white flex items-center justify-center font-bold shadow-lg shadow-orange-500/20">
                            {user.email?.[0].toUpperCase()}
                        </div>
                    </div>
                </header>
                <main className="flex-1 overflow-y-auto p-8 scrollbar-hide">
                    <div className="mx-auto max-w-5xl">
                        <ContentTransition>
                            {children}
                        </ContentTransition>
                    </div>
                </main>
            </div>
        </div>
    );
}
