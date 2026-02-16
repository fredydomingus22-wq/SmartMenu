import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService implements OnModuleInit {
  private readonly logger = new Logger(SupabaseService.name);
  private publicClient!: SupabaseClient<any, 'public'>;
  private adminClient!: SupabaseClient<any, 'public'>;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseAnonKey = this.configService.get<string>('SUPABASE_ANON_KEY');
    const supabaseServiceKey = this.configService.get<string>(
      'SUPABASE_SERVICE_ROLE_KEY',
    );

    if (!supabaseUrl) {
      this.logger.error('Supabase URL missing in environment variables');
      return;
    }

    if (supabaseAnonKey) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      this.publicClient = createClient(supabaseUrl, supabaseAnonKey);
      this.logger.log('Supabase Public Client initialized');
    }

    if (supabaseServiceKey) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      this.adminClient = createClient(supabaseUrl, supabaseServiceKey);
      this.logger.log('Supabase Admin Client initialized');
    }
  }

  getPublicClient() {
    return this.publicClient;
  }

  getAdminClient() {
    return this.adminClient;
  }

  async broadcast(channelName: string, eventName: string, payload: unknown) {
    const client = this.adminClient || this.publicClient;
    if (!client) {
      this.logger.error('Cannot broadcast: Supabase client not initialized');
      return;
    }

    const channel = client.channel(channelName);

    try {
      await channel.send({
        type: 'broadcast',
        event: eventName,
        payload,
      });
      this.logger.debug(`Broadcasted ${eventName} to ${channelName}`);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(
        `Error broadcasting to ${channelName}: ${errorMessage}`,
      );
    } finally {
      await client.removeChannel(channel);
    }
  }
}
