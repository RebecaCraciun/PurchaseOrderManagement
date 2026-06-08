"use client";

import { useRole } from "@/components/role-provider";
import { ROLE_CONFIG, UserRole } from "@/lib/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { FileText, User } from "lucide-react";

export function Header() {
  const { currentUser, isLoading, switchRole } = useRole();

  return (
    <header className="sticky top-0 pb-2 z-50 border-b bg-card">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <FileText className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-semibold">
              Rinf purchase order system
            </h1>
            <p className="text-xs text-muted-foreground">
              Smart order tracking tool
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {isLoading ? (
            <div className="h-10 w-48 animate-pulse rounded-md bg-muted" />
          ) : currentUser ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">{currentUser.name}</span>
              </div>
              <Select
                value={currentUser.role}
                onValueChange={(value) => switchRole(value as UserRole)}
              >
                <SelectTrigger className="w-auto">
                  <Badge
                    variant="secondary"
                    className={ROLE_CONFIG[currentUser.role].color}
                  >
                    {ROLE_CONFIG[currentUser.role].label}
                  </Badge>
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(ROLE_CONFIG) as UserRole[]).map((role) => (
                    <SelectItem key={role} value={role}>
                      <Badge
                        variant="secondary"
                        className={ROLE_CONFIG[role].color}
                      >
                        {ROLE_CONFIG[role].label}
                      </Badge>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
