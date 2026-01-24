import { getAuthorizedClient } from "@/utils/auth-server";
import { apiClient } from "@/utils/api-client-server";
import { redirect, notFound } from "next/navigation";
import { ProductForm, type ProductInitialData } from "../../_components/product-form";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function EditProductPage({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params;
    const { user, token, error } = await getAuthorizedClient();

    if (error || !user || !token) {
        return redirect("/login");
    }

    interface Category {
        id: string;
        name: string | Record<string, string>;
    }

    let product: ProductInitialData | null = null;
    let categories: Category[] = [];
    let productsList: ProductInitialData[] = [];
    try {
        const [productRes, categoriesRes, allProductsRes] = await Promise.all([
            apiClient.get<ProductInitialData>(`/products/${id}`),
            apiClient.get<Category[]>("/categories"),
            apiClient.get<ProductInitialData[]>("/products")
        ]);

        product = productRes;
        categories = Array.isArray(categoriesRes) ? categoriesRes : [];
        productsList = Array.isArray(allProductsRes) ? allProductsRes : [];

        if (!product) return notFound();
    } catch (err) {
        console.error("Error fetching data for edit:", err);
        return notFound();
    }

    // Cast properties to ensure compatibility with ProductInitialData
    const initialData = product ? {
        ...product,
        price: typeof product.price === 'string' ? parseFloat(product.price) : product.price,
    } : undefined;

    return (
        <div className="max-w-4xl mx-auto space-y-8 h-full">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild className="rounded-full font-bold">
                    <Link href="/dashboard/menu/products">
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                </Button>
                <div>
                    <h2 className="text-3xl font-black tracking-tighter text-zinc-900 dark:text-zinc-50 uppercase italic leading-none">Editar Produto</h2>
                    <p className="text-sm text-zinc-500 font-medium">Refine os detalhes deste item com precisão industrial.</p>
                </div>
            </div>

            <ProductForm
                categories={categories}
                initialData={initialData}
                products={productsList.filter(p => p.id !== id)}
            />
        </div>
    );
}
