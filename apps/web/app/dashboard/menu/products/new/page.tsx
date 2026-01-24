import { getAuthorizedClient } from "@/utils/auth-server";
import { apiClient } from "@/utils/api-client-server";
import { redirect } from "next/navigation";
import { ProductForm } from "../_components/product-form";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function NewProductPage() {
    const { user, error: authError } = await getAuthorizedClient();

    if (authError || !user) {
        return redirect("/login");
    }

    interface Category {
        id: string;
        name: string | Record<string, string>;
    }

    interface ProductSummary {
        id: string;
        name: string | Record<string, string>;
    }

    let categories: Category[] = [];
    let products: ProductSummary[] = [];
    try {
        const [catRes, prodRes] = await Promise.all([
            apiClient.get<Category[]>("/categories"),
            apiClient.get<ProductSummary[]>("/products")
        ]);
        categories = Array.isArray(catRes) ? catRes : [];
        products = Array.isArray(prodRes) ? prodRes : [];
    } catch (error) {
        console.error("Error fetching data:", error);
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 h-full">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild className="rounded-full font-bold">
                    <Link href="/dashboard/menu/products">
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                </Button>
                <div>
                    <h2 className="text-3xl font-black tracking-tighter text-zinc-900 dark:text-zinc-50 uppercase italic leading-none">Novo Produto</h2>
                    <p className="text-sm text-zinc-500 font-medium">Configure os detalhes do novo item do seu cardápio com precisão industrial.</p>
                </div>
            </div>

            <ProductForm categories={categories} products={products} />
        </div>
    );
}
