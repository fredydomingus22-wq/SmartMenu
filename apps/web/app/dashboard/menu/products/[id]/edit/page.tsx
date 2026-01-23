import { getAuthorizedClient } from "@/utils/auth-server";
import { apiClient } from "@/utils/api-client";
import { redirect, notFound } from "next/navigation";
import { ProductForm } from "../../_components/product-form";
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

    let product: any = null;
    let categories: any[] = [];
    try {
        const [productRes, categoriesRes] = await Promise.all([
            apiClient.get<any>(`/products/${id}`),
            apiClient.get<any[]>("/categories")
        ]);

        product = productRes;
        categories = categoriesRes || [];

        if (!product) return notFound();
    } catch (err) {
        console.error("Error fetching data for edit:", err);
        return notFound();
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 h-full">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild className="rounded-full">
                    <Link href="/dashboard/menu/products">
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                </Button>
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Editar Produto</h2>
                    <p className="text-zinc-600 dark:text-zinc-400">Atualize os detalhes do item do seu cardápio.</p>
                </div>
            </div>

            <ProductForm categories={categories} initialData={product} />
        </div>
    );
}
