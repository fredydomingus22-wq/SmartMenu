"use server";

import { apiClient } from "@/utils/api-client-server";
import { revalidatePath } from "next/cache";

export async function getOrders(token?: string | null) {
    try {
        const headers: Record<string, string> = {};

        if (token) {
            headers.Authorization = `Bearer ${token}`;
        }

        return await apiClient.get<unknown[]>("/orders", {
            headers,
            next: { revalidate: 0 }
        });
    } catch (error) {
        console.error("getOrders error:", error);
        return [];
    }
}

export async function updateOrderStatus(id: string, status: string) {
    try {
        await apiClient.patch(`/orders/${id}/status`, { status });

        revalidatePath("/dashboard/orders");
        revalidatePath("/dashboard/kds");
        return { success: true };
    } catch (error: unknown) {
        console.error("updateOrderStatus error:", error);
        return { success: false, error: error instanceof Error ? error.message : "Erro desconhecido" };
    }
}
