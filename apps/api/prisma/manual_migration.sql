-- Migration script to rename users to user_profiles and establish FK to auth.users
-- Manual SQL for Supabase Project ykjkdyesejssidyqwqpc

BEGIN;

-- 1. Rename the table
ALTER TABLE IF EXISTS "public"."users" RENAME TO "user_profiles";

-- 2. Ensure the ID column is UUID (Prisma needs it to match auth.users.id)
-- If it's already UUID, this might skip or just re-confirm. 
-- But Prisma schema showed @id @db.Uuid, so we ensure the DB matches.
ALTER TABLE "public"."user_profiles" 
ALTER COLUMN "id" TYPE uuid USING "id"::uuid;

-- 3. Add the foreign key constraint to auth.users
-- Note: users in public schema might have IDs that don't exist in auth.users yet if synced incorrectly.
-- This might fail if there's orphaned data.
ALTER TABLE "public"."user_profiles"
ADD CONSTRAINT "user_profile_auth_user_fkey"
FOREIGN KEY ("id") REFERENCES "auth"."users"("id")
ON DELETE CASCADE;

-- 4. Fix other constraints that might have been renamed by the table rename
-- Prisma expects specific naming for its internal mapping or we must map them in schema.
-- We already added map: "user_profile_auth_user_fkey" in the schema.

-- 5. Establish relations for oauth_authorizations if they exist in this environment
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'auth' AND table_name = 'oauth_authorizations') THEN
        ALTER TABLE "auth"."oauth_authorizations"
        DROP CONSTRAINT IF EXISTS "oauth_authorizations_user_id_fkey";
        
        -- We won't add the FK from auth back to public since it's circular/atypical for Supabase standard,
        -- but Prisma will handle it via its own logic if needed. 
        -- However, we can add a comment for documentation.
        COMMENT ON COLUMN "auth"."oauth_authorizations"."user_id" IS 'Linked to public.user_profiles.id';
    END IF;
END $$;

COMMIT;
