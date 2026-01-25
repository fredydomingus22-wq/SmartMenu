import { apiClient } from "@smart-menu/api";
import { UtensilsCrossed, Gift } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAuthorizedClient } from "@/utils/auth-server";
import { MenuGrid } from "./_components/menu-grid";
import { PublicMenuHeader } from "./_components/public-menu-header";
import { RestaurantFooter } from "./_components/restaurant-footer";
import { formatCurrency, ErrorBoundary } from "@smart-menu/ui";

import { Category, MenuConfig, LoyaltyConfig } from "./_types";
import { getTranslation } from "@/utils/i18n-server";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params;
    try {
        const config = await apiClient.get<MenuConfig>(`/public/menu/${id}/config`);
        const restaurantName = config?.branding?.tenantName || "Restaurante";
        return {
            title: `${restaurantName} | SmartMenu`,
            description: `Peça online no ${restaurantName} via SmartMenu.`,
        };
    } catch {
        return {
            title: "Menu Digital | SmartMenu",
        };
    }
}

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
    const { t } = getTranslation();

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

        // Background Profile Ensure for Logged In Users
        if (token && id) {
            apiClient.post('/loyalty/ensure-profile', { tenantId: id }, { headers: authHeader })
                .catch(err => console.warn('[PublicMenuPage] Profile ensure failed:', err.message));
        }

        if (!categories) {
            console.error('[PublicMenuPage] Categories is null/undefined');
            return notFound();
        }
    } catch {
        return notFound();
    }

    const branding = config?.branding;
    const organizationId = categories[0]?.organizationId;

    if (categories.length === 0 || !organizationId) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
                <UtensilsCrossed className="h-16 w-16 text-zinc-300 mb-4" />
                <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{t('menu.empty_category')}</h1>
                <p className="text-zinc-600 dark:text-zinc-400 mt-2">{t('menu.empty_category_desc')}</p>
            </div>
        );
    }

    return (
        <div className="min-h-[100dvh] bg-background pb-20">
            <PublicMenuHeader
                branding={branding}
                tableId={table || undefined}
                enabledLanguages={config?.settings?.enabledLanguages}
            />

            {/* Loyalty Banner stays as top-level if active */}
            {loyaltyConfig?.isActive && (
                <div className="bg-amber-50 dark:bg-amber-950/20 border-b border-amber-100 dark:border-amber-900/50 py-3 px-4 sm:px-8 lg:px-12">
                    <div className="w-full flex items-center justify-between">
                        <div className="flex items-center gap-2 text-amber-800 dark:text-amber-200">
                            <Gift className="h-5 w-5" />
                            <span className="text-sm font-semibold">{t('menu.points_active')}</span>
                            <span className="text-xs opacity-80 hidden sm:inline">{t('menu.points_earn', { points: loyaltyConfig.pointsPerUnit, amount: formatCurrency(loyaltyConfig.currencyUnit) })}</span>
                        </div>
                        <Link href={`/menu/${id}/loyalty`} className="text-xs font-bold underline text-amber-900 dark:text-amber-100 uppercase tracking-wider">
                            {t('menu.view_points')}
                        </Link>
                    </div>
                </div>
            )}

            {/* The dynamic MenuGrid handles Hero, Sections, and Footer based on config */}
            <div className="w-full px-4 sm:px-8 lg:px-12">
                <ErrorBoundary>
                    <MenuGrid categories={categories} config={config} />
                </ErrorBoundary>
            </div>

            <RestaurantFooter branding={branding} footerConfig={config?.footer} />
        </div>
    );
}
