import type { ReactNode } from "react";
import { RequireRole } from "@/components/auth/RequireRole";

export default function LabLayout({ children }: { children: ReactNode }) {
  return <RequireRole role="laboratorian">{children}</RequireRole>;
}
