import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { StockLowEvent } from '../events/stock-low.event';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class StockEventsListener {
  private readonly logger = new Logger(StockEventsListener.name);

  constructor(private readonly prisma: PrismaService) {}

  @OnEvent('stock.low')
  async handleStockLow(event: StockLowEvent) {
    this.logger.warn(
      `LOW STOCK: Product ${event.productId} has ${event.currentStock} units (threshold: ${event.threshold})`,
    );

    // Automation: Auto-disable product if stock is zero
    if (event.currentStock <= 0) {
      this.logger.log(`Disabling product ${event.productId} due to zero stock`);
      await this.prisma.product.update({
        where: { id: event.productId },
        data: { isAvailable: false },
      });
    }

    // Future: Emit notification to manager, create restock task, etc.
  }
}
