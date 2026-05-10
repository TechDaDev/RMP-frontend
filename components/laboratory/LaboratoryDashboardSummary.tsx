import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { DashboardGrid } from "@/components/dashboard/DashboardGrid";
import { DashboardStatCard } from "@/components/dashboard/DashboardStatCard";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { GridIcon, LabIcon, PulseIcon, ShieldIcon } from "@/components/icons";
import type { LaboratorianProfileData, ProfileVerification } from "@/types/backend";

interface LaboratoryDashboardSummaryProps {
  roleProfile: LaboratorianProfileData | null;
  verification: ProfileVerification | null;
  catalogCount: number;
}

export function LaboratoryDashboardSummary({ roleProfile, verification, catalogCount }: LaboratoryDashboardSummaryProps) {
  const { t } = useAppPreferences();
  const isApproved = verification?.is_approved === true;
  const verificationStatus = verification?.status ?? "pending";

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-[var(--color-text)]">{t.laboratory.labIdentity}</h2>
          <p className="mt-1 text-sm leading-7 text-[var(--color-muted)]">{t.profile.verificationGuidance}</p>
        </div>
        <Badge tone={isApproved ? "success" : "primary"}>{verificationStatus}</Badge>
      </div>

      <div className="mt-5">
        <DashboardGrid columns="four">
          <DashboardStatCard label={t.laboratory.laboratoryName} value={roleProfile?.laboratory_name || "—"} icon={<LabIcon size={20} />} tone="primary" surface="panel" />
          <DashboardStatCard label={t.laboratory.laboratoryLicense} value={roleProfile?.laboratory_license_number || "—"} icon={<ShieldIcon size={20} />} tone="success" surface="panel" />
          <DashboardStatCard label={t.laboratory.laboratoryAddress} value={roleProfile?.laboratory_address || "—"} icon={<GridIcon size={20} />} tone="neutral" surface="panel" />
          <DashboardStatCard label={t.laboratory.testCatalogPreview} value={String(catalogCount)} icon={<PulseIcon size={20} />} tone="info" surface="panel" />
        </DashboardGrid>
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
