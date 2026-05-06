"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import { AppLoading } from "@/components/ui/AppLoading";

interface RequireAuthProps {
  children: ReactNode;
}

/**
 * Redirects unauthenticated users to /login.
 * Shows a full-screen loading indicator while the initial auth check runs
 * to prevent a flash of protected content before the token resolves.
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
    return <AppLoading />;
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
