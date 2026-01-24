import { getAuthorizedClient } from "@/utils/auth-server";
import { apiClient } from "@/utils/api-client-server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, LayoutGrid } from "lucide-react";
import { createCategory, deleteCategory } from '../../../actions/menu';
import { getTranslatedValue } from "@/lib/utils";

export default async function CategoriesPage() {
    const { user, token, error } = await getAuthorizedClient();

    if (error || !user || !token) {
        return redirect("/login");
    }


    interface Category {
        id: string;
        name: string | Record<string, string>;
        _count?: { products: number };
    }

    let categories: Category[] = [];
    try {
        const response = await apiClient.get<Category[]>("/categories");
        categories = Array.isArray(response) ? response : [];
    } catch (error) {
        console.error("Error fetching categories:", error);
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Categorias</h2>
                    <p className="text-zinc-600 dark:text-zinc-400">Gerencie as categorias do seu restaurante.</p>
                </div>

                <form action={createCategory} className="flex gap-2">
                    <input
                        name="name"
                        placeholder="Nova Categoria..."
                        className="rounded-md border border-zinc-200 px-3 py-1 text-sm dark:border-zinc-800 dark:bg-zinc-950"
                        required
                    />
                    <Button type="submit" size="sm" className="bg-orange-600 hover:bg-orange-700">
                        <Plus className="mr-2 h-4 w-4" />
                        Adicionar
                    </Button>
                </form>
            </div>

            <div className="grid gap-4">
                {categories.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-300 py-12 dark:border-zinc-700">
                        <LayoutGrid className="h-12 w-12 text-zinc-300 dark:text-zinc-700 mb-4" />
                        <p className="text-zinc-600 dark:text-zinc-400 font-medium">Nenhuma categoria encontrada.</p>
                        <p className="text-sm text-zinc-500 dark:text-zinc-500">Comece adicionando uma acima.</p>
                    </div>
                ) : (
                    categories.map((category) => (
                        <div
                            key={category.id}
                            className="flex items-center justify-between rounded-xl border bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
                        >
                            <div className="flex items-center gap-4">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 text-orange-600">
                                    <LayoutGrid className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">{getTranslatedValue(category.name)}</h3>
                                    <p className="text-xs text-zinc-500 dark:text-zinc-400">{category._count?.products || 0} produtos</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <form action={deleteCategory.bind(null, category.id)}>
                                    <Button variant="ghost" size="sm" className="text-red-500 hover:bg-red-50 hover:text-red-600">
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </form>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
