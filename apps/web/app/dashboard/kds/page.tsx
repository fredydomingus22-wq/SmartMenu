import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { KDSGrid } from "./_components/kds-grid";
import { apiClient } from "@/lib/api-client";

export default async function KDSPage() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // Fetch orders for this tenant
    let orders = [];
    try {
        const response = await apiClient('/orders', {
            headers: {
                Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
            },
        });
        orders = response.data || [];
    } catch (error) {
        console.error('Failed to fetch orders:', error);
    }

    const tenantId = user.user_metadata?.tenantId || user.app_metadata?.tenant_id;

    return (
        <div className="h-full bg-[#0F172A] flex flex-col">
            <header className="px-6 py-4 bg-[#020617] border-b border-[#1E293B] flex items-center justify-between sticky top-0 z-10">
                <div>
                    <h1 className="text-xl font-bold text-white flex items-center gap-2">
                        🍳 SmartKitchen
                        <span className="text-xs font-medium text-[#16A34A] bg-[#16A34A]/10 px-2 py-0.5 rounded-full border border-[#16A34A]/20 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 bg-[#16A34A] rounded-full animate-pulse" />
                            AO VIVO
                        </span>
                    </h1>
                </div>
            </header>
            <div className="flex-1 flex flex-col min-h-0">
                <KDSGrid initialOrders={orders} tenantId={tenantId} />
            </div>
        </div>
    );
}
