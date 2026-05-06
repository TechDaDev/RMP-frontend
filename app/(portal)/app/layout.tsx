import type { ReactNode } from "react";
import { PortalShell } from "@/components/layouts/PortalShell";
import { RequireAuth } from "@/components/auth/RequireAuth";

export default function AppPortalLayout({ children }: { children: ReactNode }) {
  return (
    <RequireAuth>
      <PortalShell>{children}</PortalShell>
    </RequireAuth>
  );
}