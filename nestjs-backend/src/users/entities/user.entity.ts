import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from "typeorm";
import { UserRole } from "../../common/types";
import { PurchaseOrder } from "../../purchase-orders/entities/purchase-order.entity";
import { ApprovalHistory } from "../../approval-history/entities/approval-history.entity";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "text" })
  name!: string;

  @Column({ type: "text", unique: true })
  email!: string;

  @Column({
    type: "enum",
    enum: UserRole,
  })
  role!: UserRole;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @OneToMany(() => PurchaseOrder, (po) => po.creator)
  purchaseOrders!: PurchaseOrder[];

  @OneToMany(() => ApprovalHistory, (history) => history.user)
  approvalHistory!: ApprovalHistory[];
}
