"use client";

import { Card } from "@/components/ui/Card";
import type { ProfileVerification } from "@/types/backend";

interface DoctorVerificationNoticeProps {
  verification: ProfileVerification | null;
  requiredLabel: string;
  requiredDescription: string;
  disabledLabel: string;
}

export function DoctorVerificationNotice({
  verification,
  requiredLabel,
  requiredDescription,
  disabledLabel,
}: DoctorVerificationNoticeProps) {
  const status = verification?.status ?? null;
  const isApproved = verification?.is_approved === true;

  if (isApproved) {
    return null;
  }

  return (
    <Card className="rounded-[2rem] border-amber-300 bg-amber-50 dark:border-amber-800 dark:bg-amber-950">
      <p className="text-sm font-semibold text-amber-900 dark:text-amber-200">{requiredLabel}</p>
      <p className="mt-2 text-sm leading-7 text-amber-800 dark:text-amber-300">
        {requiredDescription}
      </p>
      <p className="mt-2 text-xs font-medium text-amber-800 dark:text-amber-300">
        {disabledLabel}
        {status ? ` (${status})` : ""}
      </p>
    </Card>
  );
}
