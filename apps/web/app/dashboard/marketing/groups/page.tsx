import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { ProductGroupsClient } from "./_components/product-groups-client";
import { apiClient } from "@/utils/api-client-server";

interface ProductGroup {
    id: string;
    name: Record<string, string>;
    slug: string;
    description: Record<string, string> | null;
    imageUrl: string | null;
    isActive: boolean;
    items: Array<{
        id: string;
        order: number;
        product: {
            id: string;
            name: Record<string, string>;
            imageUrl: string | null;
        };
    }>;
}

interface Product {
    id: string;
    name: Record<string, string>;
    imageUrl: string | null;
}

export default async function ProductGroupsPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    let groups: ProductGroup[] = [];
    let products: Product[] = [];

    try {
        const token = (await supabase.auth.getSession()).data.session?.access_token;
        const headers = { Authorization: `Bearer ${token}` };

        const [groupsRes, productsRes] = await Promise.all([
            apiClient<ProductGroup[]>('/marketing/groups', { headers }),
            apiClient<Product[]>('/products', { headers }),
        ]);

        groups = Array.isArray(groupsRes) ? groupsRes : [];
        products = Array.isArray(productsRes) ? productsRes : [];
    } catch (error) {
        console.error('Failed to fetch data:', error);
    }

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">Grupos de Produtos</h3>
                <p className="text-sm text-muted-foreground">
                    Crie coleções promocionais como "Promoções da Semana" ou "Destaques Especiais".
                </p>
            </div>
            <ProductGroupsClient initialGroups={groups} products={products} />
        </div>
    );
}
