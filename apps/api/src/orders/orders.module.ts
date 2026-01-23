import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { OrdersPublicController } from './orders-public.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { LoyaltyModule } from '../loyalty/loyalty.module';

@Module({
  imports: [PrismaModule, ConfigModule, LoyaltyModule],
  controllers: [OrdersController, OrdersPublicController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
