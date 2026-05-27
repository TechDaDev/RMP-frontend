"use client";

import { useEffect, useMemo, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import { AppLoading } from "@/components/ui/AppLoading";
import { getDashboardRoute } from "@/lib/auth/roleHelpers";

/** Maps user_type → their canonical dashboard route. */
const roleRouteMap: Record<string, string> = {
  patient: "/app/patient",
  doctor: "/app/doctor",
  pharmacist: "/app/pharmacist",
  laboratorian: "/app/lab",
  admin: "/app/admin",
  financial: "/app/financial",
};

interface RequireRoleProps {
  /** The user_type that is allowed to view this page. */
  role?: string;
  roles?: string[];
  children: ReactNode;
}

/**
 * Role-based route guard.
 * If the authenticated user's role does not match `role`, they are
 * redirected to their own correct dashboard instead of seeing a 403/blank.
 *
 * Must be used inside a RequireAuth boundary (portal layout already provides
 * RequireAuth, so this component can assume the user is authenticated once
 * loading is false).
 */
export function RequireRole({ role, roles, children }: RequireRoleProps) {
  const { effectiveRole, loading } = useAuth();
  const router = useRouter();
  const allowedRoles = useMemo(() => roles ?? (role ? [role] : []), [role, roles]);

  useEffect(() => {
    if (!loading && effectiveRole && allowedRoles.length > 0 && !allowedRoles.includes(effectiveRole)) {
      const correctRoute = roleRouteMap[effectiveRole] ?? getDashboardRoute(effectiveRole);
      router.replace(correctRoute);
    }
  }, [allowedRoles, effectiveRole, loading, router]);

  if (loading) {
    return <AppLoading />;
  }

  // While redirect is pending or user is null (handled by RequireAuth above)
  if (!effectiveRole || (allowedRoles.length > 0 && !allowedRoles.includes(effectiveRole))) {
    return null;
  }

  return <>{children}</>;
}
