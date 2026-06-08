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
exports.ApprovalHistoryController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const approval_history_service_1 = require("./approval-history.service");
let ApprovalHistoryController = class ApprovalHistoryController {
    historyService;
    constructor(historyService) {
        this.historyService = historyService;
    }
    findByPurchaseOrder(poId) {
        return this.historyService.findByPurchaseOrderId(poId);
    }
    findByUser(userId) {
        return this.historyService.findByUserId(userId);
    }
};
exports.ApprovalHistoryController = ApprovalHistoryController;
__decorate([
    (0, common_1.Get)('purchase-order/:poId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get approval history for a purchase order' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of approval history entries' }),
    __param(0, (0, common_1.Param)('poId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ApprovalHistoryController.prototype, "findByPurchaseOrder", null);
__decorate([
    (0, common_1.Get)('user/:userId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get approval history for a user' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of approval history entries' }),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ApprovalHistoryController.prototype, "findByUser", null);
exports.ApprovalHistoryController = ApprovalHistoryController = __decorate([
    (0, swagger_1.ApiTags)('approval-history'),
    (0, common_1.Controller)('approval-history'),
    __metadata("design:paramtypes", [approval_history_service_1.ApprovalHistoryService])
], ApprovalHistoryController);
//# sourceMappingURL=approval-history.controller.js.map