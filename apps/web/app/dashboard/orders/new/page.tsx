import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { POSClient } from "./_components/pos-client";
import { apiClient } from "@/utils/api-client-server";
import { POSProduct } from "./_components/pos-product-card";

interface Category {
    id: string;
    name: string | Record<string, string>;
}

export default async function NewOrderPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const session = await supabase.auth.getSession();
    const token = session.data.session?.access_token;

    // Fetch products and categories in parallel
    const [products, categories] = await Promise.all([
        apiClient.get('/products', { headers: { Authorization: `Bearer ${token}` } }),
        apiClient.get('/categories', { headers: { Authorization: `Bearer ${token}` } }),
    ]);

    return (
        <div className="space-y-6 flex flex-col h-full">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">Ponto de Venda (POS)</h2>
                    <p className="text-zinc-500 font-medium">Crie novos pedidos de forma rápida.</p>
                </div>
            </div>

            <POSClient 
                initialProducts={Array.isArray(products) ? products as unknown as POSProduct[] : []} 
                categories={Array.isArray(categories) ? categories as unknown as Category[] : []}
            />
        </div>
    );
}
