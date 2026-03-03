import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  createClient,
  RealtimeChannel,
  SupabaseClient,
} from '@supabase/supabase-js';

/**
 * SupabaseService — Singleton broadcast channels
 *
 * Keeps a persistent WebSocket channel per channel name instead of
 * creating and destroying one per broadcast. This is required because
 * Supabase Realtime broadcast needs an active subscriptions to route
 * messages to listeners. Ephemeral channels miss the delivery window.
 */
@Injectable()
export class SupabaseService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(SupabaseService.name);
  private publicClient!: SupabaseClient<any, 'public'>;
  private adminClient!: SupabaseClient<any, 'public'>;

  // Persistent channel registry: channelName → channel
  private readonly channels = new Map<string, RealtimeChannel>();

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

  async onModuleDestroy() {
    // Clean up all persistent channels on shutdown
    for (const [name, channel] of this.channels.entries()) {
      this.logger.log(`Removing persistent channel: ${name}`);
      await (this.adminClient || this.publicClient)?.removeChannel(channel);
    }
    this.channels.clear();
  }

  getPublicClient() {
    return this.publicClient;
  }

  getAdminClient() {
    return this.adminClient;
  }

  /**
   * Returns a persistent channel, subscribing it if not yet active.
   * Subsequent calls reuse the same WebSocket connection.
   */
  private getOrCreateChannel(channelName: string): Promise<RealtimeChannel> {
    const client = this.adminClient || this.publicClient;
    if (!client) {
      return Promise.reject(new Error('Supabase client not initialized'));
    }

    // Reuse existing channel if already subscribed
    if (this.channels.has(channelName)) {
      return Promise.resolve(this.channels.get(channelName)!);
    }

    return new Promise((resolve, reject) => {
      const channel = client.channel(channelName, {
        config: {
          broadcast: { ack: false },
        },
      });

      const timeout = setTimeout(() => {
        this.logger.warn(
          `Channel ${channelName} subscription timed out — using anyway`,
        );
        this.channels.set(channelName, channel);
        resolve(channel);
      }, 5000);

      channel.subscribe((status, err) => {
        if (status === 'SUBSCRIBED') {
          clearTimeout(timeout);
          this.logger.log(`Persistent channel ready: ${channelName}`);
          this.channels.set(channelName, channel);
          resolve(channel);
        } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
          clearTimeout(timeout);
          this.logger.error(
            `Channel ${channelName} failed: ${status} — ${String(err)}`,
          );
          reject(new Error(`Failed to subscribe to ${channelName}: ${status}`));
        }
      });
    });
  }

  /**
   * Broadcasts an event on a persistent channel.
   * The channel stays open for the lifetime of the service.
   */
  async broadcast(channelName: string, eventName: string, payload: unknown) {
    try {
      const channel = await this.getOrCreateChannel(channelName);
      const resp = await channel.send({
        type: 'broadcast',
        event: eventName,
        payload,
      });

      if (resp === 'ok') {
        this.logger.debug(`Broadcasted ${eventName} → ${channelName}`);
      } else {
        this.logger.warn(`Broadcast non-OK response: ${resp}`);
      }
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error);
      this.logger.error(
        `Error broadcasting ${eventName} to ${channelName}: ${msg}`,
      );
    }
  }
}
