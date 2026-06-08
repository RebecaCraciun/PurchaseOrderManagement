export type UserRole = "creator" | "manager" | "it" | "finance";

export type POStatus =
  | "draft"
  | "pending_manager"
  | "pending_it"
  | "pending_finance"
  | "needs_rework"
  | "approved"
  | "invoiced";

export type POCategory = "services" | "office_supplies" | "it_equipment";

export type ApprovalAction = "approve" | "reject" | "submit" | "resubmit";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  created_at: string;
}

export interface PurchaseOrder {
  id: string;
  po_number: string;
  title: string;
  description: string | null;
  amount: number;
  category: POCategory;
  status: POStatus;
  creator_id: string;
  current_approver_role: UserRole | null;
  rejection_reason: string | null;
  created_at: string;
  updated_at: string;
  // Joined data
  creator?: User;
}

export interface ApprovalHistoryEntry {
  id: string;
  purchase_order_id: string;
  user_id: string;
  action: ApprovalAction;
  from_status: POStatus;
  to_status: POStatus;
  comment: string | null;
  created_at: string;
  // Joined data
  user?: User;
}

// Status display configuration
export const STATUS_CONFIG: Record<POStatus, { label: string; color: string }> =
  {
    draft: { label: "Draft", color: "bg-muted text-muted-foreground" },
    pending_manager: {
      label: "Pending Manager",
      color: "bg-amber-100 text-amber-800",
    },
    pending_it: { label: "Pending IT", color: "bg-blue-100 text-blue-800" },
    pending_finance: {
      label: "Pending Finance",
      color: "bg-purple-100 text-purple-800",
    },
    needs_rework: { label: "Needs rework", color: "bg-red-100 text-red-800" },
    approved: { label: "Approved", color: "bg-green-100 text-green-800" },
    invoiced: { label: "Invoiced", color: "bg-emerald-100 text-emerald-800" },
  };

export const CATEGORY_CONFIG: Record<POCategory, { label: string }> = {
  services: { label: "Services" },
  office_supplies: { label: "Office supplies" },
  it_equipment: { label: "IT equipment" },
};

export const ROLE_CONFIG: Record<UserRole, { label: string; color: string }> = {
  creator: { label: "Creator", color: "bg-slate-100 text-slate-800" },
  manager: { label: "Manager", color: "bg-amber-100 text-amber-800" },
  it: { label: "IT", color: "bg-blue-100 text-blue-800" },
  finance: { label: "Finance", color: "bg-purple-100 text-purple-800" },
};

export function getNextStatus(
  currentStatus: POStatus,
  action: ApprovalAction,
  po: { amount: number; category: POCategory },
): POStatus | null {
  if (action === "reject") {
    return "needs_rework";
  }

  if (action === "submit" || action === "resubmit") {
    // Auto-skip manager for amounts < $100
    if (po.amount < 100) {
      return po.category === "it_equipment" ? "pending_it" : "pending_finance";
    }
    return "pending_manager";
  }

  if (action === "approve") {
    switch (currentStatus) {
      case "pending_manager":
        // IT review only for IT Equipment
        return po.category === "it_equipment"
          ? "pending_it"
          : "pending_finance";
      case "pending_it":
        return "pending_finance";
      case "pending_finance":
        return "invoiced";
      default:
        return null;
    }
  }

  return null;
}

// Determine which role can act on a given status
export function getApproverRoleForStatus(status: POStatus): UserRole | null {
  switch (status) {
    case "pending_manager":
      return "manager";
    case "pending_it":
      return "it";
    case "pending_finance":
      return "finance";
    default:
      return null;
  }
}
