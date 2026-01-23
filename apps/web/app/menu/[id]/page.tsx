import { apiClient } from "@/utils/api-client";
import { UtensilsCrossed, Gift } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAuthorizedClient } from "@/utils/auth-server";
import { MenuGrid } from "./_components/menu-grid";
import { PublicMenuClient } from "./_components/public-menu-client";
import { PublicMenuHeader } from "./_components/public-menu-header";
import { RestaurantFooter } from "./_components/restaurant-footer";
import { formatCurrency } from "@/lib/utils";

import { Category, MenuConfig, LoyaltyConfig } from "./_types";

export default async function PublicMenuPage({
    params,
    searchParams
}: {
    params: Promise<{ id: string }>,
    searchParams: Promise<{ table?: string }>
}) {
    const { id } = await params;
    const { table } = await searchParams;
    const { token } = await getAuthorizedClient();
    const authHeader = token ? { Authorization: `Bearer ${token}` } : ({} as Record<string, string>);

    let categories: Category[] = [];
    let config: MenuConfig | null = null;
    let loyaltyConfig: LoyaltyConfig | null = null;

    try {
        const [categoriesData, configData, loyaltyConfigData] = await Promise.all([
            apiClient.get(`/public/menu/${id}`, { cache: 'no-store' }),
            apiClient.get(`/public/menu/${id}/config`, { cache: 'no-store' }).catch(err => {
                console.warn('[PublicMenuPage] Config fetch failed, using defaults:', err.message);
                return null;
            }),
            apiClient.get(`/loyalty/config/public?tenantId=${id}`, {
                cache: 'no-store',
                headers: authHeader
            }).catch(err => {
                console.warn('[PublicMenuPage] Loyalty config fetch failed:', err.message);
                return null;
            })
        ]) as [Category[], MenuConfig | null, LoyaltyConfig | null];

        categories = categoriesData;
        config = configData;
        loyaltyConfig = loyaltyConfigData;

        if (!categories) {
            console.error('[PublicMenuPage] Categories is null/undefined');
            return notFound();
        }
    } catch (err: unknown) {
        const error = err as { message?: string; status?: number };
        console.error('[PublicMenuPage] Error loading menu data:', {
            message: error.message,
            status: error.status,
            id
        });

        if (error.status === 404 || error.message?.includes('404')) {
            return notFound();
        }

        throw new Error(`Falha ao carregar o cardápio: ${error.message || 'Erro desconhecido'}`);
    }

    const branding = config?.branding;
    const organizationId = categories[0]?.organizationId;

    if (categories.length === 0 || !organizationId) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
                <UtensilsCrossed className="h-16 w-16 text-zinc-300 mb-4" />
                <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Cardápio Indisponível</h1>
                <p className="text-zinc-600 dark:text-zinc-400 mt-2">Este restaurante ainda não adicionou itens ao cardápio.</p>
            </div>
        );
    }

    return (
        <PublicMenuClient
            tenantId={id}
            organizationId={organizationId}
            branding={branding}
        >
            <div className="min-h-screen bg-background pb-20">
                <PublicMenuHeader branding={branding} tableId={table || undefined} />

                {/* Loyalty Banner stays as top-level if active */}
                {loyaltyConfig?.isActive && (
                    <div className="bg-amber-50 dark:bg-amber-950/20 border-b border-amber-100 dark:border-amber-900/50 py-3 px-4 sm:px-8 lg:px-12">
                        <div className="w-full flex items-center justify-between">
                            <div className="flex items-center gap-2 text-amber-800 dark:text-amber-200">
                                <Gift className="h-5 w-5" />
                                <span className="text-sm font-semibold">Club de Pontos Ativo!</span>
                                <span className="text-xs opacity-80 hidden sm:inline">Ganhe {loyaltyConfig.pointsPerUnit} pontos a cada {formatCurrency(loyaltyConfig.currencyUnit)} gastos.</span>
                            </div>
                            <Link href={`/menu/${id}/loyalty`} className="text-xs font-bold underline text-amber-900 dark:text-amber-100 uppercase tracking-wider">
                                Ver meus pontos
                            </Link>
                        </div>
                    </div>
                )}

                {/* The dynamic MenuGrid handles Hero, Sections, and Footer based on config */}
                <div className="w-full px-4 sm:px-8 lg:px-12">
                    <MenuGrid categories={categories} config={config} />
                </div>

                <RestaurantFooter branding={branding} footerConfig={config?.footer} />
            </div>
        </PublicMenuClient>
    );
}
