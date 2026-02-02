import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService implements OnModuleInit {
    private readonly logger = new Logger(SupabaseService.name);
    private supabase!: SupabaseClient;

    constructor(private configService: ConfigService) { }

    onModuleInit() {
        const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
        const supabaseKey = this.configService.get<string>('SUPABASE_SERVICE_ROLE_KEY');

        if (!supabaseUrl || !supabaseKey) {
            this.logger.error('Supabase URL or Service Role Key missing in environment variables');
            return;
        }

        this.supabase = createClient(supabaseUrl, supabaseKey);
        this.logger.log('Supabase Service Role Client initialized');
    }

    async broadcast(channelName: string, eventName: string, payload: any) {
        if (!this.supabase) {
            this.logger.error('Cannot broadcast: Supabase client not initialized');
            return;
        }

        const channel = this.supabase.channel(channelName);

        try {
            await channel.send({
                type: 'broadcast',
                event: eventName,
                payload,
            });
            this.logger.debug(`Broadcasted ${eventName} to ${channelName}`);
        } catch (error: any) {
            this.logger.error(`Error broadcasting to ${channelName}: ${error.message}`);
        } finally {
            this.supabase.removeChannel(channel);
        }
    }
}
