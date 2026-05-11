"use client";

import { useEffect, useState } from "react";
import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { useAuth } from "@/components/auth/AuthProvider";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { ApiError } from "@/lib/api/errors";
import { updateUserProfile } from "@/lib/profile/profileService";
import { ProfileSaveStatus } from "@/components/profile/ProfileSaveStatus";

/**
 * Shared user profile form for all user types.
 * Updates the common UserProfile with fields required by all roles:
 * - phone_number, gender, date_of_birth, governorate, district, address, national_id
 * 
 * Note: Role-specific profile fields are handled by separate forms
 * (DoctorProfileForm, PharmacistProfileForm, LaboratorianProfileForm, PatientProfileForm)
 * See test_users.md for complete field mappings per role.
 */
interface UserProfileFormState {
  phone_number: string;
  gender: string;
  date_of_birth: string;
  governorate: string;
  district: string;
  address: string;
  national_id: string;
  profile_image: File | null;
}

const initialState: UserProfileFormState = {
  phone_number: "",
  gender: "",
  date_of_birth: "",
  governorate: "",
  district: "",
  address: "",
  national_id: "",
  profile_image: null,
};

export function UserProfileForm() {
  const { t } = useAppPreferences();
  const { profile, refreshProfile } = useAuth();
  const [form, setForm] = useState<UserProfileFormState>(initialState);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const userProfile = profile?.user_profile;
    if (!userProfile) {
      return;
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setForm((prev) => ({
      ...prev,
      phone_number: userProfile.phone_number ?? "",
      gender: userProfile.gender ?? "",
      date_of_birth: userProfile.date_of_birth ?? "",
      governorate: userProfile.governorate ?? "",
      district: userProfile.district ?? "",
      address: userProfile.address ?? "",
      national_id: userProfile.national_id ?? "",
      profile_image: null,
    }));
  }, [profile]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (saving) return;

    setSaving(true);
    setFieldErrors({});
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      await updateUserProfile({
        phone_number: form.phone_number,
        gender: form.gender,
        date_of_birth: form.date_of_birth || null,
        governorate: form.governorate,
        district: form.district,
        address: form.address,
        national_id: form.national_id,
        profile_image: form.profile_image,
      });
      await refreshProfile();
      setSuccessMessage(t.profile.savedSuccessfully);
      setForm((prev) => ({ ...prev, profile_image: null }));
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
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="break-words text-lg font-bold text-[var(--color-text)]">{t.profile.personalInformation}</h3>
        <ProfileSaveStatus
          saving={saving}
          successMessage={successMessage}
          errorMessage={errorMessage}
        />
      </div>

      <form className="mt-4 space-y-4" onSubmit={handleSubmit} noValidate>
        <div className="grid gap-4 md:grid-cols-2">
          <Input
            id="profile-phone"
            name="phone_number"
            label={t.profile.phone}
            value={form.phone_number}
            onChange={(event) => setForm((prev) => ({ ...prev, phone_number: event.target.value }))}
            dir="ltr"
            errorText={fieldErrors.phone_number?.[0]}
          />
          <label className="block space-y-2" htmlFor="profile-gender">
            <span className="text-sm font-semibold text-[var(--color-text)]">{t.profile.gender}</span>
            <select
              id="profile-gender"
              className="min-h-11 w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 text-sm text-[var(--color-text)] outline-none transition focus:border-[var(--color-primary)]"
              value={form.gender}
              onChange={(event) => setForm((prev) => ({ ...prev, gender: event.target.value }))}
            >
              <option value="">-</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </label>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Input
            id="profile-dob"
            name="date_of_birth"
            type="date"
            label={t.profile.dateOfBirth}
            value={form.date_of_birth}
            onChange={(event) => setForm((prev) => ({ ...prev, date_of_birth: event.target.value }))}
            dir="ltr"
            errorText={fieldErrors.date_of_birth?.[0]}
          />
          <Input
            id="profile-governorate"
            name="governorate"
            label={t.profile.governorate}
            value={form.governorate}
            onChange={(event) => setForm((prev) => ({ ...prev, governorate: event.target.value }))}
            errorText={fieldErrors.governorate?.[0]}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Input
            id="profile-district"
            name="district"
            label={t.profile.district}
            value={form.district}
            onChange={(event) => setForm((prev) => ({ ...prev, district: event.target.value }))}
            errorText={fieldErrors.district?.[0]}
          />
          <Input
            id="profile-national-id"
            name="national_id"
            label={t.profile.nationalId}
            value={form.national_id}
            onChange={(event) => setForm((prev) => ({ ...prev, national_id: event.target.value }))}
            dir="ltr"
            errorText={fieldErrors.national_id?.[0]}
          />
        </div>

        <label className="block space-y-2" htmlFor="profile-address">
          <span className="text-sm font-semibold text-[var(--color-text)]">{t.profile.address}</span>
          <textarea
            id="profile-address"
            className="min-h-24 w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text)] outline-none transition focus:border-[var(--color-primary)]"
            value={form.address}
            onChange={(event) => setForm((prev) => ({ ...prev, address: event.target.value }))}
          />
          {fieldErrors.address?.[0] ? (
            <span className="block text-xs font-medium text-red-600 dark:text-red-300">{fieldErrors.address[0]}</span>
          ) : null}
        </label>

        <label className="block space-y-2" htmlFor="profile-image">
          <span className="text-sm font-semibold text-[var(--color-text)]">{t.profile.profileImage}</span>
          <input
            id="profile-image"
            type="file"
            accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
            onChange={(event) =>
              setForm((prev) => ({
                ...prev,
                profile_image: event.target.files?.[0] ?? null,
              }))
            }
            className="block w-full text-sm text-[var(--color-text)]"
          />
          <p className="text-xs text-[var(--color-muted)]">
            {form.profile_image
              ? `${t.profile.selectedFile}: ${form.profile_image.name}`
              : t.profile.noFileSelected}
          </p>
          {fieldErrors.profile_image?.[0] ? (
            <span className="block text-xs font-medium text-red-600 dark:text-red-300">{fieldErrors.profile_image[0]}</span>
          ) : null}
        </label>

        <Button type="submit" className="w-full sm:w-auto" disabled={saving}>
          {saving ? t.profile.saving : t.profile.saveChanges}
        </Button>
      </form>
    </Card>
  );
}
