import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { useAuth } from "@/components/auth/AuthProvider";
import { UserIcon } from "@/components/icons";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";

export function ProfileHeaderCard() {
  const { t } = useAppPreferences();
  const { user, profile, verification, effectiveRole } = useAuth();

  if (!user) {
    return null;
  }

  const fullName = user.full_name ?? `${user.first_name} ${user.last_name}`.trim();
  const profileImage = profile?.user_profile?.profile_image;

  return (
    <Card className="rounded-[2rem]">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          {profileImage ? (
            <span
              aria-hidden="true"
              className="h-14 w-14 rounded-2xl bg-cover bg-center"
              style={{ backgroundImage: `url(${profileImage})` }}
            />
          ) : (
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--color-surface-alt)] text-[var(--color-primary)]">
              <UserIcon size={22} />
            </span>
          )}
          <div className="min-w-0">
            <h2 className="break-words text-xl font-bold text-[var(--color-text)]">{fullName}</h2>
            <p className="truncate text-sm text-[var(--color-muted)]" dir="ltr">{user.email}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Badge tone={user.is_active ? "success" : "primary"}>
            {user.is_active ? t.profile.activeAccount : t.profile.inactiveAccount}
          </Badge>
          <Badge tone="primary">
            {effectiveRole === "admin"
              ? t.roles.admin
              : t.roles[user.user_type === "laboratorian" ? "laboratory" : user.user_type]}
          </Badge>
          {verification?.required ? (
            <Badge tone={verification.is_approved ? "success" : "primary"}>
              {verification.is_approved ? t.auth.verificationApprovedBadge : t.profile.verificationPending}
            </Badge>
          ) : (
            <Badge tone="neutral">{t.profile.verificationNotRequired}</Badge>
          )}
        </div>
      </div>
    </Card>
  );
}
