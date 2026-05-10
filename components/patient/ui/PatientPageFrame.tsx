import type { ReactNode } from "react";

interface PatientPageFrameProps {
  children: ReactNode;
}

export function PatientPageFrame({ children }: PatientPageFrameProps) {
  return <div className="space-y-6">{children}</div>;
}
