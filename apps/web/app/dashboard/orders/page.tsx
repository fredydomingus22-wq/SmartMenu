import { getAuthorizedClient } from "@/utils/auth-server";
import { getOrders } from "@/app/actions/orders";
import { OrdersClient } from "./_components/orders-client";
import { redirect } from "next/navigation";
import { Order } from "./_types";

export default async function OrdersPage() {
    const { user, token, error } = await getAuthorizedClient();

    if (error || !user) {
        return redirect("/login");
    }

    const orders = await getOrders(token) as Order[];
    const tenantId = user?.app_metadata?.tenant_id || user?.user_metadata?.tenant_id || user?.id || "";

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Gestão de Pedidos</h2>
                <p className="text-zinc-500 dark:text-zinc-400">
                    Acompanhe e actualize o estado dos pedidos em tempo real.
                </p>
            </div>

            <OrdersClient orders={orders} tenantId={tenantId} />
        </div>
    );
}
