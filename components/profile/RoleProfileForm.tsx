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

/**
 * Renders the appropriate role-specific profile form based on user type.
 * 
 * Field Summary (see test_users.md for complete details):
 * - Doctor: medical_license_number, specialty, professional_title, years_of_experience, bio, work_address, etc.
 * - Pharmacist: pharmacist_license_number, pharmacy_name, pharmacy_license_number, pharmacy_address, working_hours, etc.
 * - Laboratorian: laboratorian_license_number, laboratory_name, laboratory_address, specialization, working_hours, etc.
 * - Patient: social_security_id, emergency_contact_name, emergency_contact_phone
 * 
 * All professional roles include read-only verification fields:
 * - verification_status, verified_at, verified_by, verification_notes
 */
export function RoleProfileForm() {
  const { user, profile, effectiveRole } = useAuth();

  if (!user || !profile) {
    return null;
  }

  // Backend seeds admin with user_type="doctor" for model compatibility.
  // When effective role is admin, do not render doctor role-editing form.
  if (effectiveRole === "admin") {
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
