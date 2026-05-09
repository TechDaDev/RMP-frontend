import { useMemo } from "react";
import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { GridIcon, PharmacyIcon, ShieldIcon, UserIcon } from "@/components/icons";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import type { BackendUser, PharmacistProfileData, ProfileVerification, UserProfileData } from "@/types/backend";

interface PharmacistDashboardSummaryProps {
  user: BackendUser | null;
  userProfile: UserProfileData | null;
  roleProfile: PharmacistProfileData | null;
  verification: ProfileVerification | null;
}

function SummaryField({
  label,
  value,
  Icon,
}: {
  label: string;
  value: string;
  Icon: typeof GridIcon;
}) {
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
  const { t } = useAppPreferences();
  const isApproved = verification?.is_approved === true;

  const pharmacistName = useMemo(() => {
    const fullName = user?.full_name?.trim();
    if (fullName) return fullName;

    const builtName = `${user?.first_name ?? ""} ${user?.last_name ?? ""}`.trim();
    return builtName.length > 0 ? builtName : "—";
  }, [user?.first_name, user?.full_name, user?.last_name]);

  const location = useMemo(() => {
    const governorate = normalize(userProfile?.governorate);
    const district = normalize(userProfile?.district);

    if (governorate === "—" && district === "—") {
      return "—";
    }

    if (governorate !== "—" && district !== "—") {
      return `${governorate} / ${district}`;
    }

    return governorate !== "—" ? governorate : district;
  }, [userProfile?.district, userProfile?.governorate]);

  const verificationLabel = isApproved
    ? t.profile.verificationApproved
    : verification?.status ?? t.profile.verificationPending;

  return (
    <Card className="rounded-[2rem]">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-[var(--color-text)]">{t.pharmacist.pharmacyIdentity}</h2>
          <p className="mt-1 text-sm leading-7 text-[var(--color-muted)]">{t.pharmacist.noFakePrescriptionCounts}</p>
        </div>
        <Badge tone={isApproved ? "success" : "warning"}>{verificationLabel}</Badge>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <SummaryField label={t.pharmacist.pharmacyName} value={normalize(roleProfile?.pharmacy_name)} Icon={PharmacyIcon} />
        <SummaryField label={t.pharmacist.pharmacistName} value={pharmacistName} Icon={UserIcon} />
        <SummaryField label={t.pharmacist.pharmacistLicense} value={normalize(roleProfile?.pharmacist_license_number)} Icon={ShieldIcon} />
        <SummaryField label={t.pharmacist.pharmacyAddress} value={normalize(roleProfile?.pharmacy_address)} Icon={GridIcon} />
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
