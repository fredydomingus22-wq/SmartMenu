
import { getAuthorizedClient } from "@/utils/auth-server";
import { apiClient } from "@/utils/api-client-server";
import { redirect } from "next/navigation";
import { Button } from "@smart-menu/ui";
import { Plus } from "lucide-react";
import Link from "next/link";
import { ProductListClient } from "./_components/product-list-client";
import { ErrorBoundary } from "@/components/error-boundary";
import { getTranslation } from "@/utils/i18n-server";

interface Product {
    id: string;
    name: string | Record<string, string>;
    description?: string | Record<string, string> | null;
    price: number | string;
    imageUrl: string | null;
    isAvailable: boolean;
    category?: { name: string | Record<string, string> };
}

export default async function ProductsPage() {
    const { user, token, error } = await getAuthorizedClient();

    if (error || !user || !token) {
        return redirect("/login");
    }

    const { t } = getTranslation();

    let products: Product[] = [];
    try {
        console.log(`[ProductsPage] Fetching products via API for tenant resolution...`);
        const response = await apiClient.get<Product[]>("/products", {
            next: { tags: ['products', 'menu'] }
        });

        if (Array.isArray(response)) {
            products = response;
            console.log(`[ProductsPage] API returned ${products.length} products`);
        } else {
            console.warn("[ProductsPage] API returned non-array response", response);
        }
    } catch (err) {
        console.error("[ProductsPage] API fetch failed:", err);
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">{t('dashboard.products.title')}</h2>
                    <p className="text-zinc-600 dark:text-zinc-400">{t('dashboard.products.subtitle')}</p>
                </div>
                <Button asChild className="bg-orange-600 hover:bg-orange-700 shadow-lg shadow-orange-600/20">
                    <Link href="/dashboard/menu/products/new">
                        <Plus className="mr-2 h-4 w-4" />
                        {t('dashboard.products.add_new')}
                    </Link>
                </Button>
            </div>

            <ErrorBoundary>
                <div className="products-container">
                    <ProductListClient initialProducts={products} />
                </div>
            </ErrorBoundary>
        </div>
    );
}
