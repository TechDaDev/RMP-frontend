import type { ReactNode } from "react";
import { RequireRole } from "@/components/auth/RequireRole";

export default function PharmacistLayout({ children }: { children: ReactNode }) {
  return <RequireRole role="pharmacist">{children}</RequireRole>;
}
