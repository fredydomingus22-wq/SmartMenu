import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { ThrottlerModule } from '@nestjs/throttler';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PaymentModule } from './payment/payment.module';
import { SupabaseStrategy } from './common/strategies/supabase.strategy';
import { CategoriesModule } from './categories/categories.module';
import { ProductsModule } from './products/products.module';
import { PrismaModule } from './prisma/prisma.module';
import { MenuModule } from './menu/menu.module';
import { OrdersModule } from './orders/orders.module';
import { UsersModule } from './users/users.module';
import { TenantsModule } from './tenants/tenants.module';
import { TablesModule } from './tables/tables.module';
import { LoyaltyModule } from './loyalty/loyalty.module';
import { SearchModule } from './search/search.module';
import { WorkflowsModule } from './workflows/workflows.module';
import { ServiceRequestsModule } from './service-requests/service-requests.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { MarketingModule } from './marketing/marketing.module';
import { SupabaseModule } from './common/supabase.module';
import { RiderModule } from './enatega-delivery-integration/rider/rider.module';
import { DeliveryModule } from './enatega-delivery-integration/delivery/delivery.module';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    EventEmitterModule.forRoot(),
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 1 minute
        limit: 100, // requests per ttl
      },
    ]),
    PassportModule,
    PaymentModule,
    CategoriesModule,
    ProductsModule,
    PrismaModule,
    MenuModule,
    OrdersModule,
    UsersModule,
    TenantsModule,
    TablesModule,
    LoyaltyModule,
    SearchModule,
    WorkflowsModule,
    ServiceRequestsModule,
    AnalyticsModule,
    MarketingModule,
    SupabaseModule,
    RiderModule,
    DeliveryModule,
    ChatModule,
  ],
  controllers: [AppController],
  providers: [AppService, SupabaseStrategy],
})
export class AppModule {}
