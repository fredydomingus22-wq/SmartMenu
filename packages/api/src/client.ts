
export interface RequestOptions extends RequestInit {
    params?: Record<string, string>;
}

export class ApiError extends Error {
    constructor(public message: string, public status?: number) {
        super(message);
        this.name = "ApiError";
    }
}

export function createCoreApiClient(baseUrl: string, options: RequestOptions = {}) {
    const client = async <T = unknown>(path: string, callOptions: RequestOptions = {}): Promise<T> => {
        const { params, ...fetchOptions } = { ...options, ...callOptions };

        const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
        const cleanPath = path.startsWith('/') ? path : `/${path}`;
        let url = `${cleanBaseUrl}${cleanPath}`;

        if (params) {
            const searchParams = new URLSearchParams(params);
            url += `?${searchParams.toString()}`;
        }

        const headers = new Headers(fetchOptions.headers as HeadersInit);

        if (!headers.has("Content-Type") && !(fetchOptions.body instanceof FormData)) {
            headers.set("Content-Type", "application/json");
        }

        try {
            const response = await fetch(url, {
                ...fetchOptions,
                headers,
                cache: fetchOptions.cache || 'no-store',
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
            if (error instanceof ApiError) throw error;
            const message = error instanceof Error ? error.message : "Unknown error";
            console.error(`[apiClient:core] ❌ Failed request to ${url}: ${message}`);
            throw new ApiError(message);
        }
    };

    // Typed helpers
    client.get = <T = unknown>(path: string, options: Omit<RequestOptions, "method"> = {}) =>
        client<T>(path, { ...options, method: "GET" });

    client.post = <T = unknown>(path: string, body?: unknown, options: Omit<RequestOptions, "method" | "body"> = {}) =>
        client<T>(path, { ...options, method: "POST", body: body ? JSON.stringify(body) : undefined });

    client.patch = <T = unknown>(path: string, body?: unknown, options: Omit<RequestOptions, "method" | "body"> = {}) =>
        client<T>(path, { ...options, method: "PATCH", body: body ? JSON.stringify(body) : undefined });

    client.put = <T = unknown>(path: string, body?: unknown, options: Omit<RequestOptions, "method" | "body"> = {}) =>
        client<T>(path, { ...options, method: "PUT", body: body ? JSON.stringify(body) : undefined });

    client.delete = <T = unknown>(path: string, options: Omit<RequestOptions, "method"> = {}) =>
        client<T>(path, { ...options, method: "DELETE" });

    return client;
}
