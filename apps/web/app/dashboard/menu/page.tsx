import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Button } from "@smart-menu/ui";
import { Card, CardContent, CardHeader, CardTitle } from "@smart-menu/ui";
import Link from "next/link";
import { LayoutGrid, Package, ExternalLink } from 'lucide-react';
import prisma from "@/utils/prisma";

export default async function MenuDashboardPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return redirect("/login");

    const userProfile = await prisma.userProfile.findUnique({
        where: { id: user.id }
    });

    const tenantId = userProfile?.tenantId;

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Gerenciar Menu</h2>
                    <p className="text-zinc-600 dark:text-zinc-400">Configure as categorias e produtos do seu cardápio.</p>
                </div>
                {tenantId && (
                    <Link href={`/menu/${tenantId}?preview=true`} target="_blank">
                        <Button variant="outline" className="gap-2 border-primary/20 hover:border-primary text-primary">
                            <ExternalLink className="h-4 w-4" />
                            Visualizar Cardápio
                        </Button>
                    </Link>
                )}
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card className="hover:border-orange-500/50 transition-colors">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-xl font-bold">Categorias</CardTitle>
                        <LayoutGrid className="h-6 w-6 text-orange-600" />
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6">
                            Gerencie as categorias do seu cardápio, como &quot;Entradas&quot;, &quot;Pratos Principais&quot; e &quot;Bebidas&quot;.
                        </p>
                        <Link href="/dashboard/menu/categories">
                            <Button className="w-full bg-orange-600 hover:bg-orange-700">
                                Ver Categorias
                            </Button>
                        </Link>
                    </CardContent>
                </Card>

                <Card className="hover:border-orange-500/50 transition-colors">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-xl font-bold">Produtos</CardTitle>
                        <Package className="h-6 w-6 text-orange-600" />
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6">
                            Adicione itens ao seu menu, configure preços, imagens e disponibilidade.
                        </p>
                        <Link href="/dashboard/menu/products">
                            <Button className="w-full bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-50 dark:text-black dark:hover:bg-zinc-200">
                                Gerenciar Produtos
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
