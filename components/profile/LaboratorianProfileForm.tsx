"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { useAuth } from "@/components/auth/AuthProvider";
import { ProfileSaveStatus } from "@/components/profile/ProfileSaveStatus";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { ApiError } from "@/lib/api/errors";
import { getGovernorateDropdownOptions, resolveGovernorateCode } from "@/lib/locations/governorates";
import { updateLaboratorianProfile } from "@/lib/profile/profileService";
import type { LaboratorianProfileData, LaboratorianWorkingDay } from "@/types/backend";

const WORKING_DAY_OPTIONS: Array<{ value: LaboratorianWorkingDay; label: string }> = [
  { value: "saturday", label: "Saturday" },
  { value: "sunday", label: "Sunday" },
  { value: "monday", label: "Monday" },
  { value: "tuesday", label: "Tuesday" },
  { value: "wednesday", label: "Wednesday" },
  { value: "thursday", label: "Thursday" },
  { value: "friday", label: "Friday" },
];

function isWorkingDay(value: string): value is LaboratorianWorkingDay {
  return WORKING_DAY_OPTIONS.some((option) => option.value === value);
}

function normalizeWorkingDays(value: LaboratorianProfileData["working_days"]): LaboratorianWorkingDay[] {
  if (!value) {
    return [];
  }

  const items = Array.isArray(value)
    ? value
    : String(value)
        .split(/[\s,]+/)
        .map((item) => item.trim())
        .filter(Boolean);

  return items.filter(isWorkingDay);
}

interface LaboratorianProfileFormProps {
  profile: LaboratorianProfileData | null;
}

