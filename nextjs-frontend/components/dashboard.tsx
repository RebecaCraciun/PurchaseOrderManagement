"use client";

import { useState, useEffect, useCallback } from "react";
import { getPurchaseOrders } from "@/lib/api";
import { useRole } from "@/components/role-provider";
import { POTable } from "@/components/po-table";
import { PODetailSheet } from "@/components/po-detail-sheet";
import { CreatePODialog } from "@/components/create-po-dialog";
import { PurchaseOrder, POStatus, getApproverRoleForStatus } from "@/lib/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Plus,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";

export function Dashboard() {
  const { currentUser, isLoading: roleLoading } = useRole();
  const [orders, setOrders] = useState<PurchaseOrder[]>([]);
  const [selectedPO, setSelectedPO] = useState<PurchaseOrder | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const loadOrders = useCallback(async () => {
    try {
      const data = await getPurchaseOrders();
      setOrders(data || []);
    } catch (err) {
      console.error("Error loading orders:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!roleLoading) {
      loadOrders();
    }
  }, [roleLoading, loadOrders]);

  const handleSelectPO = (po: PurchaseOrder) => {
    // Refresh PO data
    const fresh = orders.find((o) => o.id === po.id);
    setSelectedPO(fresh || po);
    setIsDetailOpen(true);
  };

  const handleUpdate = () => {
    loadOrders();
    // Refresh selected PO
    if (selectedPO) {
      const fresh = orders.find((o) => o.id === selectedPO.id);
      if (fresh) setSelectedPO(fresh);
    }
  };

  if (roleLoading || isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="flex h-96 items-center justify-center">
        <p className="text-muted-foreground">No user selected</p>
      </div>
    );
  }

  /// Filter orders based on role
  const myOrders = orders.filter((o) => o.creator_id === currentUser.id);
  const pendingMyApproval = orders.filter(
    (o) => getApproverRoleForStatus(o.status) === currentUser.role,
  );
  const drafts = myOrders.filter((o) => o.status === "draft");
  const needsRework = myOrders.filter((o) => o.status === "needs_rework");
  const invoiced = orders.filter((o) => o.status === "invoiced");

  /// Stats
  const stats = [
    {
      label: "Pending my approval",
      value: pendingMyApproval.length,
      icon: Clock,
      color: "text-amber-600",
    },
    {
      label: "My drafts",
      value: drafts.length,
      icon: FileText,
      color: "text-muted-foreground",
    },
    {
      label: "Needs rework",
      value: needsRework.length,
      icon: AlertCircle,
      color: "text-red-600",
    },
    {
      label: "Invoiced",
      value: invoiced.length,
      icon: CheckCircle2,
      color: "text-green-600",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Action bar */}
      {currentUser.role === "creator" && (
        <div className="flex justify-end">
          <Button
            onClick={() => setIsCreateOpen(true)}
            className="bg-green-600/50 text-white hover:bg-green-600/70"
          >
            <Plus className="mr-2 h-4 w-4" />
            New purchase order
          </Button>
        </div>
      )}

      {/* Tabs */}
      <Tabs
        defaultValue={currentUser.role === "creator" ? "my-orders" : "pending"}
      >
        <TabsList>
          {currentUser.role !== "creator" && (
            <TabsTrigger value="pending">
              Pending my approval ({pendingMyApproval.length})
            </TabsTrigger>
          )}
          <TabsTrigger value="my-orders">
            My orders ({myOrders.length})
          </TabsTrigger>
          <TabsTrigger value="all">All orders ({orders.length})</TabsTrigger>
        </TabsList>

        {currentUser.role !== "creator" && (
          <TabsContent value="pending" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Pending your approval</CardTitle>
                <CardDescription>
                  Purchase orders waiting for your review and approval.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <POTable
                  orders={pendingMyApproval}
                  onSelect={handleSelectPO}
                  emptyMessage="No orders pending your approval."
                />
              </CardContent>
            </Card>
          </TabsContent>
        )}

        <TabsContent value="my-orders" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>My purchase orders</CardTitle>
              <CardDescription>Orders you have created.</CardDescription>
            </CardHeader>
            <CardContent>
              <POTable
                orders={myOrders}
                onSelect={handleSelectPO}
                emptyMessage="You haven't created any orders yet."
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="all" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>All purchase orders</CardTitle>
              <CardDescription>
                Complete view of all purchase orders in the system.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <POTable
                orders={orders}
                onSelect={handleSelectPO}
                emptyMessage="No purchase orders in the system."
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <CreatePODialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onSuccess={loadOrders}
      />

      <PODetailSheet
        po={selectedPO}
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
        onUpdate={handleUpdate}
      />
    </div>
  );
}
