import { POStatus, ApprovalAction } from "../../common/types";
import { User } from "../../users/entities/user.entity";
import { PurchaseOrder } from "../../purchase-orders/entities/purchase-order.entity";
export declare class ApprovalHistory {
    id: string | undefined;
    purchaseOrderId: string | undefined;
    purchaseOrder: PurchaseOrder | undefined;
    userId: string | undefined;
    user: User | undefined;
    action: ApprovalAction | undefined;
    fromStatus: POStatus | undefined;
    toStatus: POStatus | undefined;
    comment: string | null | undefined;
    createdAt: Date | undefined;
}
