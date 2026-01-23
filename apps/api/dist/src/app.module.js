"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const passport_1 = require("@nestjs/passport");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const payment_module_1 = require("./payment/payment.module");
const prisma_service_1 = require("./prisma/prisma.service");
const supabase_strategy_1 = require("./common/strategies/supabase.strategy");
const categories_module_1 = require("./categories/categories.module");
const products_module_1 = require("./products/products.module");
const prisma_module_1 = require("./prisma/prisma.module");
const menu_module_1 = require("./menu/menu.module");
const orders_module_1 = require("./orders/orders.module");
const users_module_1 = require("./users/users.module");
const tenants_module_1 = require("./tenants/tenants.module");
const tables_module_1 = require("./tables/tables.module");
const loyalty_module_1 = require("./loyalty/loyalty.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            passport_1.PassportModule,
            payment_module_1.PaymentModule,
            categories_module_1.CategoriesModule,
            products_module_1.ProductsModule,
            prisma_module_1.PrismaModule,
            menu_module_1.MenuModule,
            orders_module_1.OrdersModule,
            users_module_1.UsersModule,
            tenants_module_1.TenantsModule,
            tables_module_1.TablesModule,
            loyalty_module_1.LoyaltyModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService, prisma_service_1.PrismaService, supabase_strategy_1.SupabaseStrategy],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map