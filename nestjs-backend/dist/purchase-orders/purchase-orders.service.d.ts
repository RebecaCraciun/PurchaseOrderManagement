import { Repository } from "typeorm";
import { PurchaseOrder } from "./entities/purchase-order.entity";
import { CreatePurchaseOrderDto } from "./dto/create-purchase-order.dto";
import { ApprovalActionDto } from "./dto/approval-action.dto";
import { UsersService } from "../users/users.service";
import { ApprovalHistoryService } from "../approval-history/approval-history.service";
import { POStatus, UserRole } from "../common/types";
export declare class PurchaseOrdersService {
    private readonly poRepository;
    private readonly usersService;
    private readonly approvalHistoryService;
    constructor(poRepository: Repository<PurchaseOrder>, usersService: UsersService, approvalHistoryService: ApprovalHistoryService);
    private generatePONumber;
    create(createDto: CreatePurchaseOrderDto): Promise<PurchaseOrder>;
    findAll(filters?: {
        status?: POStatus;
        creatorId?: string;
        currentApproverRole?: UserRole;
    }): Promise<PurchaseOrder[]>;
    findPendingForRole(role: UserRole): Promise<PurchaseOrder[]>;
    findOne(id: string): Promise<PurchaseOrder>;
    performAction(id: string, actionDto: ApprovalActionDto): Promise<PurchaseOrder>;
    markInvoiced(id: string, userId: string): Promise<PurchaseOrder>;
}
