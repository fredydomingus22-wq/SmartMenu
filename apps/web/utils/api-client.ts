
const API_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:3001";

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
 * Core API Client
 * ⚠️ Safe for both Client and Server environments.
 * ⚠️ Does NOT include automatic server-side authentication to avoid boundary leaks.
 */
export async function apiClient<T = unknown>(path: string, options: RequestOptions = {}): Promise<T> {
    const { params, ...fetchOptions } = options;

    // 1. Construct URL
    const baseUrl = API_URL.endsWith('/') ? API_URL.slice(0, -1) : API_URL;
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    let url = `${baseUrl}${cleanPath}`;

    if (params) {
        const searchParams = new URLSearchParams(params);
        url += `?${searchParams.toString()}`;
    }

    // 2. Prepare Headers
    const headers = new Headers(fetchOptions.headers as HeadersInit);

    if (!headers.has("Content-Type") && !(fetchOptions.body instanceof FormData)) {
        headers.set("Content-Type", "application/json");
    }

    // 3. Environment-specific logging
    if (typeof window === 'undefined') {
        const method = options.method || 'GET';
        console.log(`[apiClient:core] 🚀 ${method} ${path} (Auth: ${headers.has('Authorization') ? 'YES' : 'NO'})`);
    } else {
        // Client-side: Inject Auth Token from Supabase Session
        try {
            // Dynamic import to avoid server-side bundle issues
            const { createClient } = await import("@/utils/supabase/client");
            const supabase = createClient();
            // Securely validate user first (even on client, to avoid sending stale tokens)
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data } = await supabase.auth.getSession();
                if (data.session?.access_token && !headers.has("Authorization")) {
                    headers.set("Authorization", `Bearer ${data.session.access_token}`);
                }
            }
        } catch (error) {
            console.warn("[apiClient:auth] Failed to inject auth token:", error);
        }
    }

    let lastError: unknown;
    const MAX_RETRIES = 2;
    const RETRY_DELAY = 500; // ms

    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
        try {
            if (attempt > 0) {
                if (typeof window === 'undefined') console.log(`[apiClient:retry] Attempt ${attempt}/${MAX_RETRIES} for ${path}...`);
                await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * attempt));
            }

            const response = await fetch(url, {
                ...fetchOptions,
                headers,
                cache: fetchOptions.cache || (fetchOptions.next?.tags ? 'force-cache' : 'no-store'),
            });

            if (!response.ok) {
                let errorMessage = `API Error: ${response.status} ${response.statusText}`;
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.message || JSON.stringify(errorData) || errorMessage;
                } catch { /* ignore */ }

                throw new ApiError(errorMessage, response.status);
            }

            const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                return await response.json();
            }

            return null as unknown as T;
        } catch (error) {
            lastError = error;
            const isNetworkError = error instanceof Error && (error.message.includes("fetch failed") || error.message.includes("ECONNREFUSED"));

            if (isNetworkError && attempt < MAX_RETRIES) {
                continue; // Retry
            }

            if (error instanceof ApiError) {
                // Global Error Toasting (Client Side Only)
                if (typeof window !== 'undefined') {
                    try {
                        const { toast } = await import("sonner");
                        toast.error("Erro na Requisição", {
                            description: error.message,
                            duration: 5000,
                        });
                    } catch { /* sonner might not be loaded yet */ }
                }
                throw error;
            }
            const message = error instanceof Error ? error.message : "Unknown error";
            console.error(`[apiClient:core] ❌ Failed request to ${url}: ${message}`);

            if (typeof window !== 'undefined') {
                try {
                    const { toast } = await import("sonner");
                    toast.error("Erro de Conexão", {
                        description: "Não foi possível contactar o servidor. Verifique sua conexão.",
                    });
                } catch { /* ignore */ }
            }

            throw new ApiError(message);
        }
    }
    throw lastError;
}

// Typed helpers
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