export function LaboratorianProfileForm({ profile }: LaboratorianProfileFormProps) {
  const { t, locale } = useAppPreferences();
  const { refreshProfile } = useAuth();
  const governorateOptions = useMemo(
    () => getGovernorateDropdownOptions(locale),
    [locale],
  );
  const [laboratorianLicenseNumber, setLaboratorianLicenseNumber] = useState("");
  const [laboratoryName, setLaboratoryName] = useState("");
  const [laboratoryLicenseNumber, setLaboratoryLicenseNumber] = useState("");
  const [laboratoryGovernorate, setLaboratoryGovernorate] = useState("");
  const [laboratoryPhoneNumber, setLaboratoryPhoneNumber] = useState("");
  const [laboratoryAddress, setLaboratoryAddress] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [workingDays, setWorkingDays] = useState<LaboratorianWorkingDay[]>([]);
  const [openingTime, setOpeningTime] = useState("");
  const [closingTime, setClosingTime] = useState("");
  const [laboratorianLicenseImage, setLaboratorianLicenseImage] = useState<File | null>(null);
  const [laboratoryLicenseImage, setLaboratoryLicenseImage] = useState<File | null>(null);
  const laboratorianLicenseImageRef = useRef<HTMLInputElement | null>(null);
  const laboratoryLicenseImageRef = useRef<HTMLInputElement | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLaboratorianLicenseNumber(profile?.laboratorian_license_number ?? "");
    setLaboratoryName(profile?.laboratory_name ?? "");
    setLaboratoryLicenseNumber(profile?.laboratory_license_number ?? "");
    setLaboratoryGovernorate(resolveGovernorateCode(profile?.laboratory_governorate ?? "") ?? profile?.laboratory_governorate ?? "");
    setLaboratoryPhoneNumber(profile?.laboratory_phone_number ?? "");
    setLaboratoryAddress(profile?.laboratory_address ?? "");
    setSpecialization(profile?.specialization ?? "");
    setWorkingDays(normalizeWorkingDays(profile?.working_days ?? []));
    setOpeningTime(profile?.opening_time ?? "");
    setClosingTime(profile?.closing_time ?? "");
    setLaboratorianLicenseImage(null);
    setLaboratoryLicenseImage(null);
    if (laboratorianLicenseImageRef.current) {
      laboratorianLicenseImageRef.current.value = "";
    }
    if (laboratoryLicenseImageRef.current) {
      laboratoryLicenseImageRef.current.value = "";
    }
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
        laboratory_governorate: laboratoryGovernorate,
        laboratory_phone_number: laboratoryPhoneNumber,
        specialization: specialization,
        working_days: workingDays,
        opening_time: openingTime || null,
        closing_time: closingTime || null,
      });
      await refreshProfile();
      setSuccessMessage(t.profile.savedSuccessfully);
      setLaboratorianLicenseImage(null);
      setLaboratoryLicenseImage(null);
      if (laboratorianLicenseImageRef.current) {
        laboratorianLicenseImageRef.current.value = "";
      }
      if (laboratoryLicenseImageRef.current) {
        laboratoryLicenseImageRef.current.value = "";
      }
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
        <label className="block space-y-2" htmlFor="laboratory-governorate">
          <span className="text-sm font-semibold text-[var(--color-text)]">{t.profile.laboratoryGovernorate}</span>
          <select
            id="laboratory-governorate"
            name="laboratory_governorate"
            className="min-h-11 w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 text-sm text-[var(--color-text)] outline-none transition focus:border-[var(--color-primary)]"
            value={laboratoryGovernorate}
            onChange={(event) => setLaboratoryGovernorate(event.target.value)}
          >
            <option value="">-</option>
            {governorateOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {fieldErrors.laboratory_governorate?.[0] ? (
            <span className="block text-xs font-medium text-red-600 dark:text-red-300">{fieldErrors.laboratory_governorate[0]}</span>
          ) : null}
        </label>
        <Input
          id="laboratory-phone-number"
          name="laboratory_phone_number"
          label={t.profile.laboratoryPhoneNumber}
          value={laboratoryPhoneNumber}
          onChange={(event) => setLaboratoryPhoneNumber(event.target.value)}
          dir="ltr"
          errorText={fieldErrors.laboratory_phone_number?.[0]}
        />
        <Input
          id="laboratory-specialization"
          name="specialization"
          label={t.profile.specialization}
          value={specialization}
          onChange={(event) => setSpecialization(event.target.value)}
          errorText={fieldErrors.specialization?.[0]}
        />

        <label className="block space-y-2" htmlFor="laboratory-address">
          <span className="text-sm font-semibold text-[var(--color-text)]">{t.profile.address}</span>
          <textarea
            id="laboratory-address"
            className="min-h-24 w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text)] outline-none transition focus:border-[var(--color-primary)]"
            value={laboratoryAddress}
            onChange={(event) => setLaboratoryAddress(event.target.value)}
          />
          {fieldErrors.laboratory_address?.[0] ? (
            <span className="block text-xs font-medium text-red-600 dark:text-red-300">{fieldErrors.laboratory_address[0]}</span>
          ) : null}
        </label>

        <div className="space-y-2">
          <span className="text-sm font-semibold text-[var(--color-text)]">{t.profile.workingDays}</span>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {WORKING_DAY_OPTIONS.map((option) => {
              const checked = workingDays.includes(option.value);
              return (
                <label
                  key={option.value}
                  className="flex items-center gap-2 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text)]"
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => {
                      setWorkingDays((prev) =>
                        prev.includes(option.value)
                          ? prev.filter((day) => day !== option.value)
                          : [...prev, option.value],
                      );
                    }}
                    className="h-4 w-4 rounded border-[var(--color-border)] text-[var(--color-primary)]"
                  />
                  <span>{option.label}</span>
                </label>
              );
            })}
          </div>
          {fieldErrors.working_days?.[0] ? (
            <span className="block text-xs font-medium text-red-600 dark:text-red-300">{fieldErrors.working_days[0]}</span>
          ) : null}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Input
            id="laboratory-opening-time"
            name="opening_time"
            type="time"
            label={t.profile.openingTime}
            value={openingTime}
            onChange={(event) => setOpeningTime(event.target.value)}
            dir="ltr"
            errorText={fieldErrors.opening_time?.[0]}
          />
          <Input
            id="laboratory-closing-time"
            name="closing_time"
            type="time"
            label={t.profile.closingTime}
            value={closingTime}
            onChange={(event) => setClosingTime(event.target.value)}
            dir="ltr"
            errorText={fieldErrors.closing_time?.[0]}
          />
        </div>

        <label className="block space-y-2" htmlFor="laboratorian-license-image">
          <span className="text-sm font-semibold text-[var(--color-text)]">{t.profile.licenseFile}</span>
          <input
            id="laboratorian-license-image"
            type="file"
            accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
            className="block w-full text-sm text-[var(--color-text)]"
            ref={laboratorianLicenseImageRef}
            onChange={(event) => setLaboratorianLicenseImage(event.target.files?.[0] ?? null)}
          />
          <p className="text-xs text-[var(--color-muted)]">
            {laboratorianLicenseImage
              ? `${t.profile.selectedFile}: ${laboratorianLicenseImage.name}`
              : t.profile.noFileSelected}
          </p>
          {fieldErrors.laboratorian_license_image?.[0] ? (
            <span className="block text-xs font-medium text-red-600 dark:text-red-300">{fieldErrors.laboratorian_license_image[0]}</span>
          ) : null}
        </label>

        <label className="block space-y-2" htmlFor="laboratory-license-image">
          <span className="text-sm font-semibold text-[var(--color-text)]">{t.profile.laboratoryLicenseFile}</span>
          <input
            id="laboratory-license-image"
            type="file"
            accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
            className="block w-full text-sm text-[var(--color-text)]"
            ref={laboratoryLicenseImageRef}
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
