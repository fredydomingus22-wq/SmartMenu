import { createBrowserClient } from "@supabase/ssr";

export const createClient = (supabaseUrl: string, supabaseKey: string) => {
    if (!supabaseUrl || !supabaseKey) {
        throw new Error('Supabase URL and key are required');
    }

    return createBrowserClient(supabaseUrl, supabaseKey);
};
