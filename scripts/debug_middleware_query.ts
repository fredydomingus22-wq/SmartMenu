
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load .env.local
dotenv.config({ path: path.resolve(__dirname, '../apps/web/.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

async function main() {
    console.log('--- Debug Middleware Query ---');
    console.log('URL:', supabaseUrl);

    // 1. Sign in to get a valid session (Simulate Auth)
    // We need the user's password or a valid session. 
    // Since we don't have the password, we'll verify with Service Role first 
    // to prove the data exists, then try to see if RLS blocks ANON + Token.

    const adminClient = createClient(supabaseUrl, serviceRoleKey);
    const email = 'fredyus29@gmail.com';

    // Check with Admin Client (Bypass RLS)
    const { data: adminProfile, error: adminError } = await adminClient
        .from('user_profiles')
        .select('*')
        .eq('email', email)
        .single();
    
    console.log('\n[Admin Client] Profile:', adminProfile);
    console.log('[Admin Client] Error:', adminError);

    if (!adminProfile) {
        console.error('User profile not found even with Admin access!');
        return;
    }

    console.log('\nTo fully test RLS, we would need to sign in.');
    console.log('If [Admin Client] sees the data but Middleware does not, it is 100% RLS or Token issue.');
    console.log('Tenant ID in Profile:', adminProfile.tenant_id);
}

main();
