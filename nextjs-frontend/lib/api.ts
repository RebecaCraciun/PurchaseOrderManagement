import type {
  ApprovalAction,
  ApprovalHistoryEntry,
  PurchaseOrder,
  User,
  UserRole,
  POCategory,
} from "./types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

type ApiUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
};

type ApiPurchaseOrder = {
  id: string;
  poNumber: string;
  title: string;
  description: string | null;
  amount: number | string;
  category: POCategory;
  status: PurchaseOrder["status"];
  creatorId: string;
  currentApproverRole: UserRole | null;
  rejectionReason: string | null;
  createdAt: string;
  updatedAt: string;
  creator?: ApiUser;
};

type ApiApprovalHistory = {
  id: string;
  purchaseOrderId: string;
  userId: string;
  action: ApprovalAction;
  fromStatus: PurchaseOrder["status"];
  toStatus: PurchaseOrder["status"];
  comment: string | null;
  createdAt: string;
  user?: ApiUser;
};

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${path}`;
  const res = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Request failed with status ${res.status}`);
  }

  if (res.status === 204) return null as unknown as T;
  return (await res.json()) as T;
}

function mapUser(u: ApiUser): User {
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    created_at: u.createdAt,
  };
}

function mapPurchaseOrder(p: ApiPurchaseOrder): PurchaseOrder {
  return {
    id: p.id,
    po_number: p.poNumber,
    title: p.title,
    description: p.description,
    amount: Number(p.amount),
    category: p.category,
    status: p.status,
    creator_id: p.creatorId,
    current_approver_role: p.currentApproverRole,
    rejection_reason: p.rejectionReason,
    created_at: p.createdAt,
    updated_at: p.updatedAt,
    creator: p.creator ? mapUser(p.creator) : undefined,
  };
}

function mapApprovalHistory(a: ApiApprovalHistory): ApprovalHistoryEntry {
  return {
    id: a.id,
    purchase_order_id: a.purchaseOrderId,
    user_id: a.userId,
    action: a.action,
    from_status: a.fromStatus,
    to_status: a.toStatus,
    comment: a.comment,
    created_at: a.createdAt,
    user: a.user ? mapUser(a.user) : undefined,
  };
}

export async function getUsers(role?: UserRole): Promise<User[]> {
  const q = role ? `?role=${encodeURIComponent(role)}` : "";
  const data = await request<ApiUser[]>(`/users${q}`);
  return data.map(mapUser);
}

export async function getPurchaseOrders(filters?: {
  status?: PurchaseOrder["status"];
  creatorId?: string;
  approverRole?: UserRole;
}): Promise<PurchaseOrder[]> {
  const params = new URLSearchParams();
  if (filters?.status) params.set("status", filters.status);
  if (filters?.creatorId) params.set("creatorId", filters.creatorId);
  if (filters?.approverRole) params.set("approverRole", filters.approverRole);
  const q = params.toString() ? `?${params.toString()}` : "";
  const data = await request<ApiPurchaseOrder[]>(`/purchase-orders${q}`);
  return data.map(mapPurchaseOrder);
}

export async function getPurchaseOrder(id: string): Promise<PurchaseOrder> {
  const data = await request<ApiPurchaseOrder>(`/purchase-orders/${id}`);
  return mapPurchaseOrder(data);
}

export async function createPurchaseOrder(payload: {
  title: string;
  description?: string;
  amount: number;
  category: POCategory;
  creatorId: string;
  submit?: boolean;
}): Promise<PurchaseOrder> {
  const data = await request<ApiPurchaseOrder>("/purchase-orders", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return mapPurchaseOrder(data);
}

export async function performPurchaseOrderAction(
  id: string,
  payload: { action: ApprovalAction; userId: string; comment?: string },
): Promise<PurchaseOrder> {
  const data = await request<ApiPurchaseOrder>(
    `/purchase-orders/${id}/action`,
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
  );
  return mapPurchaseOrder(data);
}

export async function markPurchaseOrderInvoiced(
  id: string,
  userId: string,
): Promise<PurchaseOrder> {
  const data = await request<ApiPurchaseOrder>(
    `/purchase-orders/${id}/invoice`,
    {
      method: "PATCH",
      body: JSON.stringify({ userId }),
    },
  );
  return mapPurchaseOrder(data);
}

export async function getApprovalHistory(
  purchaseOrderId: string,
): Promise<ApprovalHistoryEntry[]> {
  const data = await request<ApiApprovalHistory[]>(
    `/approval-history/purchase-order/${purchaseOrderId}`,
  );
  return data.map(mapApprovalHistory);
}
