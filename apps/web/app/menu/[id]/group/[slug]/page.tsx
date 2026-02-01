
/* eslint-disable @typescript-eslint/no-explicit-any */
import { notFound } from "next/navigation";
import { apiClient } from "@/utils/api-client-server";
import { getMenuConfig } from "@/app/actions/settings";
import { PublicMenuClient } from "../../_components/public-menu-client";
import { PublicMenuHeader } from "../../_components/public-menu-header";
import { RestaurantFooter } from "../../_components/restaurant-footer";
import { AppShell, PageContainer } from "@smart-menu/ui";
import { MenuGrid } from "../../_components/menu-grid";
import { ProductGroup } from "../../_types/marketing";
import Image from "next/image";

interface Props {
    params: {
        id: string; // Tenant ID
        slug: string; // Group Slug
    }
}

async function getProductGroup(tenantId: string, slug: string): Promise<ProductGroup | null> {
    try {
        const group = await apiClient.get(`/marketing/public/groups/${tenantId}/${slug}`, { cache: 'no-store' });
        return group as ProductGroup;
    } catch (e) {
        console.error("Failed to fetch product group", e);
        return null;
    }
}

export default async function ProductGroupPage({ params }: Props) {
    const { id: tenantId, slug } = params;

    const [group, configData] = await Promise.all([
        getProductGroup(tenantId, slug),
        getMenuConfig(tenantId)
    ]);

    // Local type for config to satisfy requirements
    const config = configData as { branding?: any; settings?: any; footer?: any;[key: string]: unknown } | null;

    if (!group) {
        return notFound();
    }

    const products = group.items?.map(item => item.product).filter(Boolean) || [];

    // Safe localized accessor
    const getLocalized = (field: any) => {
        if (!field) return "";
        if (typeof field === 'string') return field;
        return field.pt || field.en || Object.values(field)[0] || "";
    };

    const branding = config?.branding;
    const organizationId = products[0]?.organizationId || "";

    return (
        <PublicMenuClient
            tenantId={tenantId}
            organizationId={organizationId}
            branding={branding}
        >
            <AppShell
                header={<PublicMenuHeader
                    branding={branding}
                    enabledLanguages={config?.settings?.enabledLanguages}
                />}
                safeArea={true}
            >
                <PageContainer>
                    <div className="space-y-6">
                        <div className="relative h-48 md:h-64 rounded-xl overflow-hidden mb-8">
                            {group.imageUrl ? (
                                <Image
                                    src={group.imageUrl}
                                    alt={getLocalized(group.name) || "Grupo"}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-r from-primary/20 to-primary/5" />
                            )}
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                <div className="text-center text-white p-4">
                                    <h1 className="text-3xl md:text-4xl font-bold mb-2">
                                        {getLocalized(group.name) || "Coleção"}
                                    </h1>
                                    {getLocalized(group.description) && (
                                        <p className="text-white/90 max-w-2xl mx-auto">
                                            {getLocalized(group.description)}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <MenuGrid
                            categories={[{
                                id: group.id,
                                name: getLocalized(group.name) || "Produtos",
                                products: products,
                                organizationId: organizationId
                            } as any]}
                            config={config as any}
                            mode="group"
                        />
                    </div>
                </PageContainer>
                <RestaurantFooter branding={branding} footerConfig={config?.footer} />
            </AppShell>
        </PublicMenuClient>
    );
}
