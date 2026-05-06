"use client";

import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { useAuth } from "@/components/auth/AuthProvider";
import { CompletionStatusCard } from "@/components/profile/CompletionStatusCard";
import { ProfileHeaderCard } from "@/components/profile/ProfileHeaderCard";
import { RoleProfileForm } from "@/components/profile/RoleProfileForm";
import { UserProfileForm } from "@/components/profile/UserProfileForm";
import { VerificationStatusCard } from "@/components/profile/VerificationStatusCard";
import { AppLoading } from "@/components/ui/AppLoading";
import { Badge } from "@/components/ui/Badge";
import { PageHeader } from "@/components/ui/PageHeader";

export default function ProfilePage() {
  const { t } = useAppPreferences();
  const { loading, user, profile } = useAuth();

  if (loading) {
    return <AppLoading />;
  }

  if (!user || !profile) {
    return (
      <div className="rounded-3xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300">
        {t.profile.failedToLoad}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        badge={<Badge tone="primary">{t.portal.profile}</Badge>}
        title={t.portal.profile}
        description={t.profile.profilePageSubtitle}
      />

      <ProfileHeaderCard />
      <CompletionStatusCard />
      <VerificationStatusCard />
      <UserProfileForm />
      <RoleProfileForm />
    </div>
  );
}
