import { POStatus, POCategory, UserRole } from "../../common/types";
import { User } from "../../users/entities/user.entity";
import { ApprovalHistory } from "../../approval-history/entities/approval-history.entity";
export declare class PurchaseOrder {
    id: string;
    poNumber: string;
    title: string;
    description: string | null;
    amount: number;
    category: POCategory;
    status: POStatus;
    creatorId: string;
    creator: User;
    currentApproverRole: UserRole | null;
    rejectionReason: string | null;
    createdAt: Date;
    updatedAt: Date;
    approvalHistory: ApprovalHistory[];
}
