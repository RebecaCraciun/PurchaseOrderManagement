import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PurchaseOrdersService } from './purchase-orders.service';
import { PurchaseOrdersController } from './purchase-orders.controller';
import { PurchaseOrder } from './entities/purchase-order.entity';
import { UsersModule } from '../users/users.module';
import { ApprovalHistoryModule } from '../approval-history/approval-history.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PurchaseOrder]),
    UsersModule,
    ApprovalHistoryModule,
  ],
  controllers: [PurchaseOrdersController],
  providers: [PurchaseOrdersService],
  exports: [PurchaseOrdersService],
})
export class PurchaseOrdersModule {}
