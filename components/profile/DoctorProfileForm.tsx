"use client";

import { useEffect, useState } from "react";
import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { useAuth } from "@/components/auth/AuthProvider";
import { ProfileSaveStatus } from "@/components/profile/ProfileSaveStatus";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { ApiError } from "@/lib/api/errors";
import { updateDoctorProfile } from "@/lib/profile/profileService";
import type { DoctorProfileData } from "@/types/backend";

interface DoctorProfileFormProps {
  profile: DoctorProfileData | null;
}

export function DoctorProfileForm({ profile }: DoctorProfileFormProps) {
  const { t } = useAppPreferences();
  const { refreshProfile } = useAuth();
  const [medicalLicenseNumber, setMedicalLicenseNumber] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [specialtyOther, setSpecialtyOther] = useState("");
  const [subspecialty, setSubspecialty] = useState("");
  const [professionalTitle, setProfessionalTitle] = useState("");
  const [yearsOfExperience, setYearsOfExperience] = useState("");
  const [bio, setBio] = useState("");
  const [workAddress, setWorkAddress] = useState("");
  const [licenseImage, setLicenseImage] = useState<File | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMedicalLicenseNumber(profile?.medical_license_number ?? "");
    setSpecialty(profile?.specialty ?? "");
    setSpecialtyOther(profile?.specialty_other ?? "");
    setSubspecialty(profile?.subspecialty ?? "");
    setProfessionalTitle(profile?.professional_title ?? "");
    setYearsOfExperience(
      typeof profile?.years_of_experience === "number"
        ? String(profile.years_of_experience)
        : "",
    );
    setBio(profile?.bio ?? "");
    setWorkAddress(profile?.work_address ?? "");
    setLicenseImage(null);
  }, [profile]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (saving) return;

    setSaving(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    setFieldErrors({});

    try {
      await updateDoctorProfile({
        medical_license_number: medicalLicenseNumber,
        medical_license_image: licenseImage,
        specialty,
        specialty_other: specialtyOther,
        subspecialty,
        professional_title: professionalTitle,
        years_of_experience: yearsOfExperience ? Number(yearsOfExperience) : null,
        bio,
        work_address: workAddress,
      });
      await refreshProfile();
      setSuccessMessage(t.profile.savedSuccessfully);
      setLicenseImage(null);
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
          id="doctor-license-number"
          name="medical_license_number"
          label={t.profile.licenseNumber}
          value={medicalLicenseNumber}
          onChange={(event) => setMedicalLicenseNumber(event.target.value)}
          dir="ltr"
          errorText={fieldErrors.medical_license_number?.[0]}
        />
        <Input
          id="doctor-specialty"
          name="specialty"
          label={t.profile.specialty}
          value={specialty}
          onChange={(event) => setSpecialty(event.target.value)}
          errorText={fieldErrors.specialty?.[0]}
        />
        <Input
          id="doctor-specialty-other"
          name="specialty_other"
          label={t.profile.specialtyOther}
          value={specialtyOther}
          onChange={(event) => setSpecialtyOther(event.target.value)}
          errorText={fieldErrors.specialty_other?.[0]}
        />
        <Input
          id="doctor-subspecialty"
          name="subspecialty"
          label={t.profile.subspecialty}
          value={subspecialty}
          onChange={(event) => setSubspecialty(event.target.value)}
          errorText={fieldErrors.subspecialty?.[0]}
        />
        <Input
          id="doctor-professional-title"
          name="professional_title"
          label={t.profile.professionalTitle}
          value={professionalTitle}
          onChange={(event) => setProfessionalTitle(event.target.value)}
          errorText={fieldErrors.professional_title?.[0]}
        />
        <Input
          id="doctor-years-experience"
          name="years_of_experience"
          type="number"
          label={t.profile.yearsOfExperience}
          value={yearsOfExperience}
          onChange={(event) => setYearsOfExperience(event.target.value)}
          errorText={fieldErrors.years_of_experience?.[0]}
        />

        <label className="block space-y-2" htmlFor="doctor-bio">
          <span className="text-sm font-semibold text-[var(--color-text)]">{t.profile.bio}</span>
          <textarea
            id="doctor-bio"
            className="min-h-24 w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text)] outline-none transition focus:border-[var(--color-primary)]"
            value={bio}
            onChange={(event) => setBio(event.target.value)}
          />
        </label>

        <label className="block space-y-2" htmlFor="doctor-work-address">
          <span className="text-sm font-semibold text-[var(--color-text)]">{t.profile.clinicWorkplace}</span>
          <textarea
            id="doctor-work-address"
            className="min-h-24 w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text)] outline-none transition focus:border-[var(--color-primary)]"
            value={workAddress}
            onChange={(event) => setWorkAddress(event.target.value)}
          />
        </label>

        <label className="block space-y-2" htmlFor="doctor-license-image">
          <span className="text-sm font-semibold text-[var(--color-text)]">{t.profile.licenseFile}</span>
          <input
            id="doctor-license-image"
            type="file"
            accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
            className="block w-full text-sm text-[var(--color-text)]"
            onChange={(event) => setLicenseImage(event.target.files?.[0] ?? null)}
          />
          <p className="text-xs text-[var(--color-muted)]">
            {licenseImage ? `${t.profile.selectedFile}: ${licenseImage.name}` : t.profile.noFileSelected}
          </p>
          {fieldErrors.medical_license_image?.[0] ? (
            <span className="block text-xs font-medium text-red-600 dark:text-red-300">{fieldErrors.medical_license_image[0]}</span>
          ) : null}
        </label>

        <Button type="submit" disabled={saving}>
          {saving ? t.profile.saving : t.profile.saveChanges}
        </Button>
      </form>
    </Card>
  );
}
