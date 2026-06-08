import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { POStatus, ApprovalAction } from "../../common/types";
import { User } from "../../users/entities/user.entity";
import { PurchaseOrder } from "../../purchase-orders/entities/purchase-order.entity";

@Entity("approval_history")
export class ApprovalHistory {
  @PrimaryGeneratedColumn("uuid")
  id: string | undefined;

  @Column({ name: "purchase_order_id", type: "uuid" })
  purchaseOrderId: string | undefined;

  @ManyToOne(() => PurchaseOrder, (po) => po.approvalHistory, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "purchase_order_id" })
  purchaseOrder: PurchaseOrder | undefined;

  @Column({ name: "user_id", type: "uuid" })
  userId: string | undefined;

  @ManyToOne(() => User, (user) => user.approvalHistory)
  @JoinColumn({ name: "user_id" })
  user: User | undefined;

  @Column({
    type: "enum",
    enum: ApprovalAction,
  })
  action: ApprovalAction | undefined;

  @Column({
    name: "from_status",
    type: "enum",
    enum: POStatus,
  })
  fromStatus: POStatus | undefined;

  @Column({
    name: "to_status",
    type: "enum",
    enum: POStatus,
  })
  toStatus: POStatus | undefined;

  @Column({ type: "text", nullable: true })
  comment: string | null | undefined;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date | undefined;
}
