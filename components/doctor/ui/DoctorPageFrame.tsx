import type { ReactNode } from "react";

interface DoctorPageFrameProps {
  children: ReactNode;
}

export function DoctorPageFrame({ children }: DoctorPageFrameProps) {
  return <div className="space-y-6">{children}</div>;
}
