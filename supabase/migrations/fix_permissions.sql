-- 1. Grant usage on schema public
GRANT USAGE ON SCHEMA public TO service_role;
GRANT USAGE ON SCHEMA public TO postgres;
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;

-- 2. Grant ALL on all tables in public to service_role and postgres
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres;

-- 3. Explicitly allow service_role to bypass RLS
ALTER ROLE service_role SET search_path TO public, auth;
ALTER TABLE public.user_profiles FORCE ROW LEVEL SECURITY;
-- We want RLS enabled for users, but service_role should bypass it by default in Supabase.
-- If for some reason it's not bypassing, we can add a specific policy:
DROP POLICY IF EXISTS "service_role_bypass" ON public.user_profiles;
CREATE POLICY "service_role_bypass" ON public.user_profiles FOR ALL TO service_role USING (true);

-- 4. Ensure ownership is correct to allow future grants
ALTER TABLE public.user_profiles OWNER TO postgres;

-- 5. Fix specific table permissions for the check (redundant but safe)
GRANT SELECT ON public.user_profiles TO service_role;
GRANT SELECT ON public.tenants TO service_role;
GRANT SELECT ON public.organizations TO service_role;

-- 5. Final check of the schema owner
-- ALTER SCHEMA public OWNER TO postgres;
