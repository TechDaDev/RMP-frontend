"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import { AppLoading } from "@/components/ui/AppLoading";
import {
  getAllowedAdminSections,
  getRouteSectionRule,
  hasAnyAdminSection,
} from "@/lib/admin/adminSections";

export function AdminSectionGuard({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, profile, effectiveRole, loading } = useAuth();
  const rule = getRouteSectionRule(pathname);
  const allowedSections = getAllowedAdminSections({ user, profile, role: effectiveRole });
  const hasAccess = rule ? hasAnyAdminSection(allowedSections, rule.anyOf) : true;
  const fallbackRoute = effectiveRole === "financial" ? "/app/financial" : "/app/admin";

  useEffect(() => {
    if (!loading && rule && !hasAccess) {
      router.replace(fallbackRoute);
    }
  }, [fallbackRoute, hasAccess, loading, router, rule]);

  if (loading) {
    return <AppLoading />;
  }

  if (rule && !hasAccess) {
    return null;
  }

  return <>{children}</>;
}