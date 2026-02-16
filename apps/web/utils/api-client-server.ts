
import 'server-only';
import { apiClient as coreApiClient, type RequestOptions } from './api-client';
import { createClient } from './supabase/server';

/**
 * Server-Side Authenticated API Client
 * 🛡️ strictly enforced server-only.
 * 🔑 Automatically injects Supabase session token.
 */
export async function apiClient<T = unknown>(path: string, options: RequestOptions = {}): Promise<T> {
    const headers = new Headers(options.headers as HeadersInit);

    // Automatic Server-Side Auth
    if (!headers.has("Authorization")) {
        try {
            const supabase = await createClient();
            // In Server Actions/Components, getUser() is the source of truth
            const { data: { user } } = await supabase.auth.getUser();

            if (user) {
                // Get session for token
                const { data: { session } } = await supabase.auth.getSession();
                const token = session?.access_token;

                if (token) {
                    headers.set("Authorization", `Bearer ${token}`);
                    console.debug(`[apiClientServer] Token attached for ${user.email} -> ${path}`);
                } else {
                    console.warn(`[apiClientServer] User ${user.email} active but NO session token for ${path}`);
                }
            } else {
                console.warn(`[apiClientServer] No active user for authenticated request -> ${path}`);
            }
        } catch (e) {
            console.error("[apiClientServer] Critical Auth Exception:", e);
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
    apiClient<T>(path, { 
        ...options, 
        method: "POST", 
        body: body instanceof FormData ? body : (body ? JSON.stringify(body) : undefined) 
    });

apiClient.patch = <T = unknown>(path: string, body?: unknown, options: Omit<RequestOptions, "method" | "body"> = {}) =>
    apiClient<T>(path, { 
        ...options, 
        method: "PATCH", 
        body: body instanceof FormData ? body : (body ? JSON.stringify(body) : undefined) 
    });

apiClient.put = <T = unknown>(path: string, body?: unknown, options: Omit<RequestOptions, "method" | "body"> = {}) =>
    apiClient<T>(path, { 
        ...options, 
        method: "PUT", 
        body: body instanceof FormData ? body : (body ? JSON.stringify(body) : undefined) 
    });

apiClient.delete = <T = unknown>(path: string, options: Omit<RequestOptions, "method"> = {}) =>
    apiClient<T>(path, { ...options, method: "DELETE" });
