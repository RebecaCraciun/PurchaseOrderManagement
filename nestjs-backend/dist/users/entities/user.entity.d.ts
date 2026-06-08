import { UserRole } from "../../common/types";
import { PurchaseOrder } from "../../purchase-orders/entities/purchase-order.entity";
import { ApprovalHistory } from "../../approval-history/entities/approval-history.entity";
export declare class User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    createdAt: Date;
    purchaseOrders: PurchaseOrder[];
    approvalHistory: ApprovalHistory[];
}
