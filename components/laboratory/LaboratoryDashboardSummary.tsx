import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { GridIcon, LabIcon, PulseIcon, ShieldIcon } from "@/components/icons";
import type { LaboratorianProfileData, ProfileVerification } from "@/types/backend";

interface LaboratoryDashboardSummaryProps {
  roleProfile: LaboratorianProfileData | null;
  verification: ProfileVerification | null;
  catalogCount: number;
}

function SummaryField({ label, value, Icon }: { label: string; value: string; Icon: typeof GridIcon }) {
  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-4">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">
        <Icon size={16} />
        <span>{label}</span>
      </div>
      <p className="mt-3 text-sm font-semibold leading-6 text-[var(--color-text)]">{value}</p>
    </div>
  );
}

export function LaboratoryDashboardSummary({ roleProfile, verification, catalogCount }: LaboratoryDashboardSummaryProps) {
  const { t } = useAppPreferences();
  const isApproved = verification?.is_approved === true;
  const verificationStatus = verification?.status ?? "pending";

  return (
    <Card className="rounded-[2rem]">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-[var(--color-text)]">{t.laboratory.labIdentity}</h2>
          <p className="mt-1 text-sm leading-7 text-[var(--color-muted)]">{t.profile.verificationGuidance}</p>
        </div>
        <Badge tone={isApproved ? "success" : "primary"}>{verificationStatus}</Badge>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <SummaryField label={t.laboratory.laboratoryName} value={roleProfile?.laboratory_name || "—"} Icon={LabIcon} />
        <SummaryField label={t.laboratory.laboratoryLicense} value={roleProfile?.laboratory_license_number || "—"} Icon={ShieldIcon} />
        <SummaryField label={t.laboratory.laboratoryAddress} value={roleProfile?.laboratory_address || "—"} Icon={GridIcon} />
        <SummaryField label={t.laboratory.testCatalogPreview} value={String(catalogCount)} Icon={PulseIcon} />
      </div>

      <div className="mt-4 rounded-2xl border border-dashed border-[var(--color-border)] bg-[color:color-mix(in_srgb,var(--color-surface-alt)_60%,var(--color-surface))] p-4 text-sm leading-7 text-[var(--color-muted)]">
        <p>
          {roleProfile?.specialization ? `${t.profile.specialization}: ${roleProfile.specialization}` : t.profile.completeProfilePrompt}
        </p>
        <p className="mt-1">
          {roleProfile?.working_hours ? `${t.profile.workingHours}: ${roleProfile.working_hours}` : t.profile.verificationGuidance}
        </p>
      </div>
    </Card>
  );
}
