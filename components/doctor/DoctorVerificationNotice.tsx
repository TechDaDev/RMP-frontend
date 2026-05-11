"use client";

import { Card } from "@/components/ui/Card";
import type { ProfileVerification } from "@/types/backend";

/**
 * Displays the verification status for a doctor account.
 * 
 * Note: Verification gating (checking `is_approved`) applies equally to all three professional roles:
 * - Doctor (`verification_status` required for consultations, prescriptions, lab orders)
 * - Pharmacist (`verification_status` required for prescription scanning)
 * - Laboratorian (`verification_status` required for lab order scanning and result creation)
 * 
 * See FRONTEND_INTEGRATION_GUIDE.md: "For professional roles (doctor, pharmacist, laboratorian),
 * also check verification_status from GET /api/profiles/me/."
 */
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
