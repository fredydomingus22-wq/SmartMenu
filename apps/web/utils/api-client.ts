
const API_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

interface RequestOptions extends RequestInit {
    params?: Record<string, string>;
}

export class ApiError extends Error {
    constructor(public message: string, public status?: number) {
        super(message);
        this.name = "ApiError";
    }
}

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

    // Set default Content-Type if not provided (except for FormData)
    if (!headers.has("Content-Type") && !(fetchOptions.body instanceof FormData)) {
        headers.set("Content-Type", "application/json");
    }

    // 3. Automatic Server-Side Auth (Next.js 16 compliant)
    if (typeof window === 'undefined' && !headers.has("Authorization")) {
        try {
            const { createClient } = await import("./supabase/server");
            const supabase = await createClient();
            const { data: { session } } = await supabase.auth.getSession();
            const token = session?.access_token;

            if (token) {
                headers.set("Authorization", `Bearer ${token}`);
            }
        } catch (e) {
            console.debug("[apiClient] Could not access Supabase session in server environment", e);
        }
    }

    // 4. Cache Policy (Next.js 16 Defaults)
    // Authenticated requests should usually not be cached by default in Next.js 16
    const finalOptions: RequestInit = {
        cache: 'no-store', // Default to no-store for safety in Next.js 16
        ...fetchOptions,
        headers,
    };

    // 5. Debugging
    if (typeof window === 'undefined') {
        const method = options.method || 'GET';
        const hasAuth = headers.has("Authorization");
        if (!hasAuth) {
            console.warn(`[apiClient] ⚠️ Warning: Unauthenticated request to ${method} ${path}`);
        } else {
            console.log(`[apiClient] 🚀 ${method} ${path} [Auth: OK]`);
        }
    }

    try {
        const response = await fetch(url, finalOptions);

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
        if (error instanceof ApiError) throw error;

        const message = error instanceof Error ? error.message : "Unknown error";
        const stack = error instanceof Error ? error.stack : "";
        console.error(`[apiClient] ❌ Failed request to ${url}: ${message}`);
        if (stack) {
            console.debug(`[apiClient] Stack trace: ${stack}`);
        }
        throw new ApiError(message);
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
