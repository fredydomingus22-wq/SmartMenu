"use server";

import { apiClient } from "@/utils/api-client";
import { revalidatePath } from "next/cache";

export async function getLoyaltyConfig() {
    try {
        return await apiClient.get("/loyalty/config", {
            next: { revalidate: 0 }
        });
    } catch (error) {
        console.error("getLoyaltyConfig error:", error);
        return null;
    }
}

export async function updateLoyaltyConfig(data: Record<string, unknown>) {
    try {
        await apiClient.patch("/loyalty/config", data);
        revalidatePath("/dashboard/loyalty");
        return { success: true };
    } catch (error: unknown) {
        console.error("updateLoyaltyConfig error:", error);
        return { success: false, error: error instanceof Error ? error.message : "Erro desconhecido" };
    }
}

export async function getLoyaltyRewards(tenantId: string) {
    try {
        return await apiClient.get(`/loyalty/rewards/public?tenantId=${tenantId}`, {
            next: { revalidate: 0 }
        });
    } catch (error) {
        console.error("getLoyaltyRewards error:", error);
        return [];
    }
}

export async function createLoyaltyReward(data: Record<string, unknown>) {
    try {
        await apiClient.post("/loyalty/rewards", data);
        revalidatePath("/dashboard/loyalty");
        return { success: true };
    } catch (error: unknown) {
        console.error("createLoyaltyReward error:", error);
        return { success: false, error: error instanceof Error ? error.message : "Erro desconhecido" };
    }
}

export async function updateLoyaltyReward(id: string, data: Record<string, unknown>) {
    try {
        await apiClient.patch(`/loyalty/rewards/${id}`, data);
        revalidatePath("/dashboard/loyalty");
        return { success: true };
    } catch (error: unknown) {
        console.error("updateLoyaltyReward error:", error);
        return { success: false, error: error instanceof Error ? error.message : "Erro desconhecido" };
    }
}

export async function deleteLoyaltyReward(id: string) {
    try {
        await apiClient.delete(`/loyalty/rewards/${id}`);
        revalidatePath("/dashboard/loyalty");
        return { success: true };
    } catch (error: unknown) {
        console.error("deleteLoyaltyReward error:", error);
        return { success: false, error: error instanceof Error ? error.message : "Erro desconhecido" };
    }
}
