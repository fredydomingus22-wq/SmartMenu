import { apiClient } from "@/utils/api-client-server";
import { MenuLayoutClient } from "./_components/menu-layout-client";
import { MenuConfig } from "./_types";
import { notFound } from "next/navigation";

export default async function RestaurantLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    let config: MenuConfig | null = null;
    try {
        config = await apiClient.get<MenuConfig>(`/public/menu/${id}/config`);
    } catch (e) {
        console.warn("[RestaurantLayout] Failed to fetch config", e);
    }

    if (!config) {
        return notFound();
    }

    // Get organizationId from anywhere in config if possible, 
    // but usually it's better if the config returns it.
    // For now, we'll try to get it from the tenant if we have it or assume it's passed.
    // Actually, PublicMenuPage used categories[0]?.organizationId. 
    // We should probably have a better way to get it. 
    // Let's assume we fetch minimum tenant info if not in config.

    // Quick Fix: The PublicMenuPage previously fetched categories. 
    // We can fetch categories here too or just the tenant info.
    const organizationId = config.branding?.tenantId || id; // Fallback or fetch

    return (
        <MenuLayoutClient
            tenantId={id}
            organizationId={organizationId}
            branding={config.branding}
        >
            {children}
        </MenuLayoutClient>
    );
}
