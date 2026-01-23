import { createClient } from "./supabase/server";

/**
 * Robust helper to get a validated user and fresh token in Server Components.
 * This should be used instead of getSession() to avoid expired token errors.
 */
export async function getAuthorizedClient() {
    const supabase = await createClient();

    // getUser() triggers a refresh if needed via the middleware/cookie logic
    // and validates the token with Supabase Auth
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
        return { user: null, token: null, error: userError };
    }

    // getSession() is now safer to get the token string since getUser() ensured freshness
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    return {
        user,
        token: session?.access_token || null,
        error: sessionError
    };
}
