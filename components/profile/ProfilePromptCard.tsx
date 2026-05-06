"use client";

import Link from "next/link";
import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { useAuth } from "@/components/auth/AuthProvider";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { buttonClassName } from "@/components/ui/Button";

export function ProfilePromptCard() {
  const { t } = useAppPreferences();
  const { completion, verification } = useAuth();

  const profileIncomplete = completion?.overall_complete === false;
  const verificationPending = verification?.required && verification.status === "pending";

  if (!profileIncomplete && !verificationPending) {
    return null;
  }

  return (
    <Card className="rounded-[2rem]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-2">
          {profileIncomplete ? (
            <p className="text-sm font-semibold text-[var(--color-text)]">{t.profile.completeProfilePrompt}</p>
          ) : null}
          {verificationPending ? (
            <p className="text-sm font-semibold text-[var(--color-text)]">{t.profile.pendingVerificationPrompt}</p>
          ) : null}
        </div>
        <div className="flex items-center gap-2">
          {profileIncomplete ? <Badge tone="primary">{t.profile.profileIncomplete}</Badge> : null}
          {verificationPending ? <Badge tone="primary">{t.profile.verificationPending}</Badge> : null}
          <Link href="/app/profile" className={buttonClassName({ variant: "secondary" })}>
            {t.portal.profile}
          </Link>
        </div>
      </div>
    </Card>
  );
}
