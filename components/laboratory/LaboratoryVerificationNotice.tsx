import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { ShieldIcon } from "@/components/icons";
import type { LaboratorianProfileData, ProfileVerification } from "@/types/backend";

/**
 * Displays the verification status for a laboratorian account.
 * 
 * Verification gating applies equally to doctor, pharmacist, and laboratorian roles.
 * Laboratorians cannot perform lab order scanning or result creation until approved by staff.
 * Verification fields (verified_at, verified_by, verification_notes) are read-only.
 */
interface LaboratoryVerificationNoticeProps {
  verification: ProfileVerification | null;
  roleProfile: LaboratorianProfileData | null;
}

export function LaboratoryVerificationNotice({ verification, roleProfile }: LaboratoryVerificationNoticeProps) {
  const { t } = useAppPreferences();
  const isVerifiedAccount = verification?.is_approved === true;
  const statusTone = isVerifiedAccount ? "success" : "primary";
  const statusLabel = !verification
    ? t.laboratory.verificationRequired
    : isVerifiedAccount
      ? t.laboratory.verifiedLaboratoryAccount
      : verification.status === "rejected"
        ? t.laboratory.laboratoryVerificationRejected
        : verification.status === "suspended"
          ? t.laboratory.laboratoryVerificationSuspended
          : t.laboratory.laboratoryVerificationPending;
  const statusDescription = !verification
    ? t.laboratory.laboratoryActionsDisabled
    : isVerifiedAccount
      ? t.profile.verificationGuidance
      : verification.rejection_reason ?? verification.message ?? t.laboratory.laboratoryActionsDisabled;
  const laboratoryName = roleProfile?.laboratory_name?.trim() || t.laboratory.labIdentity;

  return (
    <Card className="rounded-[2rem] border-[color:color-mix(in_srgb,var(--color-primary)_20%,var(--color-border))] bg-[linear-gradient(135deg,color-mix(in_srgb,var(--color-primary)_10%,var(--color-surface))_0%,var(--color-surface)_72%)]">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[color:color-mix(in_srgb,var(--color-primary)_14%,var(--color-surface))] text-[var(--color-primary)]">
            <ShieldIcon size={20} />
          </div>
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-bold text-[var(--color-text)]">{laboratoryName}</h2>
              <Badge tone={statusTone}>{statusLabel}</Badge>
            </div>
            <p className="max-w-2xl text-sm leading-7 text-[var(--color-muted)]">{statusDescription}</p>
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-muted)]">
          <p className="font-semibold text-[var(--color-text)]">{t.laboratory.laboratoryActionsDisabled}</p>
          <p className="mt-1 leading-6">
            {isVerifiedAccount ? t.laboratory.workflowStartsWithQr : t.laboratory.scanQrComingNext}
          </p>
        </div>
      </div>
    </Card>
  );
}
