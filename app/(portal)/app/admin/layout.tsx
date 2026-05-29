import type { ReactNode } from "react";
import { AdminSectionGuard } from "@/components/auth/AdminSectionGuard";
import { RequireRole } from "@/components/auth/RequireRole";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <RequireRole role="admin">
      <AdminSectionGuard>{children}</AdminSectionGuard>
    </RequireRole>
  );
}
