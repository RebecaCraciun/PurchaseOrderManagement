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
exports.ApprovalHistory = void 0;
const typeorm_1 = require("typeorm");
const types_1 = require("../../common/types");
const user_entity_1 = require("../../users/entities/user.entity");
const purchase_order_entity_1 = require("../../purchase-orders/entities/purchase-order.entity");
let ApprovalHistory = class ApprovalHistory {
    id;
    purchaseOrderId;
    purchaseOrder;
    userId;
    user;
    action;
    fromStatus;
    toStatus;
    comment;
    createdAt;
};
exports.ApprovalHistory = ApprovalHistory;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", Object)
], ApprovalHistory.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "purchase_order_id", type: "uuid" }),
    __metadata("design:type", Object)
], ApprovalHistory.prototype, "purchaseOrderId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => purchase_order_entity_1.PurchaseOrder, (po) => po.approvalHistory, {
        onDelete: "CASCADE",
    }),
    (0, typeorm_1.JoinColumn)({ name: "purchase_order_id" }),
    __metadata("design:type", Object)
], ApprovalHistory.prototype, "purchaseOrder", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "user_id", type: "uuid" }),
    __metadata("design:type", Object)
], ApprovalHistory.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.approvalHistory),
    (0, typeorm_1.JoinColumn)({ name: "user_id" }),
    __metadata("design:type", Object)
], ApprovalHistory.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "enum",
        enum: types_1.ApprovalAction,
    }),
    __metadata("design:type", Object)
], ApprovalHistory.prototype, "action", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: "from_status",
        type: "enum",
        enum: types_1.POStatus,
    }),
    __metadata("design:type", Object)
], ApprovalHistory.prototype, "fromStatus", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: "to_status",
        type: "enum",
        enum: types_1.POStatus,
    }),
    __metadata("design:type", Object)
], ApprovalHistory.prototype, "toStatus", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", nullable: true }),
    __metadata("design:type", Object)
], ApprovalHistory.prototype, "comment", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: "created_at" }),
    __metadata("design:type", Object)
], ApprovalHistory.prototype, "createdAt", void 0);
exports.ApprovalHistory = ApprovalHistory = __decorate([
    (0, typeorm_1.Entity)("approval_history")
], ApprovalHistory);
//# sourceMappingURL=approval-history.entity.js.map