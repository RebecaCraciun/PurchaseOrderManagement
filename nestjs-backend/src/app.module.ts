import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersModule } from "./users/users.module";
import { PurchaseOrdersModule } from "./purchase-orders/purchase-orders.module";
import { ApprovalHistoryModule } from "./approval-history/approval-history.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const databaseUrl = configService.get<string>("DATABASE_URL");
        const synchronize = configService.get("TYPEORM_SYNCHRONIZE") === "true";

        if (databaseUrl) {
          return {
            type: "postgres" as const,
            url: databaseUrl,
            autoLoadEntities: true,
            synchronize,
            logging: configService.get("NODE_ENV") === "development",
          };
        }
        // Fallback if !DATABASE_URL
        return {
          type: "sqlite" as const,
          database: "po.sqlite",
          autoLoadEntities: true,
          synchronize: true,
          logging: configService.get("NODE_ENV") === "development",
        };
      },
    }),
    UsersModule,
    PurchaseOrdersModule,
    ApprovalHistoryModule,
  ],
})
export class AppModule {}
