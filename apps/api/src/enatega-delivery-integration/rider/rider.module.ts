import { Module } from '@nestjs/common';
import { RiderService } from './rider.service';
import { RiderController } from './rider.controller';
import { SupabaseModule } from '../../common/supabase.module';

@Module({
  imports: [SupabaseModule],
  controllers: [RiderController],
  providers: [RiderService],
})
export class RiderModule {}
