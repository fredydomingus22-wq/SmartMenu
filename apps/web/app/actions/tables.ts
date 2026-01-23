"use server";

import { apiClient } from "@/utils/api-client";
import { revalidatePath } from "next/cache";

export async function getTables() {
    try {
        return await apiClient.get("/tables");
    } catch (error) {
        console.error("getTables error:", error);
        return [];
    }
}

export async function createTable(data: { number: number }) {
    try {
        const result = await apiClient.post("/tables", data);
        revalidatePath("/dashboard/settings/tables");
        return { success: true, data: result };
    } catch (error: any) {
        console.error("createTable error:", error);
        return {
            success: false,
            error: error.message || "Erro ao criar mesa"
        };
    }
}

export async function deleteTable(id: string) {
    try {
        await apiClient.delete(`/tables/${id}`);
        revalidatePath("/dashboard/settings/tables");
        return { success: true };
    } catch (error: any) {
        console.error("deleteTable error:", error);
        return {
            success: false,
            error: error.message || "Erro ao eliminar mesa"
        };
    }
}
