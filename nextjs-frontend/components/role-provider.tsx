"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { getUsers } from "@/lib/api";
import type { User, UserRole } from "@/lib/types";

interface RoleContextType {
  currentUser: User | null;
  users: User[];
  isLoading: boolean;
  switchRole: (role: UserRole) => void;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadUsers() {
      try {
        const data = await getUsers();
        setUsers(data || []);
        const creator = data?.find((u: User) => u.role === "creator");
        if (creator) setCurrentUser(creator);
      } catch (err) {
        console.error("Error loading users:", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadUsers();
  }, []);

  const switchRole = (role: UserRole) => {
    const user = users.find((u) => u.role === role);
    if (user) {
      setCurrentUser(user);
    }
  };

  return (
    <RoleContext.Provider value={{ currentUser, users, isLoading, switchRole }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error("useRole must be used within a RoleProvider");
  }
  return context;
}
