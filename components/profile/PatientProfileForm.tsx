"use client";

import { useEffect, useState } from "react";
import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { useAuth } from "@/components/auth/AuthProvider";
import { ProfileSaveStatus } from "@/components/profile/ProfileSaveStatus";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { ApiError } from "@/lib/api/errors";
import { updatePatientProfile } from "@/lib/profile/profileService";
import type { PatientProfileData } from "@/types/backend";

interface PatientProfileFormProps {
  profile: PatientProfileData | null;
}

export function PatientProfileForm({ profile }: PatientProfileFormProps) {
  const { t } = useAppPreferences();
  const { refreshProfile } = useAuth();
  const [socialSecurityId, setSocialSecurityId] = useState("");
  const [emergencyContactName, setEmergencyContactName] = useState("");
  const [emergencyContactPhone, setEmergencyContactPhone] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSocialSecurityId(profile?.social_security_id ?? "");
    setEmergencyContactName(profile?.emergency_contact_name ?? "");
    setEmergencyContactPhone(profile?.emergency_contact_phone ?? "");
  }, [profile]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (saving) return;

    setSaving(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    setFieldErrors({});

    try {
      await updatePatientProfile({
        social_security_id: socialSecurityId,
        emergency_contact_name: emergencyContactName,
        emergency_contact_phone: emergencyContactPhone,
      });
      await refreshProfile();
      setSuccessMessage(t.profile.savedSuccessfully);
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
          id="patient-social-security"
          name="social_security_id"
          label={t.profile.socialSecurityId}
          value={socialSecurityId}
          onChange={(event) => setSocialSecurityId(event.target.value)}
          dir="ltr"
          errorText={fieldErrors.social_security_id?.[0]}
        />
        <Input
          id="patient-emergency-contact-name"
          name="emergency_contact_name"
          label={t.profile.emergencyContactName}
          value={emergencyContactName}
          onChange={(event) => setEmergencyContactName(event.target.value)}
          errorText={fieldErrors.emergency_contact_name?.[0]}
        />
        <Input
          id="patient-emergency-contact-phone"
          name="emergency_contact_phone"
          label={t.profile.emergencyContactPhone}
          value={emergencyContactPhone}
          onChange={(event) => setEmergencyContactPhone(event.target.value)}
          dir="ltr"
          errorText={fieldErrors.emergency_contact_phone?.[0]}
        />

        <Button type="submit" disabled={saving}>
          {saving ? t.profile.saving : t.profile.saveChanges}
        </Button>
      </form>
    </Card>
  );
}
