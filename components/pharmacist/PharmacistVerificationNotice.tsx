import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { ShieldIcon } from "@/components/icons";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import type { ProfileVerification } from "@/types/backend";

interface PharmacistVerificationNoticeProps {
  verification: ProfileVerification | null;
}

export function PharmacistVerificationNotice({ verification }: PharmacistVerificationNoticeProps) {
  const { t } = useAppPreferences();
  const status = verification?.status ?? "pending";
  const isApproved = verification?.is_approved === true;

  const statusTone = isApproved
    ? "success"
    : status === "rejected" || status === "suspended"
      ? "danger"
      : "warning";

  const statusLabel = isApproved
    ? t.pharmacist.verifiedPharmacistAccount
    : status === "rejected"
      ? t.pharmacist.pharmacistVerificationRejected
      : status === "suspended"
        ? t.pharmacist.pharmacistVerificationSuspended
        : t.pharmacist.pharmacistVerificationPending;

  const statusDescription = isApproved
    ? t.profile.verificationGuidance
    : verification?.rejection_reason ?? verification?.message ?? t.pharmacist.pharmacistActionsDisabled;

  const title = isApproved
    ? t.pharmacist.verifiedPharmacistAccount
    : t.pharmacist.verificationRequired;

  const actionSummary = isApproved
    ? t.pharmacist.workflowStartsWithQr
    : t.pharmacist.pharmacistActionsDisabled;

  return (
    <Card className="rounded-[2rem] border-[color:color-mix(in_srgb,var(--color-primary)_20%,var(--color-border))] bg-[linear-gradient(135deg,color-mix(in_srgb,var(--color-primary)_10%,var(--color-surface))_0%,var(--color-surface)_72%)]">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[color:color-mix(in_srgb,var(--color-primary)_14%,var(--color-surface))] text-[var(--color-primary)]">
            <ShieldIcon size={20} />
          </div>
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-bold text-[var(--color-text)]">{title}</h2>
              <Badge tone={statusTone}>{statusLabel}</Badge>
            </div>
            <p className="max-w-2xl text-sm leading-7 text-[var(--color-muted)]">{statusDescription}</p>
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-muted)]">
          <p className="font-semibold text-[var(--color-text)]">{actionSummary}</p>
          <p className="mt-1 leading-6">
            {isApproved ? t.pharmacist.workflowStartsWithQr : t.pharmacist.verificationRequiredDescription}
          </p>
        </div>
      </div>
    </Card>
  );
}
