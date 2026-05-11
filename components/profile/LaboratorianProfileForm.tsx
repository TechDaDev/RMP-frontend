"use client";

import { useEffect, useState } from "react";
import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { useAuth } from "@/components/auth/AuthProvider";
import { ProfileSaveStatus } from "@/components/profile/ProfileSaveStatus";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { ApiError } from "@/lib/api/errors";
import { updateLaboratorianProfile } from "@/lib/profile/profileService";
import type { LaboratorianProfileData } from "@/types/backend";

interface LaboratorianProfileFormProps {
  profile: LaboratorianProfileData | null;
}

export function LaboratorianProfileForm({ profile }: LaboratorianProfileFormProps) {
  const { t } = useAppPreferences();
  const { refreshProfile } = useAuth();
  const [laboratorianLicenseNumber, setLaboratorianLicenseNumber] = useState("");
  const [laboratoryName, setLaboratoryName] = useState("");
  const [laboratoryLicenseNumber, setLaboratoryLicenseNumber] = useState("");
  const [laboratoryAddress, setLaboratoryAddress] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [workingHours, setWorkingHours] = useState("");
  const [laboratorianLicenseImage, setLaboratorianLicenseImage] = useState<File | null>(null);
  const [laboratoryLicenseImage, setLaboratoryLicenseImage] = useState<File | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLaboratorianLicenseNumber(profile?.laboratorian_license_number ?? "");
    setLaboratoryName(profile?.laboratory_name ?? "");
    setLaboratoryLicenseNumber(profile?.laboratory_license_number ?? "");
    setLaboratoryAddress(profile?.laboratory_address ?? "");
    setSpecialization(profile?.specialization ?? "");
    setWorkingHours(profile?.working_hours ?? "");
    setLaboratorianLicenseImage(null);
    setLaboratoryLicenseImage(null);
  }, [profile]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (saving) return;

    setSaving(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    setFieldErrors({});

    try {
      await updateLaboratorianProfile({
        laboratorian_license_number: laboratorianLicenseNumber,
        laboratorian_license_image: laboratorianLicenseImage,
        laboratory_name: laboratoryName,
        laboratory_license_number: laboratoryLicenseNumber,
        laboratory_license_image: laboratoryLicenseImage,
        laboratory_address: laboratoryAddress,
        specialization: specialization,
        working_hours: workingHours,
      });
      await refreshProfile();
      setSuccessMessage(t.profile.savedSuccessfully);
      setLaboratorianLicenseImage(null);
      setLaboratoryLicenseImage(null);
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 0) {
          setErrorMessage(t.auth.networkError);
        } else {
          setFieldErrors(err.fieldErrors ?? {});
          setErrorMessage(err.message || t.profile.failedToSave);
        }
      } else {
        setErrorMessage(t.profile.failedToSave);
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card className="rounded-[2rem]">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-lg font-bold text-[var(--color-text)]">{t.profile.professionalInformation}</h3>
        <ProfileSaveStatus saving={saving} successMessage={successMessage} errorMessage={errorMessage} />
      </div>

      <form className="mt-4 space-y-4" onSubmit={handleSubmit} noValidate>
        <Input
          id="laboratorian-license-number"
          name="laboratorian_license_number"
          label={t.profile.licenseNumber}
          value={laboratorianLicenseNumber}
          onChange={(event) => setLaboratorianLicenseNumber(event.target.value)}
          dir="ltr"
          errorText={fieldErrors.laboratorian_license_number?.[0]}
        />
        <Input
          id="laboratory-name"
          name="laboratory_name"
          label={t.profile.laboratoryName}
          value={laboratoryName}
          onChange={(event) => setLaboratoryName(event.target.value)}
          errorText={fieldErrors.laboratory_name?.[0]}
        />
        <Input
          id="laboratory-license-number"
          name="laboratory_license_number"
          label={t.profile.laboratoryLicenseNumber}
          value={laboratoryLicenseNumber}
          onChange={(event) => setLaboratoryLicenseNumber(event.target.value)}
          dir="ltr"
          errorText={fieldErrors.laboratory_license_number?.[0]}
        />
        <Input
          id="laboratory-specialization"
          name="specialization"
          label={t.profile.specialization}
          value={specialization}
          onChange={(event) => setSpecialization(event.target.value)}
          errorText={fieldErrors.specialization?.[0]}
        />
        <Input
          id="laboratory-working-hours"
          name="working_hours"
          label={t.profile.workingHours}
          value={workingHours}
          onChange={(event) => setWorkingHours(event.target.value)}
          errorText={fieldErrors.working_hours?.[0]}
        />

        <label className="block space-y-2" htmlFor="laboratory-address">
          <span className="text-sm font-semibold text-[var(--color-text)]">{t.profile.address}</span>
          <textarea
            id="laboratory-address"
            className="min-h-24 w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text)] outline-none transition focus:border-[var(--color-primary)]"
            value={laboratoryAddress}
            onChange={(event) => setLaboratoryAddress(event.target.value)}
          />
        </label>

        <label className="block space-y-2" htmlFor="laboratorian-license-image">
          <span className="text-sm font-semibold text-[var(--color-text)]">{t.profile.licenseFile}</span>
          <input
            id="laboratorian-license-image"
            type="file"
            accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
            className="block w-full text-sm text-[var(--color-text)]"
            onChange={(event) => setLaboratorianLicenseImage(event.target.files?.[0] ?? null)}
          />
          <p className="text-xs text-[var(--color-muted)]">
            {laboratorianLicenseImage
              ? `${t.profile.selectedFile}: ${laboratorianLicenseImage.name}`
              : t.profile.noFileSelected}
          </p>
        </label>

        <label className="block space-y-2" htmlFor="laboratory-license-image">
          <span className="text-sm font-semibold text-[var(--color-text)]">{t.profile.laboratoryLicenseFile}</span>
          <input
            id="laboratory-license-image"
            type="file"
            accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
            className="block w-full text-sm text-[var(--color-text)]"
            onChange={(event) => setLaboratoryLicenseImage(event.target.files?.[0] ?? null)}
          />
          <p className="text-xs text-[var(--color-muted)]">
            {laboratoryLicenseImage
              ? `${t.profile.selectedFile}: ${laboratoryLicenseImage.name}`
              : t.profile.noFileSelected}
          </p>
          {fieldErrors.laboratory_license_image?.[0] ? (
            <span className="block text-xs font-medium text-red-600 dark:text-red-300">{fieldErrors.laboratory_license_image[0]}</span>
          ) : null}
        </label>

        <Button type="submit" className="w-full sm:w-auto" disabled={saving}>
          {saving ? t.profile.saving : t.profile.saveChanges}
        </Button>
      </form>
    </Card>
  );
}
