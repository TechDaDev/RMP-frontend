import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { useAuth } from "@/components/auth/AuthProvider";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";

export function CompletionStatusCard() {
  const { t } = useAppPreferences();
  const { completion } = useAuth();

  if (!completion) {
    return null;
  }

  const missingFields = [
    ...(completion.missing_shared_fields ?? []),
    ...(completion.missing_role_fields ?? []),
  ];
  const fieldLabels: Record<string, string> = {
    phone_number: t.profile.phone,
    profile_image: t.profile.profileImage,
    gender: t.profile.gender,
    date_of_birth: t.profile.dateOfBirth,
    governorate: t.profile.governorate,
    district: t.profile.district,
    address: t.profile.address,
    national_id: t.profile.nationalId,
    social_security_id: t.profile.socialSecurityId,
    emergency_contact_name: t.profile.emergencyContactName,
    emergency_contact_phone: t.profile.emergencyContactPhone,
    medical_license_number: t.profile.licenseNumber,
    medical_license_image: t.profile.licenseFile,
    specialty: t.profile.specialty,
    pharmacist_license_number: t.profile.licenseNumber,
    pharmacist_license_image: t.profile.licenseFile,
    pharmacy_name: t.profile.pharmacyName,
    pharmacy_address: t.profile.address,
    laboratorian_license_number: t.profile.licenseNumber,
    laboratorian_license_image: t.profile.licenseFile,
    laboratory_name: t.profile.laboratoryName,
    laboratory_address: t.profile.address,
  };

  return (
    <Card className="rounded-[2rem]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-lg font-bold text-[var(--color-text)]">{t.profile.completionStatus}</h3>
        <Badge tone={completion.overall_complete ? "success" : "primary"}>
          {completion.overall_complete ? t.profile.profileComplete : t.profile.profileIncomplete}
        </Badge>
      </div>

      {typeof completion.percentage === "number" ? (
        <p className="mt-2 text-sm text-[var(--color-muted)]">{completion.percentage}%</p>
      ) : null}

      {missingFields.length > 0 ? (
        <div className="mt-4 space-y-2">
          <p className="text-sm font-semibold text-[var(--color-text)]">{t.profile.missingFields}</p>
          <ul className="list-disc space-y-1 ps-5 text-sm text-[var(--color-muted)]">
            {missingFields.map((field) => (
              <li key={field}>{fieldLabels[field] ?? field}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </Card>
  );
}
