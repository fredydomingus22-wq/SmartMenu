
import 'server-only';
import { apiClient as coreApiClient, type RequestOptions } from '@smart-menu/api';
import { createClient } from './supabase/server';

/**
 * Server-Side Authenticated API Client for Consumer App
 * 🛡️ strictly enforced server-only.
 * 🔑 Automatically injects Supabase session token.
 */
export async function apiClient<T = unknown>(path: string, options: RequestOptions = {}): Promise<T> {
    const headers = new Headers(options.headers as HeadersInit);

    // Automatic Server-Side Auth
    if (!headers.has("Authorization")) {
        try {
            const supabase = await createClient();
            const { data: { session } } = await supabase.auth.getSession();
            const token = session?.access_token;

            if (token) {
                headers.set("Authorization", `Bearer ${token}`);
            }
        } catch (e) {
            console.debug("[apiClientServer] Could not access Supabase session", e);
        }
    }

    return coreApiClient<T>(path, {
        ...options,
        headers,
    });
}

// Typed helpers for server
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
