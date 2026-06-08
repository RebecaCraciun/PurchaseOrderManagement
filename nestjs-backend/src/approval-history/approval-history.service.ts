import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ApprovalHistory } from "./entities/approval-history.entity";
import { POStatus, ApprovalAction } from "../common/types";

interface CreateHistoryDto {
  purchaseOrderId: string;
  userId: string;
  action: ApprovalAction;
  fromStatus: POStatus;
  toStatus: POStatus;
  comment: string | null;
}

@Injectable()
export class ApprovalHistoryService {
  constructor(
    @InjectRepository(ApprovalHistory)
    private readonly historyRepository: Repository<ApprovalHistory>,
  ) {}

  /// Create a new approval
  async create(dto: CreateHistoryDto): Promise<ApprovalHistory> {
    const entry = this.historyRepository.create({
      purchaseOrderId: dto.purchaseOrderId,
      userId: dto.userId,
      action: dto.action,
      fromStatus: dto.fromStatus,
      toStatus: dto.toStatus,
      comment: dto.comment,
    });

    return this.historyRepository.save(entry);
  }

  /// Get all history for a purchase order
  async findByPurchaseOrderId(
    purchaseOrderId: string,
  ): Promise<ApprovalHistory[]> {
    return this.historyRepository.find({
      where: { purchaseOrderId },
      relations: ["user"],
      order: { createdAt: "ASC" },
    });
  }

  /// Get all history for a user
  async findByUserId(userId: string): Promise<ApprovalHistory[]> {
    return this.historyRepository.find({
      where: { userId },
      relations: ["purchaseOrder"],
      order: { createdAt: "DESC" },
    });
  }
}
