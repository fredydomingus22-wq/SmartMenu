import { apiClient as coreApiClient } from "@smart-menu/api";
import { toast } from "sonner";

export interface RequestOptions extends RequestInit {
    params?: Record<string, string>;
}

export class ApiError extends Error {
    constructor(public message: string, public status?: number) {
        super(message);
        this.name = "ApiError";
    }
}

/**
 * Client-Side API Client for Consumer App
 * 🛡️ Includes automatic error reporting via Sonner.
 */
export async function apiClient<T = unknown>(path: string, options: RequestOptions = {}): Promise<T> {
    try {
        return await coreApiClient<T>(path, options);
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Ocorreu um erro inesperado.";
        console.error(`[apiClient:consumer] ❌ Failed request to ${path}:`, error);

        // Automatic Error Toasting
        if (typeof window !== 'undefined') {
            toast.error("Erro na Requisição", {
                description: message,
                duration: 5000,
            });
        }

        throw error;
    }
}

// Typed helpers
apiClient.get = <T = unknown>(path: string, options: Omit<RequestOptions, "method"> = {}) =>
    apiClient<T>(path, { ...options, method: "GET" });

apiClient.post = <T = unknown>(path: string, body?: unknown, options: Omit<RequestOptions, "method" | "body"> = {}) =>
    apiClient<T>(path, { ...options, method: "POST", body: body ? JSON.stringify(body) : undefined });

apiClient.patch = <T = unknown>(path: string, body?: unknown, options: Omit<RequestOptions, "method" | "body"> = {}) =>
    apiClient<T>(path, { ...options, method: "PATCH", body: body ? JSON.stringify(body) : undefined });

apiClient.put = <T = unknown>(path: string, body?: unknown, options: Omit<RequestOptions, "method" | "body"> = {}) =>
    apiClient<T>(path, { ...options, method: "PUT", body: body ? JSON.stringify(body) : undefined });

apiClient.delete = <T = unknown>(path: string, options: Omit<RequestOptions, "method"> = {}) =>
    apiClient<T>(path, { ...options, method: "DELETE" });
