import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Patch,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { PurchaseOrdersService } from './purchase-orders.service';
import { CreatePurchaseOrderDto } from './dto/create-purchase-order.dto';
import { ApprovalActionDto } from './dto/approval-action.dto';
import { PurchaseOrder } from './entities/purchase-order.entity';
import { POStatus, UserRole } from '../common/types';

@ApiTags('purchase-orders')
@Controller('purchase-orders')
export class PurchaseOrdersController {
  constructor(private readonly poService: PurchaseOrdersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new purchase order' })
  @ApiResponse({ status: 201, description: 'Purchase order created' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  create(@Body() createDto: CreatePurchaseOrderDto): Promise<PurchaseOrder> {
    return this.poService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all purchase orders' })
  @ApiResponse({ status: 200, description: 'List of purchase orders' })
  @ApiQuery({ name: 'status', enum: POStatus, required: false })
  @ApiQuery({ name: 'creatorId', required: false })
  @ApiQuery({ name: 'approverRole', enum: UserRole, required: false })
  findAll(
    @Query('status') status?: POStatus,
    @Query('creatorId') creatorId?: string,
    @Query('approverRole') approverRole?: UserRole,
  ): Promise<PurchaseOrder[]> {
    return this.poService.findAll({
      status,
      creatorId,
      currentApproverRole: approverRole,
    });
  }

  @Get('pending/:role')
  @ApiOperation({ summary: 'Get purchase orders pending approval for a role' })
  @ApiResponse({ status: 200, description: 'List of pending purchase orders' })
  @ApiParam({ name: 'role', enum: UserRole })
  findPendingForRole(@Param('role') role: UserRole): Promise<PurchaseOrder[]> {
    return this.poService.findPendingForRole(role);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a purchase order by ID' })
  @ApiResponse({ status: 200, description: 'Purchase order found' })
  @ApiResponse({ status: 404, description: 'Purchase order not found' })
  findOne(@Param('id') id: string): Promise<PurchaseOrder> {
    return this.poService.findOne(id);
  }

  @Post(':id/action')
  @ApiOperation({ summary: 'Perform an approval action on a purchase order' })
  @ApiResponse({ status: 200, description: 'Action performed successfully' })
  @ApiResponse({ status: 400, description: 'Invalid action' })
  @ApiResponse({ status: 403, description: 'User cannot perform this action' })
  @ApiResponse({ status: 404, description: 'Purchase order not found' })
  performAction(
    @Param('id') id: string,
    @Body() actionDto: ApprovalActionDto,
  ): Promise<PurchaseOrder> {
    return this.poService.performAction(id, actionDto);
  }

  @Patch(':id/invoice')
  @ApiOperation({ summary: 'Mark an approved purchase order as invoiced' })
  @ApiResponse({ status: 200, description: 'Marked as invoiced' })
  @ApiResponse({ status: 400, description: 'PO is not in approved status' })
  @ApiResponse({ status: 403, description: 'Only Finance can invoice' })
  markInvoiced(
    @Param('id') id: string,
    @Body('userId') userId: string,
  ): Promise<PurchaseOrder> {
    return this.poService.markInvoiced(id, userId);
  }
}
