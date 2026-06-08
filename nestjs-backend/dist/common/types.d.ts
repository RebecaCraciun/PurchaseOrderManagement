export declare enum UserRole {
    CREATOR = "creator",
    MANAGER = "manager",
    IT = "it",
    FINANCE = "finance"
}
export declare enum POStatus {
    DRAFT = "draft",
    PENDING_MANAGER = "pending_manager",
    PENDING_IT = "pending_it",
    PENDING_FINANCE = "pending_finance",
    NEEDS_REWORK = "needs_rework",
    APPROVED = "approved",
    INVOICED = "invoiced"
}
export declare enum POCategory {
    SERVICES = "services",
    OFFICE_SUPPLIES = "office_supplies",
    IT_EQUIPMENT = "it_equipment"
}
export declare enum ApprovalAction {
    APPROVE = "approve",
    REJECT = "reject",
    SUBMIT = "submit",
    RESUBMIT = "resubmit"
}
