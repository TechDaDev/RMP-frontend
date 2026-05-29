import type { BackendUser, ProfilesMeResponse } from "@/types/backend";

export type EffectiveRole =
  | "patient"
  | "doctor"
  | "pharmacist"
  | "laboratorian"
  | "admin"
  | "financial"
  | null;

function extractStaffRole(user: BackendUser | null, profile: ProfilesMeResponse | null): string | null {
  const roleFromUserProfile = user?.staff_profile?.staff_role;
  const roleFromUser = user?.staff_role;
  const roleFromProfile =
    profile && typeof profile === "object"
      ? (
          (profile as { staff_profile?: { staff_role?: string | null } }).staff_profile?.staff_role
          ?? ((profile.role_profile as { staff_role?: string | null } | null | undefined)?.staff_role)
        )
      : null;

  return roleFromUserProfile ?? roleFromUser ?? roleFromProfile ?? null;
}

export function resolveEffectiveRole(args: {
  user: BackendUser | null;
  profile: ProfilesMeResponse | null;
  adminAccess: boolean;
}): EffectiveRole {
  const { user, profile, adminAccess } = args;

  const staffRole = extractStaffRole(user, profile);
  if (staffRole === "financial") {
    return "financial";
  }

  if (adminAccess) {
    return "admin";
  }

  const userType = user?.user_type;
  if (
    userType === "patient"
    || userType === "doctor"
    || userType === "pharmacist"
    || userType === "laboratorian"
    || userType === "admin"
  ) {
    return userType;
  }

  return null;
}

export function canAccessFinanceDashboard(role: EffectiveRole): boolean {
  return role === "admin" || role === "financial";
}

export function canAccessClinicalAdmin(role: EffectiveRole): boolean {
  return role === "admin";
}

export function getDashboardRoute(role: EffectiveRole): string {
  switch (role) {
    case "patient":
      return "/app/patient";
    case "doctor":
      return "/app/doctor";
    case "pharmacist":
      return "/app/pharmacist";
    case "laboratorian":
      return "/app/lab";
    case "admin":
      return "/app/admin";
    case "financial":
      return "/app/financial";
    default:
      return "/app";
  }
}
