import { signOut } from "../../actions/auth";
import { Button, DashboardNav, NavItem } from "@smart-menu/ui";
import { LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardSidebarProps {
    className?: string;
    navItems: NavItem[];
}

export function DashboardSidebar({ className, navItems }: DashboardSidebarProps) {
    return (
        <aside className={cn("w-64 border-r bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950 flex flex-col h-full", className)}>
            <div className="mb-10">
                <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                    Smart<span className="text-orange-600">Menu</span>
                </h1>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 scrollbar-hide">
                <DashboardNav items={navItems} />
            </div>

            <div className="mt-auto pt-10">
                <form action={signOut}>
                    <Button variant="ghost" className="w-full justify-start gap-3 text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-900/10">
                        <LogOut className="h-4 w-4" />
                        Sair
                    </Button>
                </form>
            </div>
        </aside>
    );
}
