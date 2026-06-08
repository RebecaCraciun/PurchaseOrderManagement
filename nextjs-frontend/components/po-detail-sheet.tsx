"use client";

import { useState, useEffect } from "react";
import {
  getPurchaseOrder,
  getApprovalHistory,
  markPurchaseOrderInvoiced,
  performPurchaseOrderAction,
} from "@/lib/api";
import { useRole } from "@/components/role-provider";
import {
  PurchaseOrder,
  ApprovalHistoryEntry,
  STATUS_CONFIG,
  CATEGORY_CONFIG,
  ROLE_CONFIG,
  getNextStatus,
  getApproverRoleForStatus,
} from "@/lib/types";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { formatDistanceToNow, format } from "date-fns";
import {
  CheckCircle2,
  XCircle,
  Clock,
  Send,
  AlertCircle,
  User,
  ArrowRight,
} from "lucide-react";

interface PODetailSheetProps {
  po: PurchaseOrder | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: () => void;
}

export function PODetailSheet({
  po,
  open,
  onOpenChange,
  onUpdate,
}: PODetailSheetProps) {
  const { currentUser } = useRole();
  const [currentPO, setCurrentPO] = useState<PurchaseOrder | null>(null);
  const [history, setHistory] = useState<ApprovalHistoryEntry[]>([]);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (po && open) {
      setCurrentPO(po);
      loadHistory();
      loadPO();
    }
  }, [po, open]);

  const loadPO = async () => {
    if (!po) return;
    try {
      const data = await getPurchaseOrder(po.id);
      setCurrentPO(data);
    } catch (err) {
      console.error("Error loading PO:", err);
    }
  };

  const loadHistory = async () => {
    if (!po) return;
    try {
      const data = await getApprovalHistory(po.id);
      setHistory(data || []);
    } catch (err) {
      console.error("Error loading history:", err);
    }
  };

  if (!currentPO) return null;

  const canApprove =
    currentUser &&
    getApproverRoleForStatus(currentPO.status) === currentUser.role;

  const canSubmit =
    currentUser &&
    currentUser.role === "creator" &&
    currentUser.id === currentPO.creator_id &&
    (currentPO.status === "draft" || currentPO.status === "needs_rework");

  const canInvoice =
    currentUser &&
    currentUser.role === "finance" &&
    currentPO.status === "approved";

  const handleAction = async (
    action: "approve" | "reject" | "submit" | "resubmit",
  ) => {
    if (!currentUser || !currentPO) return;

    if (action === "reject" && !comment.trim()) {
      toast.error("Please provide a reason for rejection");
      return;
    }

    setIsSubmitting(true);
    try {
      const nextStatus = getNextStatus(currentPO.status, action, {
        amount: currentPO.amount,
        category: currentPO.category,
      });

      if (!nextStatus) {
        toast.error("Invalid action for current status");
        setIsSubmitting(false);
        return;
      }

      await performPurchaseOrderAction(currentPO.id, {
        action: action as any,
        userId: currentUser.id,
        comment: comment.trim() || undefined,
      });
    } catch (err) {
      console.error("Error updating PO:", err);
      toast.error("Failed to update purchase order");
    } finally {
      setIsSubmitting(false);
    }

    const actionLabels = {
      approve: "approved",
      reject: "rejected",
      submit: "submitted",
      resubmit: "resubmitted",
    };

    toast.success(`Purchase order ${actionLabels[action]}`);
    setComment("");
    setIsSubmitting(false);
    onUpdate();
    loadPO();
    loadHistory();
  };

  const handleInvoice = async () => {
    if (!currentUser || !currentPO) return;

    setIsSubmitting(true);
    try {
      await markPurchaseOrderInvoiced(currentPO.id, currentUser.id);
      toast.success("Purchase order invoiced");
      onUpdate();
      await loadPO();
      await loadHistory();
    } catch (err) {
      console.error("Error invoicing PO:", err);
      toast.error("Failed to invoice purchase order");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case "approve":
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case "reject":
        return <XCircle className="h-4 w-4 text-red-600" />;
      case "submit":
      case "resubmit":
        return <Send className="h-4 w-4 text-blue-600" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full border-2 px-4 sm:px-6 overflow-y-auto sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <span className="font-mono">
              {currentPO.po_number.replace(/^PO-?/i, "")}
            </span>
            <Badge className={STATUS_CONFIG[currentPO.status].color}>
              {STATUS_CONFIG[currentPO.status].label}
            </Badge>
          </SheetTitle>
          <SheetDescription>{currentPO.title}</SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Details */}
          <div className="rounded-lg border bg-card p-4">
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Amount</p>
                  <p className="text-lg font-semibold">
                    $
                    {currentPO.amount.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Category</p>
                  <Badge variant="outline" className="mt-1">
                    {CATEGORY_CONFIG[currentPO.category].label}
                  </Badge>
                </div>
              </div>

              {currentPO.description && (
                <div>
                  <p className="text-sm text-muted-foreground">Description</p>
                  <p className="mt-1 text-sm">{currentPO.description}</p>
                </div>
              )}

              <div>
                <p className="text-sm text-muted-foreground">Created</p>
                <p className="mt-1 text-sm">
                  {format(new Date(currentPO.created_at), "PPp")}
                </p>
              </div>
            </div>
          </div>

          {/* Rejection reason */}
          {currentPO.rejection_reason &&
            currentPO.status === "needs_rework" && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                <div className="flex items-center gap-2 text-red-800">
                  <AlertCircle className="h-4 w-4" />
                  <span className="font-medium">Rejection Reason</span>
                </div>
                <p className="mt-2 text-sm text-red-700">
                  {currentPO.rejection_reason}
                </p>
              </div>
            )}

          <Separator />

          {/* Actions */}
          {(canApprove || canSubmit || canInvoice) && (
            <div className="space-y-4">
              <Label htmlFor="comment">Comment (optional for approval)</Label>
              <Textarea
                id="comment"
                placeholder="Add a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />

              <div className="flex gap-2">
                {canApprove && (
                  <>
                    <Button
                      onClick={() => handleAction("approve")}
                      disabled={isSubmitting}
                      className="flex-1"
                    >
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Approve
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleAction("reject")}
                      disabled={isSubmitting}
                      className="flex-1"
                    >
                      <XCircle className="mr-2 h-4 w-4" />
                      Reject
                    </Button>
                  </>
                )}

                {canSubmit && (
                  <Button
                    onClick={() =>
                      handleAction(
                        currentPO.status === "draft" ? "submit" : "resubmit",
                      )
                    }
                    disabled={isSubmitting}
                    className="flex-1"
                  >
                    <Send className="mr-2 h-4 w-4" />
                    {currentPO.status === "draft" ? "Submit" : "Resubmit"}
                  </Button>
                )}

                {canInvoice && (
                  <Button
                    onClick={handleInvoice}
                    disabled={isSubmitting}
                    className="flex-1"
                  >
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Mark as invoiced
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Approval Timeline */}
          <div className="rounded-lg border bg-card p-4">
            <h3 className="mb-4 font-medium">Approval timeline</h3>
            {history.length === 0 ? (
              <p className="text-sm text-muted-foreground">No activity yet.</p>
            ) : (
              <div className="space-y-4">
                {history.map((entry, index) => (
                  <div key={entry.id} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      {getActionIcon(entry.action)}
                      {index < history.length - 1 && (
                        <div className="mt-1 h-full w-px bg-border" />
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <div className="flex items-center gap-2">
                        <User className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm font-medium">
                          {entry.user?.name || "Unknown"}
                        </span>
                        {entry.user && (
                          <Badge
                            variant="secondary"
                            className={`text-xs ${ROLE_CONFIG[entry.user.role].color}`}
                          >
                            {ROLE_CONFIG[entry.user.role].label}
                          </Badge>
                        )}
                      </div>
                      <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                        <Badge variant="outline" className="text-xs">
                          {STATUS_CONFIG[entry.from_status].label}
                        </Badge>
                        <ArrowRight className="h-3 w-3" />
                        <Badge variant="outline" className="text-xs">
                          {STATUS_CONFIG[entry.to_status].label}
                        </Badge>
                      </div>
                      {entry.comment && (
                        <p className="mt-2 text-sm text-muted-foreground">
                          {entry.comment}
                        </p>
                      )}
                      <p className="mt-1 text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(entry.created_at), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
