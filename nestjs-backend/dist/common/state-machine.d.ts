import { POStatus, POCategory, ApprovalAction, UserRole } from "./types";
export declare function getNextStatus(currentStatus: POStatus, action: ApprovalAction, po: {
    amount: number;
    category: POCategory;
}): POStatus | null;
export declare function getApproverRoleForStatus(status: POStatus): UserRole | null;
export declare function canUserActOnPO(userRole: UserRole, userId: string, po: {
    status: POStatus;
    creator_id: string;
}): {
    canAct: boolean;
    allowedActions: ApprovalAction[];
};
