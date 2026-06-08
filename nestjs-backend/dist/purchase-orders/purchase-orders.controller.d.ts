import { PurchaseOrdersService } from './purchase-orders.service';
import { CreatePurchaseOrderDto } from './dto/create-purchase-order.dto';
import { ApprovalActionDto } from './dto/approval-action.dto';
import { PurchaseOrder } from './entities/purchase-order.entity';
import { POStatus, UserRole } from '../common/types';
export declare class PurchaseOrdersController {
    private readonly poService;
    constructor(poService: PurchaseOrdersService);
    create(createDto: CreatePurchaseOrderDto): Promise<PurchaseOrder>;
    findAll(status?: POStatus, creatorId?: string, approverRole?: UserRole): Promise<PurchaseOrder[]>;
    findPendingForRole(role: UserRole): Promise<PurchaseOrder[]>;
    findOne(id: string): Promise<PurchaseOrder>;
    performAction(id: string, actionDto: ApprovalActionDto): Promise<PurchaseOrder>;
    markInvoiced(id: string, userId: string): Promise<PurchaseOrder>;
}
