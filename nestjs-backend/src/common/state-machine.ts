import { POStatus, POCategory, ApprovalAction, UserRole } from "./types";

export function getNextStatus(
  currentStatus: POStatus,
  action: ApprovalAction,
  po: { amount: number; category: POCategory },
): POStatus | null {
  if (action === ApprovalAction.REJECT) {
    return POStatus.NEEDS_REWORK;
  }

  if (action === ApprovalAction.SUBMIT || action === ApprovalAction.RESUBMIT) {
    // Skip manager for amounts < $100
    if (po.amount < 100) {
      return po.category === POCategory.IT_EQUIPMENT
        ? POStatus.PENDING_IT
        : POStatus.PENDING_FINANCE;
    }
    return POStatus.PENDING_MANAGER;
  }

  if (action === ApprovalAction.APPROVE) {
    switch (currentStatus) {
      case POStatus.PENDING_MANAGER:
        // IT review only for IT Equipment
        return po.category === POCategory.IT_EQUIPMENT
          ? POStatus.PENDING_IT
          : POStatus.PENDING_FINANCE;
      case POStatus.PENDING_IT:
        return POStatus.PENDING_FINANCE;
      case POStatus.PENDING_FINANCE:
        return POStatus.INVOICED;
      default:
        return null;
    }
  }

  return null;
}

// Determine which role can act on a given status
export function getApproverRoleForStatus(status: POStatus): UserRole | null {
  switch (status) {
    case POStatus.PENDING_MANAGER:
      return UserRole.MANAGER;
    case POStatus.PENDING_IT:
      return UserRole.IT;
    case POStatus.PENDING_FINANCE:
      return UserRole.FINANCE;
    default:
      return null;
  }
}

/// Validate if a user can perform an action on a PO
export function canUserActOnPO(
  userRole: UserRole,
  userId: string,
  po: { status: POStatus; creator_id: string },
): { canAct: boolean; allowedActions: ApprovalAction[] } {
  const approverRole = getApproverRoleForStatus(po.status);

  // Creator can submit/resubmit
  if (userRole === UserRole.CREATOR && userId === po.creator_id) {
    if (po.status === POStatus.DRAFT) {
      return { canAct: true, allowedActions: [ApprovalAction.SUBMIT] };
    }
    if (po.status === POStatus.NEEDS_REWORK) {
      return { canAct: true, allowedActions: [ApprovalAction.RESUBMIT] };
    }
  }

  // Approvers can approve/reject
  if (approverRole === userRole) {
    return {
      canAct: true,
      allowedActions: [ApprovalAction.APPROVE, ApprovalAction.REJECT],
    };
  }

  return { canAct: false, allowedActions: [] };
}
