import { useMemo } from "react";
import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { DashboardGrid } from "@/components/dashboard/DashboardGrid";
import { DashboardStatCard } from "@/components/dashboard/DashboardStatCard";
import { GridIcon, PharmacyIcon, ShieldIcon, UserIcon } from "@/components/icons";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { localizeGovernorate } from "@/lib/locations/governorates";
import type { BackendUser, PharmacistProfileData, ProfileVerification, UserProfileData } from "@/types/backend";

interface PharmacistDashboardSummaryProps {
  user: BackendUser | null;
  userProfile: UserProfileData | null;
  roleProfile: PharmacistProfileData | null;
  verification: ProfileVerification | null;
}

function normalize(value: string | null | undefined): string {
  if (!value) return "—";
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : "—";
}

export function PharmacistDashboardSummary({
  user,
  userProfile,
  roleProfile,
  verification,
}: PharmacistDashboardSummaryProps) {
  const { t, locale } = useAppPreferences();
  const isApproved = verification?.is_approved === true;

  const pharmacistName = useMemo(() => {
    const fullName = user?.full_name?.trim();
    if (fullName) return fullName;

    const builtName = `${user?.first_name ?? ""} ${user?.last_name ?? ""}`.trim();
    return builtName.length > 0 ? builtName : "—";
  }, [user?.first_name, user?.full_name, user?.last_name]);

  const location = useMemo(() => {
    const governorate = normalize(localizeGovernorate(userProfile?.governorate, locale));
    const district = normalize(userProfile?.district);

    if (governorate === "—" && district === "—") {
      return "—";
    }

    if (governorate !== "—" && district !== "—") {
      return `${governorate} / ${district}`;
    }

    return governorate !== "—" ? governorate : district;
  }, [locale, userProfile?.district, userProfile?.governorate]);

  const verificationLabel = isApproved
    ? t.profile.verificationApproved
    : verification?.status ?? t.profile.verificationPending;

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-[var(--color-text)]">{t.pharmacist.pharmacyIdentity}</h2>
          <p className="mt-1 text-sm leading-7 text-[var(--color-muted)]">{t.pharmacist.noFakePrescriptionCounts}</p>
        </div>
        <Badge tone={isApproved ? "success" : "warning"}>{verificationLabel}</Badge>
      </div>

      <div className="mt-5">
        <DashboardGrid columns="four">
          <DashboardStatCard label={t.pharmacist.pharmacyName} value={normalize(roleProfile?.pharmacy_name)} icon={<PharmacyIcon size={20} />} tone="primary" surface="panel" />
          <DashboardStatCard label={t.pharmacist.pharmacistName} value={pharmacistName} icon={<UserIcon size={20} />} tone="neutral" surface="panel" />
          <DashboardStatCard label={t.pharmacist.pharmacistLicense} value={normalize(roleProfile?.pharmacist_license_number)} icon={<ShieldIcon size={20} />} tone="success" surface="panel" />
          <DashboardStatCard label={t.pharmacist.pharmacyAddress} value={normalize(roleProfile?.pharmacy_address)} icon={<GridIcon size={20} />} tone="neutral" surface="panel" />
        </DashboardGrid>
      </div>

      <div className="mt-4 rounded-2xl border border-dashed border-[var(--color-border)] bg-[color:color-mix(in_srgb,var(--color-surface-alt)_60%,var(--color-surface))] p-4 text-sm leading-7 text-[var(--color-muted)]">
        <p>
          {t.profile.phone}: {normalize(userProfile?.phone_number)}
        </p>
        <p className="mt-1">
          {t.profile.governorate}: {location}
        </p>
      </div>
    </Card>
  );
}
