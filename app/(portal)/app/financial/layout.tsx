import type { ReactNode } from "react";
import { RequireRole } from "@/components/auth/RequireRole";

export default function FinancialLayout({ children }: { children: ReactNode }) {
  return <RequireRole roles={["admin", "financial"]}>{children}</RequireRole>;
}
