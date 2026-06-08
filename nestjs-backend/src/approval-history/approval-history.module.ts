import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApprovalHistoryService } from './approval-history.service';
import { ApprovalHistoryController } from './approval-history.controller';
import { ApprovalHistory } from './entities/approval-history.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ApprovalHistory])],
  controllers: [ApprovalHistoryController],
  providers: [ApprovalHistoryService],
  exports: [ApprovalHistoryService],
})
export class ApprovalHistoryModule {}
