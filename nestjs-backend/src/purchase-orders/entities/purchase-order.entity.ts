import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from "typeorm";
import { POStatus, POCategory, UserRole } from "../../common/types";
import { User } from "../../users/entities/user.entity";
import { ApprovalHistory } from "../../approval-history/entities/approval-history.entity";

@Entity("purchase_orders")
export class PurchaseOrder {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "po_number", type: "text", unique: true })
  poNumber!: string;

  @Column({ type: "text" })
  title!: string;

  @Column({ type: "text", nullable: true })
  description!: string | null;

  @Column({ type: "decimal", precision: 12, scale: 2 })
  amount!: number;

  @Column({
    type: "enum",
    enum: POCategory,
  })
  category!: POCategory;

  @Column({
    type: "enum",
    enum: POStatus,
    default: POStatus.DRAFT,
  })
  status!: POStatus;

  @Column({ name: "creator_id", type: "uuid" })
  creatorId!: string;

  @ManyToOne(() => User, (user) => user.purchaseOrders)
  @JoinColumn({ name: "creator_id" })
  creator!: User;

  @Column({
    name: "current_approver_role",
    type: "enum",
    enum: UserRole,
    nullable: true,
  })
  currentApproverRole!: UserRole | null;

  @Column({ name: "rejection_reason", type: "text", nullable: true })
  rejectionReason!: string | null;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;

  @OneToMany(() => ApprovalHistory, (history) => history.purchaseOrder)
  approvalHistory!: ApprovalHistory[];
}
