import { Module } from '@nestjs/common';
import { OrderEventsListener } from './listeners/order-events.listener';
import { StockEventsListener } from './listeners/stock-events.listener';
import { UpsellService } from './services/upsell.service';
import { SuggestionsController } from './suggestions.controller';
import { LoyaltyModule } from '../loyalty/loyalty.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [LoyaltyModule, PrismaModule],
  controllers: [SuggestionsController],
  providers: [OrderEventsListener, StockEventsListener, UpsellService],
  exports: [UpsellService],
})
export class WorkflowsModule {}
