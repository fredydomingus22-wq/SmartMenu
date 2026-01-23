import { Client } from 'pg';

const connectionString = 'postgresql://postgres.ykjkdyesejssidyqwqpc:MalhadoM11!@aws-0-eu-west-1.pooler.supabase.com:6543/postgres';

async function main() {
    const client = new Client({ connectionString });
    await client.connect();

    console.log('--- Checking RLS Policies ---');
    const policiesRes = await client.query(`
    SELECT tablename, policyname, cmd, qual, with_check 
    FROM pg_policies 
    WHERE schemaname = 'public';
  `);
    console.table(policiesRes.rows);

    console.log('--- Checking RLS Status ---');
    const statusRes = await client.query(`
    SELECT relname, relrowsecurity 
    FROM pg_class c 
    JOIN pg_namespace n ON n.oid = c.relnamespace 
    WHERE n.nspname = 'public' AND c.relkind = 'r';
  `);
    console.table(statusRes.rows);

    console.log('--- Checking Tenant Functions ---');
    const functionsRes = await client.query(`
    SELECT routine_name 
    FROM information_schema.routines 
    WHERE routine_schema = 'public' AND routine_name LIKE '%tenant%' OR routine_name LIKE '%org%';
  `);
    console.table(functionsRes.rows);

    await client.end();
}

main().catch(console.error);
