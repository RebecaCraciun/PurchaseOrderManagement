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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PurchaseOrdersController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const purchase_orders_service_1 = require("./purchase-orders.service");
const create_purchase_order_dto_1 = require("./dto/create-purchase-order.dto");
const approval_action_dto_1 = require("./dto/approval-action.dto");
const types_1 = require("../common/types");
let PurchaseOrdersController = class PurchaseOrdersController {
    poService;
    constructor(poService) {
        this.poService = poService;
    }
    create(createDto) {
        return this.poService.create(createDto);
    }
    findAll(status, creatorId, approverRole) {
        return this.poService.findAll({
            status,
            creatorId,
            currentApproverRole: approverRole,
        });
    }
    findPendingForRole(role) {
        return this.poService.findPendingForRole(role);
    }
    findOne(id) {
        return this.poService.findOne(id);
    }
    performAction(id, actionDto) {
        return this.poService.performAction(id, actionDto);
    }
    markInvoiced(id, userId) {
        return this.poService.markInvoiced(id, userId);
    }
};
exports.PurchaseOrdersController = PurchaseOrdersController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new purchase order' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Purchase order created' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid input' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_purchase_order_dto_1.CreatePurchaseOrderDto]),
    __metadata("design:returntype", Promise)
], PurchaseOrdersController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all purchase orders' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of purchase orders' }),
    (0, swagger_1.ApiQuery)({ name: 'status', enum: types_1.POStatus, required: false }),
    (0, swagger_1.ApiQuery)({ name: 'creatorId', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'approverRole', enum: types_1.UserRole, required: false }),
    __param(0, (0, common_1.Query)('status')),
    __param(1, (0, common_1.Query)('creatorId')),
    __param(2, (0, common_1.Query)('approverRole')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], PurchaseOrdersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('pending/:role'),
    (0, swagger_1.ApiOperation)({ summary: 'Get purchase orders pending approval for a role' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of pending purchase orders' }),
    (0, swagger_1.ApiParam)({ name: 'role', enum: types_1.UserRole }),
    __param(0, (0, common_1.Param)('role')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PurchaseOrdersController.prototype, "findPendingForRole", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a purchase order by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Purchase order found' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Purchase order not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PurchaseOrdersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(':id/action'),
    (0, swagger_1.ApiOperation)({ summary: 'Perform an approval action on a purchase order' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Action performed successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid action' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'User cannot perform this action' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Purchase order not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, approval_action_dto_1.ApprovalActionDto]),
    __metadata("design:returntype", Promise)
], PurchaseOrdersController.prototype, "performAction", null);
__decorate([
    (0, common_1.Patch)(':id/invoice'),
    (0, swagger_1.ApiOperation)({ summary: 'Mark an approved purchase order as invoiced' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Marked as invoiced' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'PO is not in approved status' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Only Finance can invoice' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], PurchaseOrdersController.prototype, "markInvoiced", null);
exports.PurchaseOrdersController = PurchaseOrdersController = __decorate([
    (0, swagger_1.ApiTags)('purchase-orders'),
    (0, common_1.Controller)('purchase-orders'),
    __metadata("design:paramtypes", [purchase_orders_service_1.PurchaseOrdersService])
], PurchaseOrdersController);
//# sourceMappingURL=purchase-orders.controller.js.map