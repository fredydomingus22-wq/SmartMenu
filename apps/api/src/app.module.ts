import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PaymentModule } from './payment/payment.module';
import { PrismaService } from './prisma/prisma.service';
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

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
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
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService, SupabaseStrategy],
})
export class AppModule {}
