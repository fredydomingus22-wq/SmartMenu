import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { OrderStatusUpdatedEvent } from '../events/order-status-updated.event';
import { LoyaltyService } from '../../loyalty/loyalty.service';

@Injectable()
export class OrderEventsListener {
  private readonly logger = new Logger(OrderEventsListener.name);

  constructor(private readonly loyaltyService: LoyaltyService) {}

  @OnEvent('order.status.updated')
  async handleOrderStatusUpdated(event: OrderStatusUpdatedEvent) {
    this.logger.log(
      `Event received: order.status.updated [${event.status}] for Order ${event.orderId}`,
    );

    // Automation: Loyalty Points on Delivered
    if (event.status === 'DELIVERED' && event.userId) {
      this.logger.log(
        `Triggering Loyalty automation for Order ${event.orderId}`,
      );
      try {
        await this.loyaltyService.earnPoints(
          event.userId,
          event.tenantId,
          event.total,
          event.orderId,
        );
        this.logger.log(`Loyalty points awarded for Order ${event.orderId}`);
      } catch (error) {
        this.logger.error(
          `Failed to award loyalty points for Order ${event.orderId}`,
          error,
        );
      }
    }
  }
}
