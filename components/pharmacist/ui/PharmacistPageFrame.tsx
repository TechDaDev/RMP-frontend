import type { ReactNode } from "react";

interface PharmacistPageFrameProps {
  children: ReactNode;
}

export function PharmacistPageFrame({ children }: PharmacistPageFrameProps) {
  return <div className="space-y-6">{children}</div>;
}
