"use server";

import { getAuthorizedClient } from "@/utils/auth-server";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:3001";

export async function getKPIs(startDate?: string, endDate?: string) {
    const { token, error } = await getAuthorizedClient();
    if (error || !token) return { success: false, error: "Unauthorized" };

    const url = new URL(`${API_URL}/analytics/kpis`);
    if (startDate) url.searchParams.append("startDate", startDate);
    if (endDate) url.searchParams.append("endDate", endDate);

    try {
        const response = await fetch(url.toString(), {
            headers: { Authorization: `Bearer ${token}` },
            cache: 'no-store',
        });

        if (!response.ok) throw new Error("Failed to fetch KPIs");
        return { success: true, data: await response.json() };
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Failed to fetch KPIs";
        return { success: false, error: message };
    }
}

export async function getSalesTrend(startDate?: string, endDate?: string, categoryId?: string, productId?: string) {
    const { token, error } = await getAuthorizedClient();
    if (error || !token) return { success: false, error: "Unauthorized" };

    const url = new URL(`${API_URL}/analytics/sales-trend`);
    if (startDate) url.searchParams.append("startDate", startDate);
    if (endDate) url.searchParams.append("endDate", endDate);
    if (categoryId) url.searchParams.append("categoryId", categoryId);
    if (productId) url.searchParams.append("productId", productId);

    try {
        const response = await fetch(url.toString(), {
            headers: { Authorization: `Bearer ${token}` },
            cache: 'no-store',
        });

        if (!response.ok) throw new Error("Failed to fetch sales trend");
        return { success: true, data: await response.json() };
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Failed to fetch sales trend";
        return { success: false, error: message };
    }
}

export async function getProductPerformance(options: {
    limit?: number;
    sortBy?: "quantity" | "revenue";
    order?: "asc" | "desc";
    startDate?: string;
    endDate?: string;
} = {}) {
    const { token, error } = await getAuthorizedClient();
    if (error || !token) return { success: false, error: "Unauthorized" };

    const url = new URL(`${API_URL}/analytics/product-performance`);
    if (options.limit) url.searchParams.append("limit", options.limit.toString());
    if (options.sortBy) url.searchParams.append("sortBy", options.sortBy);
    if (options.order) url.searchParams.append("order", options.order);
    if (options.startDate) url.searchParams.append("startDate", options.startDate);
    if (options.endDate) url.searchParams.append("endDate", options.endDate);

    try {
        const response = await fetch(url.toString(), {
            headers: { Authorization: `Bearer ${token}` },
            next: { revalidate: 300 },
        });

        if (!response.ok) throw new Error("Failed to fetch product performance");
        return { success: true, data: await response.json() };
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Failed to fetch product performance";
        return { success: false, error: message };
    }
}

export async function getPeakHours(startDate?: string, endDate?: string) {
    const { token, error } = await getAuthorizedClient();
    if (error || !token) return { success: false, error: "Unauthorized" };

    const url = new URL(`${API_URL}/analytics/peak-hours`);
    if (startDate) url.searchParams.append("startDate", startDate);
    if (endDate) url.searchParams.append("endDate", endDate);

    try {
        const response = await fetch(url.toString(), {
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

export async function getCustomerProfile(id: string, startDate?: string, endDate?: string) {
    const { token, error } = await getAuthorizedClient();
    if (error || !token) return { success: false, error: "Unauthorized" };

    const url = new URL(`${API_URL}/analytics/customer/${id}`);
    if (startDate) url.searchParams.append("startDate", startDate);
    if (endDate) url.searchParams.append("endDate", endDate);

    try {
        const response = await fetch(url.toString(), {
            headers: { Authorization: `Bearer ${token}` },
            next: { revalidate: 300 },
        });

        if (!response.ok) throw new Error("Failed to fetch customer profile");
        return { success: true, data: await response.json() };
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Failed to fetch customer profile";
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

export async function getAdvancedMetrics(startDate?: string, endDate?: string) {
    const { token, error } = await getAuthorizedClient();
    if (error || !token) return { success: false, error: "Unauthorized" };

    const url = new URL(`${API_URL}/analytics/advanced-metrics`);
    if (startDate) url.searchParams.append("startDate", startDate);
    if (endDate) url.searchParams.append("endDate", endDate);

    try {
        const response = await fetch(url.toString(), {
            headers: { Authorization: `Bearer ${token}` },
            next: { revalidate: 300 },
        });

        if (!response.ok) throw new Error("Failed to fetch advanced metrics");
        return { success: true, data: await response.json() };
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Failed to fetch advanced metrics";
        return { success: false, error: message };
    }
}
