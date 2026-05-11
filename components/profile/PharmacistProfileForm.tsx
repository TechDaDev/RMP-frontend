"use client";

import { useEffect, useState } from "react";
import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { useAuth } from "@/components/auth/AuthProvider";
import { ProfileSaveStatus } from "@/components/profile/ProfileSaveStatus";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { ApiError } from "@/lib/api/errors";
import { updatePharmacistProfile } from "@/lib/profile/profileService";
import type { PharmacistProfileData } from "@/types/backend";

interface PharmacistProfileFormProps {
  profile: PharmacistProfileData | null;
}

export function PharmacistProfileForm({ profile }: PharmacistProfileFormProps) {
  const { t } = useAppPreferences();
  const { refreshProfile } = useAuth();
  const [pharmacistLicenseNumber, setPharmacistLicenseNumber] = useState("");
  const [pharmacyName, setPharmacyName] = useState("");
  const [pharmacyLicenseNumber, setPharmacyLicenseNumber] = useState("");
  const [pharmacyAddress, setPharmacyAddress] = useState("");
  const [workingHours, setWorkingHours] = useState("");
  const [pharmacistLicenseImage, setPharmacistLicenseImage] = useState<File | null>(null);
  const [pharmacyLicenseImage, setPharmacyLicenseImage] = useState<File | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPharmacistLicenseNumber(profile?.pharmacist_license_number ?? "");
    setPharmacyName(profile?.pharmacy_name ?? "");
    setPharmacyLicenseNumber(profile?.pharmacy_license_number ?? "");
    setPharmacyAddress(profile?.pharmacy_address ?? "");
    setWorkingHours(profile?.working_hours ?? "");
    setPharmacistLicenseImage(null);
    setPharmacyLicenseImage(null);
  }, [profile]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (saving) return;

    setSaving(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    setFieldErrors({});

    try {
      await updatePharmacistProfile({
        pharmacist_license_number: pharmacistLicenseNumber,
        pharmacist_license_image: pharmacistLicenseImage,
        pharmacy_name: pharmacyName,
        pharmacy_license_number: pharmacyLicenseNumber,
        pharmacy_license_image: pharmacyLicenseImage,
        pharmacy_address: pharmacyAddress,
        working_hours: workingHours,
      });
      await refreshProfile();
      setSuccessMessage(t.profile.savedSuccessfully);
      setPharmacistLicenseImage(null);
      setPharmacyLicenseImage(null);
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
          id="pharmacist-license-number"
          name="pharmacist_license_number"
          label={t.profile.licenseNumber}
          value={pharmacistLicenseNumber}
          onChange={(event) => setPharmacistLicenseNumber(event.target.value)}
          dir="ltr"
          errorText={fieldErrors.pharmacist_license_number?.[0]}
        />
        <Input
          id="pharmacy-name"
          name="pharmacy_name"
          label={t.profile.pharmacyName}
          value={pharmacyName}
          onChange={(event) => setPharmacyName(event.target.value)}
          errorText={fieldErrors.pharmacy_name?.[0]}
        />
        <Input
          id="pharmacy-license-number"
          name="pharmacy_license_number"
          label={t.profile.pharmacyLicenseNumber}
          value={pharmacyLicenseNumber}
          onChange={(event) => setPharmacyLicenseNumber(event.target.value)}
          dir="ltr"
          errorText={fieldErrors.pharmacy_license_number?.[0]}
        />
        <Input
          id="pharmacy-working-hours"
          name="working_hours"
          label={t.profile.workingHours}
          value={workingHours}
          onChange={(event) => setWorkingHours(event.target.value)}
          errorText={fieldErrors.working_hours?.[0]}
        />

        <label className="block space-y-2" htmlFor="pharmacy-address">
          <span className="text-sm font-semibold text-[var(--color-text)]">{t.profile.address}</span>
          <textarea
            id="pharmacy-address"
            className="min-h-24 w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text)] outline-none transition focus:border-[var(--color-primary)]"
            value={pharmacyAddress}
            onChange={(event) => setPharmacyAddress(event.target.value)}
          />
        </label>

        <label className="block space-y-2" htmlFor="pharmacist-license-image">
          <span className="text-sm font-semibold text-[var(--color-text)]">{t.profile.licenseFile}</span>
          <input
            id="pharmacist-license-image"
            type="file"
            accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
            className="block w-full text-sm text-[var(--color-text)]"
            onChange={(event) => setPharmacistLicenseImage(event.target.files?.[0] ?? null)}
          />
          <p className="text-xs text-[var(--color-muted)]">
            {pharmacistLicenseImage
              ? `${t.profile.selectedFile}: ${pharmacistLicenseImage.name}`
              : t.profile.noFileSelected}
          </p>
        </label>

        <label className="block space-y-2" htmlFor="pharmacy-license-image">
          <span className="text-sm font-semibold text-[var(--color-text)]">{t.profile.pharmacyLicenseFile}</span>
          <input
            id="pharmacy-license-image"
            type="file"
            accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
            className="block w-full text-sm text-[var(--color-text)]"
            onChange={(event) => setPharmacyLicenseImage(event.target.files?.[0] ?? null)}
          />
          <p className="text-xs text-[var(--color-muted)]">
            {pharmacyLicenseImage
              ? `${t.profile.selectedFile}: ${pharmacyLicenseImage.name}`
              : t.profile.noFileSelected}
          </p>
          {fieldErrors.pharmacy_license_image?.[0] ? (
            <span className="block text-xs font-medium text-red-600 dark:text-red-300">{fieldErrors.pharmacy_license_image[0]}</span>
          ) : null}
        </label>

        <Button type="submit" className="w-full sm:w-auto" disabled={saving}>
          {saving ? t.profile.saving : t.profile.saveChanges}
        </Button>
      </form>
    </Card>
  );
}
