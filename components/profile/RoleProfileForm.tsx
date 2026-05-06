"use client";

import { useAuth } from "@/components/auth/AuthProvider";
import { DoctorProfileForm } from "@/components/profile/DoctorProfileForm";
import { LaboratorianProfileForm } from "@/components/profile/LaboratorianProfileForm";
import { PatientProfileForm } from "@/components/profile/PatientProfileForm";
import { PharmacistProfileForm } from "@/components/profile/PharmacistProfileForm";
import type {
  DoctorProfileData,
  LaboratorianProfileData,
  PatientProfileData,
  PharmacistProfileData,
} from "@/types/backend";

export function RoleProfileForm() {
  const { user, profile } = useAuth();

  if (!user || !profile) {
    return null;
  }

  if (user.user_type === "patient") {
    return <PatientProfileForm profile={profile.role_profile as PatientProfileData | null} />;
  }

  if (user.user_type === "doctor") {
    return <DoctorProfileForm profile={profile.role_profile as DoctorProfileData | null} />;
  }

  if (user.user_type === "pharmacist") {
    return (
      <PharmacistProfileForm profile={profile.role_profile as PharmacistProfileData | null} />
    );
  }

  if (user.user_type === "laboratorian") {
    return (
      <LaboratorianProfileForm
        profile={profile.role_profile as LaboratorianProfileData | null}
      />
    );
  }

  return null;
}
