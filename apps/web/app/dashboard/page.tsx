import { getAuthorizedClient } from "@/utils/auth-server";
import { redirect } from "next/navigation";
import { Button } from "@smart-menu/ui";
import { Card, CardContent, CardHeader, CardTitle } from "@smart-menu/ui";
import { signOut } from "../actions/auth";
import { QRGenerator } from "@/components/qr-generator/qr-code";
import Link from "next/link";

export default async function DashboardPage() {
    const { user, error } = await getAuthorizedClient();

    if (error || !user) {
        return redirect("/login");
    }

    // Fetch real tenant profile from API to avoid metadata sync issues
    const { getTenantProfile } = await import("../actions/settings");
    const tenantProfile = await getTenantProfile() as { id: string, name: string } | null;

    interface UserMetadata {
        tenant_id?: string;
        tenant_name?: string;
        restaurant_name?: string;
    }

    const restaurantName = tenantProfile?.name ||
        (user.user_metadata as UserMetadata)?.restaurant_name ||
        (user.user_metadata as UserMetadata)?.tenant_name ||
        "O Meu Restaurante";

    const tenantId = tenantProfile?.id ||
        (user.app_metadata as UserMetadata)?.tenant_id ||
        (user.user_metadata as UserMetadata)?.tenant_id;

    if (!tenantId) {
        return redirect("/dashboard/menu"); // Fallback to menu management if no tenant
    }

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-black">
            <header className="border-b bg-white px-6 py-4 dark:border-zinc-800 dark:bg-zinc-950">
                <div className="mx-auto flex max-w-7xl items-center justify-between">
                    <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                        Smart<span className="text-orange-600">Menu</span>
                    </h1>
                    <div className="flex items-center gap-4">
                        <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                            {user.email}
                        </span>
                        <form action={signOut}>
                            <Button variant="ghost" size="sm">
                                Sair
                            </Button>
                        </form>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-7xl px-6 py-8">
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
                        Bem-vindo, {restaurantName}
                    </h2>
                    <p className="text-zinc-600 dark:text-zinc-400">
                        Gerencie o seu menu, mesas e pedidos em tempo real.
                    </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <Card>
                        <CardHeader>
                            <CardTitle>Menu</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
                                Gerencie categorias e itens do seu cardápio digital.
                            </p>
                            <Link href="/dashboard/menu">
                                <Button className="w-full" variant="outline">
                                    Gerenciar Menu
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Pedidos Ativos</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
                                Visualize e atualize o status dos pedidos em tempo real.
                            </p>
                            <Link href="/dashboard/orders">
                                <Button className="w-full" variant="outline">
                                    Ver Pedidos
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Mesas & QR Code</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
                                Gere e imprima QR Codes para as mesas do seu estabelecimento.
                            </p>
                            <Link href="/dashboard/settings">
                                <Button className="w-full" variant="outline">
                                    Configurar Mesas
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                </div>

                <div className="mt-12 grid gap-8 lg:grid-cols-2">
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">Seu Cardápio Digital</h3>
                        <p className="text-zinc-600 dark:text-zinc-400">
                            Este é o seu QR Code oficial. Imprima-o e coloque-o nas mesas para que os seus clientes possam aceder ao menu instantaneamente.
                        </p>
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2 text-sm text-orange-600 font-medium">
                                <span className="h-2 w-2 rounded-full bg-orange-600 animate-pulse"></span>
                                Cardápio Online e Ativo
                            </div>
                            <p className="text-xs text-zinc-500">
                                Qualquer alteração feita no menu será refletida automaticamente quando o cliente ler o código.
                            </p>
                        </div>
                    </div>

                    <QRGenerator tenantId={tenantId} />
                </div>
            </main>
        </div>
    );
}
