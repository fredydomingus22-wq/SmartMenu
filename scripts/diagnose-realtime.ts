
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load env from apps/api/.env
dotenv.config({ path: path.resolve(__dirname, '../apps/api/.env') });

async function testRealtime() {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;

    console.log('Testing Realtime Connection...');
    console.log('URL:', supabaseUrl);
    console.log('Key (first 10 chars):', supabaseKey?.substring(0, 10));

    if (!supabaseUrl || !supabaseKey) {
        console.error('Missing credentials');
        return;
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const tenantId = 'test-tenant';
    const channelName = `orders:${tenantId}`;

    console.log(`Creating channel: ${channelName}`);
    const channel = supabase.channel(channelName);

    channel.subscribe((status) => {
        console.log(`Subscription status: ${status}`);
        if (status === 'SUBSCRIBED') {
            console.log('Successfully subscribed!');

            // Try to broadcast
            console.log('Attempting to broadcast...');
            channel.send({
                type: 'broadcast',
                event: 'TEST_EVENT',
                payload: { message: 'Hello from script' }
            }).then((resp) => {
                console.log(`Broadcast response: ${resp}`);
                if (resp === 'ok') {
                    console.log('✅ Broadcast OK');
                } else {
                    console.error('❌ Broadcast FAILED');
                }
                // Cleanup
                setTimeout(() => {
                    supabase.removeChannel(channel);
                    process.exit(0);
                }, 1000);
            });
        }
    });

    // Timeout
    setTimeout(() => {
        console.error('Timeout waiting for subscription');
        process.exit(1);
    }, 10000);
}

testRealtime();
