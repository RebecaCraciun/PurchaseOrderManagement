import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ApprovalHistoryService } from './approval-history.service';
import { ApprovalHistory } from './entities/approval-history.entity';

@ApiTags('approval-history')
@Controller('approval-history')
export class ApprovalHistoryController {
  constructor(private readonly historyService: ApprovalHistoryService) {}

  @Get('purchase-order/:poId')
  @ApiOperation({ summary: 'Get approval history for a purchase order' })
  @ApiResponse({ status: 200, description: 'List of approval history entries' })
  findByPurchaseOrder(@Param('poId') poId: string): Promise<ApprovalHistory[]> {
    return this.historyService.findByPurchaseOrderId(poId);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get approval history for a user' })
  @ApiResponse({ status: 200, description: 'List of approval history entries' })
  findByUser(@Param('userId') userId: string): Promise<ApprovalHistory[]> {
    return this.historyService.findByUserId(userId);
  }
}
