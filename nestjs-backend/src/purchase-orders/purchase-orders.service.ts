import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { PurchaseOrder } from "./entities/purchase-order.entity";
import { CreatePurchaseOrderDto } from "./dto/create-purchase-order.dto";
import { ApprovalActionDto } from "./dto/approval-action.dto";
import { UsersService } from "../users/users.service";
import { ApprovalHistoryService } from "../approval-history/approval-history.service";
import { POStatus, ApprovalAction, UserRole } from "../common/types";
import {
  getNextStatus,
  getApproverRoleForStatus,
  canUserActOnPO,
} from "../common/state-machine";

@Injectable()
export class PurchaseOrdersService {
  constructor(
    @InjectRepository(PurchaseOrder)
    private readonly poRepository: Repository<PurchaseOrder>,
    private readonly usersService: UsersService,
    private readonly approvalHistoryService: ApprovalHistoryService,
  ) {}

  //Generate a unique PO number
  private generatePONumber(): string {
    return `${Date.now().toString(36).toUpperCase()}`;
  }

  /// Create a new purchase order
  async create(createDto: CreatePurchaseOrderDto): Promise<PurchaseOrder> {
    // Verify creator exists
    const creator = await this.usersService.findOne(createDto.creatorId);

    const poNumber = this.generatePONumber();
    let status = POStatus.DRAFT;
    let currentApproverRole: UserRole | null = null;

    // If submitting immediately
    if (createDto.submit) {
      const nextStatus = getNextStatus(POStatus.DRAFT, ApprovalAction.SUBMIT, {
        amount: createDto.amount,
        category: createDto.category,
      });
      if (nextStatus) {
        status = nextStatus;
        currentApproverRole = getApproverRoleForStatus(nextStatus);
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

    // Add to approval history if submitted
    if (createDto.submit && status !== POStatus.DRAFT) {
      await this.approvalHistoryService.create({
        purchaseOrderId: savedPO.id,
        userId: creator.id,
        action: ApprovalAction.SUBMIT,
        fromStatus: POStatus.DRAFT,
        toStatus: status,
        comment: null,
      });
    }

    return this.findOne(savedPO.id);
  }

  /// Get all purchase orders with optional filters
  async findAll(filters?: {
    status?: POStatus;
    creatorId?: string;
    currentApproverRole?: UserRole;
  }): Promise<PurchaseOrder[]> {
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

  // Get orders pending approval for a specific role
  async findPendingForRole(role: UserRole): Promise<PurchaseOrder[]> {
    return this.findAll({ currentApproverRole: role });
  }

  /// Get a single purchase order by ID
  async findOne(id: string): Promise<PurchaseOrder> {
    const po = await this.poRepository.findOne({
      where: { id },
      relations: ["creator"],
    });

    if (!po) {
      throw new NotFoundException(`Purchase order with ID ${id} not found`);
    }

    return po;
  }

  /// Perform an approval action on a purchase order
  async performAction(
    id: string,
    actionDto: ApprovalActionDto,
  ): Promise<PurchaseOrder> {
    const po = await this.findOne(id);
    const user = await this.usersService.findOne(actionDto.userId!);

    // Validate the user can perform this action
    const { canAct, allowedActions } = canUserActOnPO(user.role, user.id, {
      status: po.status,
      creator_id: po.creatorId,
    });

    if (!canAct || !allowedActions.includes(actionDto.action!)) {
      throw new ForbiddenException(
        `User with role ${user.role} cannot perform action ${actionDto.action} on this PO`,
      );
    }

    // Validate rejection has a comment
    if (
      actionDto.action === ApprovalAction.REJECT &&
      !actionDto.comment?.trim()
    ) {
      throw new BadRequestException("Rejection requires a comment");
    }

    // Calculate next status
    const nextStatus = getNextStatus(po.status, actionDto.action!, {
      amount: Number(po.amount),
      category: po.category,
    });

    if (!nextStatus) {
      throw new BadRequestException(
        `Invalid action ${actionDto.action} for status ${po.status}`,
      );
    }

    const fromStatus = po.status;

    // Update the PO
    po.status = nextStatus;
    po.currentApproverRole = getApproverRoleForStatus(nextStatus);

    if (actionDto.action === ApprovalAction.REJECT) {
      po.rejectionReason = actionDto.comment || null;
    } else if (
      actionDto.action === ApprovalAction.RESUBMIT ||
      actionDto.action === ApprovalAction.SUBMIT
    ) {
      po.rejectionReason = null;
    }

    await this.poRepository.save(po);

    // Record in approval history
    await this.approvalHistoryService.create({
      purchaseOrderId: po.id,
      userId: user.id,
      action: actionDto.action!,
      fromStatus,
      toStatus: nextStatus,
      comment: actionDto.comment || null,
    });

    return this.findOne(id);
  }

  /// Mark an approved PO as invoiced
  async markInvoiced(id: string, userId: string): Promise<PurchaseOrder> {
    const po = await this.findOne(id);
    const user = await this.usersService.findOne(userId);

    if (po.status !== POStatus.APPROVED) {
      throw new BadRequestException(
        "Only approved POs can be marked as invoiced",
      );
    }

    // Only finance can mark as invoiced
    if (user.role !== UserRole.FINANCE) {
      throw new ForbiddenException("Only Finance can mark POs as invoiced");
    }

    const fromStatus = po.status;
    po.status = POStatus.INVOICED;
    po.currentApproverRole = null;

    await this.poRepository.save(po);

    await this.approvalHistoryService.create({
      purchaseOrderId: po.id,
      userId: user.id,
      action: ApprovalAction.APPROVE,
      fromStatus,
      toStatus: POStatus.INVOICED,
      comment: "Marked as invoiced",
    });

    return this.findOne(id);
  }
}
