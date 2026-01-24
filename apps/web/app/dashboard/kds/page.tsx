import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { KDSGrid } from "./_components/kds-grid";
import { type Order } from "./_components/kds-order-card";
import { apiClient } from "@/utils/api-client-server";

/**
 * KDSPage - Versão 6 (Foco em Conformidade de Specs e Design System)
 * 
 * Requisitos atendidos:
 * - Idioma: Português (PT-PT)
 * - Cores: Dashboard zinc-50 + Orange Accent
 * - Tipografia: Foco em legibilidade a 1 metro (Botões h-14, text-lg)
 * - Real-time: Supabase Subscriptions e apiClient
 */
export default async function KDSPage() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // Buscar pedidos iniciais via api-client
    let orders: Order[] = [];
    try {
        const response = await apiClient<Order[]>('/orders?scope=active', {
            headers: {
                Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
            },
        });
        orders = Array.isArray(response) ? response : [];
    } catch (error) {
        console.error('Falha ao buscar pedidos KDS:', error);
    }

    const tenantId = user.user_metadata?.tenantId || user.app_metadata?.tenant_id;

    return (
        <div className="h-full flex flex-col -m-8 bg-zinc-50/50">
            {/* Navbar Customizada KDS (Opcional se herdada, mas aqui limpamos o overlay) */}
            <div className="flex-1 flex flex-col min-h-0">
                <KDSGrid initialOrders={orders} tenantId={tenantId} />
            </div>
        </div>
    );
}
