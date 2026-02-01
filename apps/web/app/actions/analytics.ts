"use server";

import { getAuthorizedClient } from "@/utils/auth-server";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:3001";

export async function getKPIs() {
    const { token, error } = await getAuthorizedClient();
    if (error || !token) return { success: false, error: "Unauthorized" };

    try {
        const response = await fetch(`${API_URL}/analytics/kpis`, {
            headers: { Authorization: `Bearer ${token}` },
            next: { revalidate: 300 }, // 5 minutes cache
        });

        if (!response.ok) {
            // If response is not OK, it will be caught by the catch block below
            // and the message will be "Failed to fetch KPIs"
            throw new Error("Failed to fetch KPIs");
        }
        return { success: true, data: await response.json() };
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Failed to fetch KPIs";
        return { success: false, error: message };
    }
}

export async function getSalesTrend() {
    const { token, error } = await getAuthorizedClient();
    if (error || !token) return { success: false, error: "Unauthorized" };

    try {
        const response = await fetch(`${API_URL}/analytics/sales-trend`, {
            headers: { Authorization: `Bearer ${token}` },
            next: { revalidate: 300 },
        });

        if (!response.ok) {
            // If response is not OK, it will be caught by the catch block below
            // and the message will be "Failed to fetch sales trend"
            throw new Error("Failed to fetch sales trend");
        }
        return { success: true, data: await response.json() };
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Failed to fetch sales trend";
        return { success: false, error: message };
    }
}

export async function getProductRanking() {
    const { token, error } = await getAuthorizedClient();
    if (error || !token) return { success: false, error: "Unauthorized" };

    try {
        const response = await fetch(`${API_URL}/analytics/product-ranking`, {
            headers: { Authorization: `Bearer ${token}` },
            next: { revalidate: 300 },
        });

        if (!response.ok) {
            // If response is not OK, it will be caught by the catch block below
            // and the message will be "Failed to fetch product ranking"
            throw new Error("Failed to fetch product ranking");
        }
        return { success: true, data: await response.json() };
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Failed to fetch product ranking";
        return { success: false, error: message };
    }
}

export async function getPeakHours() {
    const { token, error } = await getAuthorizedClient();
    if (error || !token) return { success: false, error: "Unauthorized" };

    try {
        const response = await fetch(`${API_URL}/analytics/peak-hours`, {
            headers: { Authorization: `Bearer ${token}` },
            next: { revalidate: 300 },
        });

        if (!response.ok) throw new Error("Failed to fetch peak hours");
        return { success: true, data: await response.json() };
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Failed to fetch peak hours";
        return { success: false, error: message };
    }
}

export async function getCustomerRanking() {
    const { token, error } = await getAuthorizedClient();
    if (error || !token) return { success: false, error: "Unauthorized" };

    try {
        const response = await fetch(`${API_URL}/analytics/customer-ranking`, {
            headers: { Authorization: `Bearer ${token}` },
            next: { revalidate: 300 },
        });

        if (!response.ok) throw new Error("Failed to fetch customer ranking");
        return { success: true, data: await response.json() };
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Failed to fetch customer ranking";
        return { success: false, error: message };
    }
}

export async function getTableRanking() {
    const { token, error } = await getAuthorizedClient();
    if (error || !token) return { success: false, error: "Unauthorized" };

    try {
        const response = await fetch(`${API_URL}/analytics/table-ranking`, {
            headers: { Authorization: `Bearer ${token}` },
            next: { revalidate: 300 },
        });

        if (!response.ok) throw new Error("Failed to fetch table ranking");
        return { success: true, data: await response.json() };
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Failed to fetch table ranking";
        return { success: false, error: message };
    }
}
