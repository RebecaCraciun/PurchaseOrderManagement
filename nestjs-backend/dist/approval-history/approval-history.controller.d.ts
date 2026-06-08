import { ApprovalHistoryService } from './approval-history.service';
import { ApprovalHistory } from './entities/approval-history.entity';
export declare class ApprovalHistoryController {
    private readonly historyService;
    constructor(historyService: ApprovalHistoryService);
    findByPurchaseOrder(poId: string): Promise<ApprovalHistory[]>;
    findByUser(userId: string): Promise<ApprovalHistory[]>;
}
