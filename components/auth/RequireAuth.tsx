"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";

interface RequireAuthProps {
  children: ReactNode;
}

/**
 * Redirects unauthenticated users to /login.
 * Shows nothing while the initial auth check is in progress.
 */
export function RequireAuth({ children }: RequireAuthProps) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [loading, isAuthenticated, router]);

  if (loading) {
    // Avoid flash of content; return null until token check resolves
    return null;
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
