import type { ReactNode } from "react";

interface LaboratoryPageFrameProps {
  children: ReactNode;
}

export function LaboratoryPageFrame({ children }: LaboratoryPageFrameProps) {
  return <div className="space-y-6">{children}</div>;
}
