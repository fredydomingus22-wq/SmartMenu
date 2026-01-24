import { createBrowserClient } from "@supabase/ssr";

export const createClient = () => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://ykjkdyesejssidyqwqpc.supabase.co";
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlramtkeWVzZWpzc2lkeXF3cXBjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgzODUyNzcsImV4cCI6MjA4Mzk2MTI3N30.W5xyrkspeSSuDsqGOBA8VhckJak9IzyqfJnu0-kN20s";

    return createBrowserClient(
        supabaseUrl,
        supabaseKey
    );
};
