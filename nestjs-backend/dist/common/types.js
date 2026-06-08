"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApprovalAction = exports.POCategory = exports.POStatus = exports.UserRole = void 0;
var UserRole;
(function (UserRole) {
    UserRole["CREATOR"] = "creator";
    UserRole["MANAGER"] = "manager";
    UserRole["IT"] = "it";
    UserRole["FINANCE"] = "finance";
})(UserRole || (exports.UserRole = UserRole = {}));
var POStatus;
(function (POStatus) {
    POStatus["DRAFT"] = "draft";
    POStatus["PENDING_MANAGER"] = "pending_manager";
    POStatus["PENDING_IT"] = "pending_it";
    POStatus["PENDING_FINANCE"] = "pending_finance";
    POStatus["NEEDS_REWORK"] = "needs_rework";
    POStatus["APPROVED"] = "approved";
    POStatus["INVOICED"] = "invoiced";
})(POStatus || (exports.POStatus = POStatus = {}));
var POCategory;
(function (POCategory) {
    POCategory["SERVICES"] = "services";
    POCategory["OFFICE_SUPPLIES"] = "office_supplies";
    POCategory["IT_EQUIPMENT"] = "it_equipment";
})(POCategory || (exports.POCategory = POCategory = {}));
var ApprovalAction;
(function (ApprovalAction) {
    ApprovalAction["APPROVE"] = "approve";
    ApprovalAction["REJECT"] = "reject";
    ApprovalAction["SUBMIT"] = "submit";
    ApprovalAction["RESUBMIT"] = "resubmit";
})(ApprovalAction || (exports.ApprovalAction = ApprovalAction = {}));
//# sourceMappingURL=types.js.map