"use client";

import { useState } from "react";
import { createPurchaseOrder } from "@/lib/api";
import { useRole } from "@/components/role-provider";
import { POCategory, CATEGORY_CONFIG, getNextStatus } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { toast } from "sonner";

interface CreatePODialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function CreatePODialog({
  open,
  onOpenChange,
  onSuccess,
}: CreatePODialogProps) {
  const { currentUser } = useRole();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    amount: "",
    category: "services" as POCategory,
  });

  const handleSubmit = async (asDraft: boolean) => {
    if (!currentUser) return;
    if (!formData.title || !formData.amount) {
      toast.error("Please fill in required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      const amount = parseFloat(formData.amount);
      await createPurchaseOrder({
        title: formData.title,
        description: formData.description || undefined,
        amount,
        category: formData.category,
        creatorId: currentUser.id,
        submit: !asDraft,
      });

      toast.success(asDraft ? "Draft saved" : "Purchase order submitted");
      setFormData({
        title: "",
        description: "",
        amount: "",
        category: "services",
      });
      onOpenChange(false);
      onSuccess();
    } catch (err) {
      console.error("Error creating PO:", err);
      toast.error("Failed to create purchase order");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create purchase order</DialogTitle>
          <DialogDescription>
            Fill in the details for your new purchase order.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              placeholder="e.g., Office Furniture"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Additional details..."
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="amount">Amount ($) *</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: e.target.value })
                }
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) =>
                  setFormData({ ...formData, category: value as POCategory })
                }
              >
                <SelectTrigger id="category">
                  {CATEGORY_CONFIG[formData.category].label}
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(CATEGORY_CONFIG) as POCategory[]).map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {CATEGORY_CONFIG[cat].label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {formData.amount && parseFloat(formData.amount) < 100 && (
            <p className="text-sm text-muted-foreground">
              Orders under $100 skip manager approval and go directly to{" "}
              {formData.category === "it_equipment" ? "IT" : "Finance"}.
            </p>
          )}

          {formData.category === "it_equipment" && (
            <p className="text-sm text-muted-foreground">
              IT Equipment requires IT department review before Finance
              approval.
            </p>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => handleSubmit(true)}
            disabled={isSubmitting}
          >
            Save as draft
          </Button>
          <Button onClick={() => handleSubmit(false)} disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit for approval"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
