import { getAuthorizedClient } from "@/utils/auth-server";
import { apiClient } from "@/utils/api-client";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus, ImageIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { deleteProduct } from "../../../actions/menu";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default async function ProductsPage() {
    const { user, token, error } = await getAuthorizedClient();

    if (error || !user || !token) {
        return redirect("/login");
    }

    let products: any[] = [];
    try {
        products = await apiClient.get<any[]>("/products");
        if (!products) products = [];
    } catch (err) {
        console.error("Error fetching products:", err);
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Produtos</h2>
                    <p className="text-zinc-600 dark:text-zinc-400">Gerencie os itens do seu cardápio.</p>
                </div>
                <Button asChild className="bg-orange-600 hover:bg-orange-700 shadow-lg shadow-orange-600/20">
                    <Link href="/dashboard/menu/products/new">
                        <Plus className="mr-2 h-4 w-4" />
                        Novo Produto
                    </Link>
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {products.length === 0 ? (
                    <div className="col-span-full flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-300 py-20 dark:border-zinc-700">
                        <ImageIcon className="h-12 w-12 text-zinc-300 dark:text-zinc-700 mb-4" />
                        <p className="text-zinc-600 dark:text-zinc-400 font-medium text-lg">Nenhum produto cadastrado.</p>
                        <p className="text-sm text-zinc-500 dark:text-zinc-500 mb-6">Comece adicionando o seu primeiro item.</p>
                        <Button asChild className="bg-orange-600 hover:bg-orange-700">
                            <Link href="/dashboard/menu/products/new">
                                <Plus className="mr-2 h-4 w-4" />
                                Adicionar Produto
                            </Link>
                        </Button>
                    </div>
                ) : (
                    products.map((product: any) => (
                        <Card key={product.id} className="group overflow-hidden border-zinc-200 dark:border-zinc-800 transition-all hover:shadow-md py-0">
                            <div className="relative aspect-video w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                                {product.imageUrl ? (
                                    <Image
                                        src={product.imageUrl}
                                        alt={product.name}
                                        fill
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        className="object-cover transition-transform group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center text-zinc-400">
                                        <ImageIcon className="h-10 w-10" />
                                    </div>
                                )}
                                <div className="absolute top-2 right-2 flex gap-2">
                                    <span className={`px-2 py-1 text-[10px] font-bold rounded-full ${product.isAvailable ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                                        }`}>
                                        {product.isAvailable ? 'ATIVO' : 'INDISPONÍVEL'}
                                    </span>
                                </div>
                            </div>
                            <CardHeader className="p-4 pb-2 space-y-0">
                                <div className="flex items-center justify-between mb-1">
                                    <p className="text-[10px] font-medium text-orange-600 uppercase tracking-wider">
                                        {product.category?.name}
                                    </p>
                                    <p className="font-bold text-zinc-900 dark:text-zinc-50">
                                        {new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(product.price)}
                                    </p>
                                </div>
                                <CardTitle className="text-lg leading-tight px-0">{product.name}</CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 pt-0">
                                <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2 min-h-[2.5rem]">
                                    {product.description || "Nenhuma descrição fornecida."}
                                </p>
                                <div className="mt-4 flex items-center justify-end gap-2">
                                    <form action={deleteProduct.bind(null, product.id)}>
                                        <Button variant="ghost" size="sm" className="h-8 text-red-500 hover:bg-red-50 hover:text-red-600">
                                            Eliminar
                                        </Button>
                                    </form>
                                    <Button variant="outline" size="sm" className="h-8" asChild>
                                        <Link href={`/dashboard/menu/products/${product.id}/edit`}>
                                            Editar
                                        </Link>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
