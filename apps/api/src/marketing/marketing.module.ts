import { Module } from '@nestjs/common';
import { MarketingController } from './marketing.controller';
import { MarketingService } from './marketing.service';
import { PrismaModule } from '../prisma/prisma.module';
import { SupabaseModule } from '../common/supabase.module';

@Module({
  imports: [PrismaModule, SupabaseModule],
  controllers: [MarketingController],
  providers: [MarketingService],
  exports: [MarketingService],
})
export class MarketingModule { }
