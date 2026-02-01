import { getAuthorizedClient } from "@/utils/auth-server";
import { redirect } from "next/navigation";
import { Button } from "@smart-menu/ui";
import { Card, CardContent, CardHeader, CardTitle } from "@smart-menu/ui";
import { QRGenerator } from "@smart-menu/ui";
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
        <div className="space-y-8">
            <div className="flex flex-col gap-1">
                <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                    Bem-vindo, {restaurantName}
                </h2>
                <p className="text-muted-foreground font-medium">
                    Gerencie o seu menu, mesas e pedidos em tempo real.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader>
                        <CardTitle className="text-lg">Menu</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground mb-6">
                            Gerencie categorias e itens do seu cardápio digital.
                        </p>
                        <Link href="/dashboard/menu">
                            <Button className="w-full" variant="outline">
                                Gerenciar Menu
                            </Button>
                        </Link>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader>
                        <CardTitle className="text-lg">Pedidos Ativos</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground mb-6">
                            Visualize e atualize o status dos pedidos em tempo real.
                        </p>
                        <Link href="/dashboard/orders">
                            <Button className="w-full" variant="outline">
                                Ver Pedidos
                            </Button>
                        </Link>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader>
                        <CardTitle className="text-lg">Mesas & QR Code</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground mb-6">
                            Gere e imprima QR Codes para as mesas do seu estabelecimento.
                        </p>
                        <Link href="/dashboard/settings/tables">
                            <Button className="w-full" variant="outline">
                                Configurar Mesas
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>

            <div className="mt-12 grid gap-8 lg:grid-cols-2 bg-white dark:bg-zinc-950 p-8 rounded-2xl border shadow-sm">
                <div className="space-y-4">
                    <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">Seu Cardápio Digital</h3>
                    <p className="text-muted-foreground">
                        Este é o seu QR Code oficial. Imprima-o e coloque-o nas mesas para que os seus clientes possam aceder ao menu instantaneamente.
                    </p>
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-2 text-sm text-orange-600 font-bold bg-orange-50 dark:bg-orange-950/20 w-fit px-3 py-1 rounded-full">
                            <span className="h-2 w-2 rounded-full bg-orange-600 animate-pulse"></span>
                            Cardápio Online e Ativo
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                            Qualquer alteração feita no menu será refletida automaticamente quando o cliente ler o código.
                        </p>
                    </div>
                </div>

                <div className="flex justify-center lg:justify-end">
                    <div className="bg-white p-4 rounded-xl shadow-lg border border-zinc-100">
                        <QRGenerator tenantId={tenantId} />
                    </div>
                </div>
            </div>
        </div>
    );
}
