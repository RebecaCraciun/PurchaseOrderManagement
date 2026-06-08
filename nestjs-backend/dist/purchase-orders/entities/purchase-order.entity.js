"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PurchaseOrder = void 0;
const typeorm_1 = require("typeorm");
const types_1 = require("../../common/types");
const user_entity_1 = require("../../users/entities/user.entity");
const approval_history_entity_1 = require("../../approval-history/entities/approval-history.entity");
let PurchaseOrder = class PurchaseOrder {
    id;
    poNumber;
    title;
    description;
    amount;
    category;
    status;
    creatorId;
    creator;
    currentApproverRole;
    rejectionReason;
    createdAt;
    updatedAt;
    approvalHistory;
};
exports.PurchaseOrder = PurchaseOrder;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], PurchaseOrder.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "po_number", type: "text", unique: true }),
    __metadata("design:type", String)
], PurchaseOrder.prototype, "poNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text" }),
    __metadata("design:type", String)
], PurchaseOrder.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", nullable: true }),
    __metadata("design:type", Object)
], PurchaseOrder.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "decimal", precision: 12, scale: 2 }),
    __metadata("design:type", Number)
], PurchaseOrder.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "enum",
        enum: types_1.POCategory,
    }),
    __metadata("design:type", String)
], PurchaseOrder.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "enum",
        enum: types_1.POStatus,
        default: types_1.POStatus.DRAFT,
    }),
    __metadata("design:type", String)
], PurchaseOrder.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "creator_id", type: "uuid" }),
    __metadata("design:type", String)
], PurchaseOrder.prototype, "creatorId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.purchaseOrders),
    (0, typeorm_1.JoinColumn)({ name: "creator_id" }),
    __metadata("design:type", user_entity_1.User)
], PurchaseOrder.prototype, "creator", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: "current_approver_role",
        type: "enum",
        enum: types_1.UserRole,
        nullable: true,
    }),
    __metadata("design:type", Object)
], PurchaseOrder.prototype, "currentApproverRole", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "rejection_reason", type: "text", nullable: true }),
    __metadata("design:type", Object)
], PurchaseOrder.prototype, "rejectionReason", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: "created_at" }),
    __metadata("design:type", Date)
], PurchaseOrder.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: "updated_at" }),
    __metadata("design:type", Date)
], PurchaseOrder.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => approval_history_entity_1.ApprovalHistory, (history) => history.purchaseOrder),
    __metadata("design:type", Array)
], PurchaseOrder.prototype, "approvalHistory", void 0);
exports.PurchaseOrder = PurchaseOrder = __decorate([
    (0, typeorm_1.Entity)("purchase_orders")
], PurchaseOrder);
//# sourceMappingURL=purchase-order.entity.js.map