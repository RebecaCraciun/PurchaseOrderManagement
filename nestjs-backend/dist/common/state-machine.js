"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNextStatus = getNextStatus;
exports.getApproverRoleForStatus = getApproverRoleForStatus;
exports.canUserActOnPO = canUserActOnPO;
const types_1 = require("./types");
function getNextStatus(currentStatus, action, po) {
    if (action === types_1.ApprovalAction.REJECT) {
        return types_1.POStatus.NEEDS_REWORK;
    }
    if (action === types_1.ApprovalAction.SUBMIT || action === types_1.ApprovalAction.RESUBMIT) {
        if (po.amount < 100) {
            return po.category === types_1.POCategory.IT_EQUIPMENT
                ? types_1.POStatus.PENDING_IT
                : types_1.POStatus.PENDING_FINANCE;
        }
        return types_1.POStatus.PENDING_MANAGER;
    }
    if (action === types_1.ApprovalAction.APPROVE) {
        switch (currentStatus) {
            case types_1.POStatus.PENDING_MANAGER:
                return po.category === types_1.POCategory.IT_EQUIPMENT
                    ? types_1.POStatus.PENDING_IT
                    : types_1.POStatus.PENDING_FINANCE;
            case types_1.POStatus.PENDING_IT:
                return types_1.POStatus.PENDING_FINANCE;
            case types_1.POStatus.PENDING_FINANCE:
                return types_1.POStatus.INVOICED;
            default:
                return null;
        }
    }
    return null;
}
function getApproverRoleForStatus(status) {
    switch (status) {
        case types_1.POStatus.PENDING_MANAGER:
            return types_1.UserRole.MANAGER;
        case types_1.POStatus.PENDING_IT:
            return types_1.UserRole.IT;
        case types_1.POStatus.PENDING_FINANCE:
            return types_1.UserRole.FINANCE;
        default:
            return null;
    }
}
function canUserActOnPO(userRole, userId, po) {
    const approverRole = getApproverRoleForStatus(po.status);
    if (userRole === types_1.UserRole.CREATOR && userId === po.creator_id) {
        if (po.status === types_1.POStatus.DRAFT) {
            return { canAct: true, allowedActions: [types_1.ApprovalAction.SUBMIT] };
        }
        if (po.status === types_1.POStatus.NEEDS_REWORK) {
            return { canAct: true, allowedActions: [types_1.ApprovalAction.RESUBMIT] };
        }
    }
    if (approverRole === userRole) {
        return {
            canAct: true,
            allowedActions: [types_1.ApprovalAction.APPROVE, types_1.ApprovalAction.REJECT],
        };
    }
    return { canAct: false, allowedActions: [] };
}
//# sourceMappingURL=state-machine.js.map