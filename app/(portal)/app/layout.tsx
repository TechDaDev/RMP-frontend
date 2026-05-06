import type { ReactNode } from "react";
import { PortalShell } from "@/components/layouts/PortalShell";

export default function AppPortalLayout({ children }: { children: ReactNode }) {
  return <PortalShell>{children}</PortalShell>;
}