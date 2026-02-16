"use server";

import { apiClient } from "@/utils/api-client-server";
import { revalidatePath } from "next/cache";
import { BrandingData } from "../dashboard/settings/_components/branding-form";
import { MenuSection } from "../menu/[id]/_types";

export async function getTenantProfile(retry = true) {
    try {
        return await apiClient.get<any>("/tenants/me", {
            next: { revalidate: 0 }
        });
    } catch (error: any) {
        // Auto-heal: If tenant not found (likely missing metadata in JWT), try to sync
        if (retry && (error.status === 404 || error.message?.includes('Tenant not found'))) {
            console.warn("[getTenantProfile] Tenant not found, attempting to sync user metadata...");
            try {
                await apiClient.post("/users/sync", {});
                console.log("[getTenantProfile] Sync successful, retrying fetch...");
                return getTenantProfile(false);
            } catch (syncError) {
                console.error("[getTenantProfile] Sync failed:", syncError);
            }
        }
        
        console.error("getTenantProfile error:", error);
        return null;
    }
}

export async function updateTenantProfile(data: Record<string, unknown>) {
    try {
        await apiClient.patch("/tenants/me", data);
        revalidatePath("/dashboard/settings/tenant");
        return { success: true };
    } catch (error: unknown) {
        console.error("updateTenantProfile error:", error);
        return { success: false, error: error instanceof Error ? error.message : "Erro desconhecido" };
    }
}

export async function getOrganizationProfile() {
    try {
        return await apiClient.get("/tenants/organization", {
            next: { revalidate: 0 }
        });
    } catch (error) {
        console.error("getOrganizationProfile error:", error);
        return null;
    }
}

export async function updateOrganizationProfile(data: Record<string, unknown>) {
    try {
        await apiClient.patch("/tenants/organization", data);
        revalidatePath("/dashboard/settings/organization");
        return { success: true };
    } catch (error: unknown) {
        console.error("updateOrganizationProfile error:", error);
        return { success: false, error: error instanceof Error ? error.message : "Erro desconhecido" };
    }
}

export async function getBranding(tenantId: string): Promise<BrandingData | null> {
    try {
        return await apiClient.get<BrandingData>(`/tenants/${tenantId}/branding`, {
            next: { revalidate: 0 }
        });
    } catch (error) {
        console.error("getBranding error:", error);
        return null;
    }
}

export async function updateBranding(data: Record<string, unknown>) {
    try {
        await apiClient.patch("/tenants/me/branding", data);
        revalidatePath("/dashboard/settings/branding");
        return { success: true };
    } catch (error: unknown) {
        console.error("updateBranding error:", error);
        return { success: false, error: error instanceof Error ? error.message : "Erro desconhecido" };
    }
}

export async function getMenuConfig(tenantId: string) {
    try {
        return await apiClient.get(`/public/menu/${tenantId}/config`, {
            next: { revalidate: 0 }
        });
    } catch (error) {
        console.error("getMenuConfig error:", error);
        return null;
    }
}

export async function updateMenuConfig(sections: MenuSection[]) {
    try {
        // Sanitize payload to remove server-managed fields (tenantId, order, dates, etc.)
        // that cause validation errors in the API DTO
        const sanitizedSections = sections.map(({ id, type, name, isActive, config }) => ({
            id,
            type,
            name,
            isActive,
            config
        }));

        await apiClient.patch("/tenants/me/menu-config", { sections: sanitizedSections });
        revalidatePath("/dashboard/settings/menu-design");
        return { success: true };
    } catch (error: unknown) {
        console.error("updateMenuConfig error:", error);
        return { success: false, error: error instanceof Error ? error.message : "Erro desconhecido" };
    }
}
