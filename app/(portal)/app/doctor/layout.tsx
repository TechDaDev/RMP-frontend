import type { ReactNode } from "react";
import { RequireRole } from "@/components/auth/RequireRole";

export default function DoctorLayout({ children }: { children: ReactNode }) {
  return <RequireRole role="doctor">{children}</RequireRole>;
}
