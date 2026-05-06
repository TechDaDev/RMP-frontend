import type { ReactNode } from "react";
import { RequireRole } from "@/components/auth/RequireRole";

export default function PatientLayout({ children }: { children: ReactNode }) {
  return <RequireRole role="patient">{children}</RequireRole>;
}
