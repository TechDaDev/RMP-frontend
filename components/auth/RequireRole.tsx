"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import { AppLoading } from "@/components/ui/AppLoading";

/** Maps user_type → their canonical dashboard route. */
const roleRouteMap: Record<string, string> = {
  patient: "/app/patient",
  doctor: "/app/doctor",
  pharmacist: "/app/pharmacist",
  laboratorian: "/app/lab",
};

interface RequireRoleProps {
  /** The user_type that is allowed to view this page. */
  role: string;
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
export function RequireRole({ role, children }: RequireRoleProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user && user.user_type !== role) {
      const correctRoute = roleRouteMap[user.user_type] ?? "/app";
      router.replace(correctRoute);
    }
  }, [loading, user, role, router]);

  if (loading) {
    return <AppLoading />;
  }

  // While redirect is pending or user is null (handled by RequireAuth above)
  if (!user || user.user_type !== role) {
    return null;
  }

  return <>{children}</>;
}
