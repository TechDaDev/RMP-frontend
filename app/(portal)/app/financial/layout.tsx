import type { ReactNode } from "react";
import { AdminSectionGuard } from "@/components/auth/AdminSectionGuard";
import { RequireRole } from "@/components/auth/RequireRole";

export default function FinancialLayout({ children }: { children: ReactNode }) {
  return (
    <RequireRole roles={["admin", "financial"]}>
      <AdminSectionGuard>{children}</AdminSectionGuard>
    </RequireRole>
  );
}
