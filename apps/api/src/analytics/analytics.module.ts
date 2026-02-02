import { Module } from '@nestjs/common';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { PrismaModule } from '../prisma/prisma.module';
import { MarketingModule } from '../marketing/marketing.module';
import { SupabaseModule } from '../common/supabase.module';

@Module({
  imports: [PrismaModule, MarketingModule, SupabaseModule],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
})
export class AnalyticsModule { }
