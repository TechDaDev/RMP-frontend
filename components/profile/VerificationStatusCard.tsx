import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { useAuth } from "@/components/auth/AuthProvider";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";

export function VerificationStatusCard() {
  const { t } = useAppPreferences();
  const { profile, verification } = useAuth();

  if (!verification) {
    return null;
  }

  const status = verification.status ?? "not_required";
  const verificationNotes =
    profile?.role_profile && "verification_notes" in profile.role_profile
      ? profile.role_profile.verification_notes
      : null;

  return (
    <Card className="rounded-[2rem]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-lg font-bold text-[var(--color-text)]">{t.profile.verificationStatus}</h3>
        <Badge tone={verification.is_approved ? "success" : "primary"}>
          {status === "approved"
            ? t.profile.verificationApproved
            : status === "pending"
              ? t.profile.verificationPending
              : status === "rejected"
                ? t.profile.verificationRejected
                : t.profile.verificationNotRequired}
        </Badge>
      </div>

      {!verification.required ? (
        <p className="mt-3 text-sm text-[var(--color-muted)]">{t.profile.verificationNotRequired}</p>
      ) : (
        <div className="mt-3 space-y-2 text-sm text-[var(--color-muted)]">
          {status === "rejected" && (verification.rejection_reason || verificationNotes) ? (
            <p>
              {t.profile.verificationRejected}: {verification.rejection_reason ?? verificationNotes}
            </p>
          ) : null}
          <p>{t.profile.verificationGuidance}</p>
        </div>
      )}
    </Card>
  );
}
