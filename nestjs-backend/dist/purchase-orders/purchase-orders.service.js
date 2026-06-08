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
exports.PurchaseOrdersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const purchase_order_entity_1 = require("./entities/purchase-order.entity");
const users_service_1 = require("../users/users.service");
const approval_history_service_1 = require("../approval-history/approval-history.service");
const types_1 = require("../common/types");
const state_machine_1 = require("../common/state-machine");
let PurchaseOrdersService = class PurchaseOrdersService {
    poRepository;
    usersService;
    approvalHistoryService;
    constructor(poRepository, usersService, approvalHistoryService) {
        this.poRepository = poRepository;
        this.usersService = usersService;
        this.approvalHistoryService = approvalHistoryService;
    }
    generatePONumber() {
        return `${Date.now().toString(36).toUpperCase()}`;
    }
    async create(createDto) {
        const creator = await this.usersService.findOne(createDto.creatorId);
        const poNumber = this.generatePONumber();
        let status = types_1.POStatus.DRAFT;
        let currentApproverRole = null;
        if (createDto.submit) {
            const nextStatus = (0, state_machine_1.getNextStatus)(types_1.POStatus.DRAFT, types_1.ApprovalAction.SUBMIT, {
                amount: createDto.amount,
                category: createDto.category,
            });
            if (nextStatus) {
                status = nextStatus;
                currentApproverRole = (0, state_machine_1.getApproverRoleForStatus)(nextStatus);
            }
        }
        const po = this.poRepository.create({
            poNumber,
            title: createDto.title,
            description: createDto.description || null,
            amount: createDto.amount,
            category: createDto.category,
            status,
            creatorId: createDto.creatorId,
            currentApproverRole,
        });
        const savedPO = await this.poRepository.save(po);
        if (createDto.submit && status !== types_1.POStatus.DRAFT) {
            await this.approvalHistoryService.create({
                purchaseOrderId: savedPO.id,
                userId: creator.id,
                action: types_1.ApprovalAction.SUBMIT,
                fromStatus: types_1.POStatus.DRAFT,
                toStatus: status,
                comment: null,
            });
        }
        return this.findOne(savedPO.id);
    }
    async findAll(filters) {
        const queryBuilder = this.poRepository
            .createQueryBuilder("po")
            .leftJoinAndSelect("po.creator", "creator")
            .orderBy("po.updatedAt", "DESC");
        if (filters?.status) {
            queryBuilder.andWhere("po.status = :status", { status: filters.status });
        }
        if (filters?.creatorId) {
            queryBuilder.andWhere("po.creatorId = :creatorId", {
                creatorId: filters.creatorId,
            });
        }
        if (filters?.currentApproverRole) {
            queryBuilder.andWhere("po.currentApproverRole = :role", {
                role: filters.currentApproverRole,
            });
        }
        return queryBuilder.getMany();
    }
    async findPendingForRole(role) {
        return this.findAll({ currentApproverRole: role });
    }
    async findOne(id) {
        const po = await this.poRepository.findOne({
            where: { id },
            relations: ["creator"],
        });
        if (!po) {
            throw new common_1.NotFoundException(`Purchase order with ID ${id} not found`);
        }
        return po;
    }
    async performAction(id, actionDto) {
        const po = await this.findOne(id);
        const user = await this.usersService.findOne(actionDto.userId);
        const { canAct, allowedActions } = (0, state_machine_1.canUserActOnPO)(user.role, user.id, {
            status: po.status,
            creator_id: po.creatorId,
        });
        if (!canAct || !allowedActions.includes(actionDto.action)) {
            throw new common_1.ForbiddenException(`User with role ${user.role} cannot perform action ${actionDto.action} on this PO`);
        }
        if (actionDto.action === types_1.ApprovalAction.REJECT &&
            !actionDto.comment?.trim()) {
            throw new common_1.BadRequestException("Rejection requires a comment");
        }
        const nextStatus = (0, state_machine_1.getNextStatus)(po.status, actionDto.action, {
            amount: Number(po.amount),
            category: po.category,
        });
        if (!nextStatus) {
            throw new common_1.BadRequestException(`Invalid action ${actionDto.action} for status ${po.status}`);
        }
        const fromStatus = po.status;
        po.status = nextStatus;
        po.currentApproverRole = (0, state_machine_1.getApproverRoleForStatus)(nextStatus);
        if (actionDto.action === types_1.ApprovalAction.REJECT) {
            po.rejectionReason = actionDto.comment || null;
        }
        else if (actionDto.action === types_1.ApprovalAction.RESUBMIT ||
            actionDto.action === types_1.ApprovalAction.SUBMIT) {
            po.rejectionReason = null;
        }
        await this.poRepository.save(po);
        await this.approvalHistoryService.create({
            purchaseOrderId: po.id,
            userId: user.id,
            action: actionDto.action,
            fromStatus,
            toStatus: nextStatus,
            comment: actionDto.comment || null,
        });
        return this.findOne(id);
    }
    async markInvoiced(id, userId) {
        const po = await this.findOne(id);
        const user = await this.usersService.findOne(userId);
        if (po.status !== types_1.POStatus.APPROVED) {
            throw new common_1.BadRequestException("Only approved POs can be marked as invoiced");
        }
        if (user.role !== types_1.UserRole.FINANCE) {
            throw new common_1.ForbiddenException("Only Finance can mark POs as invoiced");
        }
        const fromStatus = po.status;
        po.status = types_1.POStatus.INVOICED;
        po.currentApproverRole = null;
        await this.poRepository.save(po);
        await this.approvalHistoryService.create({
            purchaseOrderId: po.id,
            userId: user.id,
            action: types_1.ApprovalAction.APPROVE,
            fromStatus,
            toStatus: types_1.POStatus.INVOICED,
            comment: "Marked as invoiced",
        });
        return this.findOne(id);
    }
};
exports.PurchaseOrdersService = PurchaseOrdersService;
exports.PurchaseOrdersService = PurchaseOrdersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(purchase_order_entity_1.PurchaseOrder)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        users_service_1.UsersService,
        approval_history_service_1.ApprovalHistoryService])
], PurchaseOrdersService);
//# sourceMappingURL=purchase-orders.service.js.map