import { getAuthorizedClient } from "@/utils/auth-server";
import { apiClient } from "@/utils/api-client";
import { redirect } from "next/navigation";
import { ProductForm } from "../_components/product-form";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function NewProductPage() {
    const { user, token, error } = await getAuthorizedClient();

    if (error || !user) {
        return redirect("/login");
    }

    let categories: any[] = [];
    try {
        categories = await apiClient.get<any[]>("/categories");
        if (!categories) categories = [];
    } catch (error) {
        console.error("Error fetching categories:", error);
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
                    <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Novo Produto</h2>
                    <p className="text-zinc-600 dark:text-zinc-400">Configure os detalhes do novo item do seu cardápio.</p>
                </div>
            </div>

            <ProductForm categories={categories} />
        </div>
    );
}
