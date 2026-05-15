import { useAuth } from "./AuthProvider";
import type { ReactNode } from "react";

interface PermissionGuardProps {
  permission: string;
  children: ReactNode;
  fallback?: ReactNode;
}

export function PermissionGuard({ permission, children, fallback = null }: PermissionGuardProps) {
  const { effectiveRole, profile } = useAuth();
  const roleProfile = (profile?.role_profile ?? null) as Record<string, unknown> | null;

  if (effectiveRole !== "admin" || roleProfile?.[permission] !== true) {
    return fallback;
  }

  return <>{children}</>;
}
