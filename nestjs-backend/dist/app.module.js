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
const typeorm_1 = require("@nestjs/typeorm");
const users_module_1 = require("./users/users.module");
const purchase_orders_module_1 = require("./purchase-orders/purchase-orders.module");
const approval_history_module_1 = require("./approval-history/approval-history.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (configService) => {
                    const databaseUrl = configService.get("DATABASE_URL");
                    const synchronize = configService.get("TYPEORM_SYNCHRONIZE") === "true";
                    if (databaseUrl) {
                        return {
                            type: "postgres",
                            url: databaseUrl,
                            autoLoadEntities: true,
                            synchronize,
                            logging: configService.get("NODE_ENV") === "development",
                        };
                    }
                    return {
                        type: "sqlite",
                        database: "po.sqlite",
                        autoLoadEntities: true,
                        synchronize: true,
                        logging: configService.get("NODE_ENV") === "development",
                    };
                },
            }),
            users_module_1.UsersModule,
            purchase_orders_module_1.PurchaseOrdersModule,
            approval_history_module_1.ApprovalHistoryModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map