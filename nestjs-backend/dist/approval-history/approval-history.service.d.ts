import { Repository } from "typeorm";
import { ApprovalHistory } from "./entities/approval-history.entity";
import { POStatus, ApprovalAction } from "../common/types";
interface CreateHistoryDto {
    purchaseOrderId: string;
    userId: string;
    action: ApprovalAction;
    fromStatus: POStatus;
    toStatus: POStatus;
    comment: string | null;
}
export declare class ApprovalHistoryService {
    private readonly historyRepository;
    constructor(historyRepository: Repository<ApprovalHistory>);
    create(dto: CreateHistoryDto): Promise<ApprovalHistory>;
    findByPurchaseOrderId(purchaseOrderId: string): Promise<ApprovalHistory[]>;
    findByUserId(userId: string): Promise<ApprovalHistory[]>;
}
export {};
