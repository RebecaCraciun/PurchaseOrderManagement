"use client";

import { PurchaseOrder, STATUS_CONFIG, CATEGORY_CONFIG } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDistanceToNow } from "date-fns";

interface POTableProps {
  orders: PurchaseOrder[];
  onSelect: (po: PurchaseOrder) => void;
  emptyMessage?: string;
}

export function POTable({
  orders,
  onSelect,
  emptyMessage = "No purchase orders found.",
}: POTableProps) {
  if (orders.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center rounded-lg border border-dashed">
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Number</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Category</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((po) => (
            <TableRow
              key={po.id}
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => onSelect(po)}
            >
              <TableCell className="font-mono text-sm">
                {po.po_number.replace(/^PO-?/i, "")}
              </TableCell>
              <TableCell className="max-w-50 truncate font-medium">
                {po.title}
              </TableCell>
              <TableCell>
                <Badge variant="outline">
                  {CATEGORY_CONFIG[po.category].label}
                </Badge>
              </TableCell>
              <TableCell className="text-right font-mono">
                $
                {po.amount.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                })}
              </TableCell>
              <TableCell>
                <Badge className={STATUS_CONFIG[po.status].color}>
                  {STATUS_CONFIG[po.status].label}
                </Badge>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {formatDistanceToNow(new Date(po.created_at), {
                  addSuffix: true,
                })}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
