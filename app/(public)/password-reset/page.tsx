"use client";

import Link from "next/link";
import { useState } from "react";
import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { PublicAuthLayout } from "@/components/layouts/PublicAuthLayout";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { PageHeader } from "@/components/ui/PageHeader";
import { requestPasswordResetService } from "@/lib/auth/authService";
import { ApiError } from "@/lib/api/errors";

export default function PasswordResetPage() {
  const { t } = useAppPreferences();
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const form = event.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value.trim();
    setSubmittedEmail(email);

    try {
      await requestPasswordResetService({ email });
      setSent(true);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message || t.auth.errorGeneric);
      } else {
        setError(t.auth.errorGeneric);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <PublicAuthLayout title={t.auth.passwordResetTitle} subtitle={t.auth.passwordResetSubtitle}>
      <div className="space-y-6">
        <PageHeader title={t.auth.passwordResetTitle} description={t.auth.passwordResetSubtitle} />

        {sent ? (
          <div className="space-y-4">
            <p className="rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-300">
              {t.auth.passwordResetSent}
            </p>
            <Link
              href={`/password-reset/confirm?email=${encodeURIComponent(submittedEmail)}`}
              className="block text-center text-sm font-semibold text-[var(--color-primary)] hover:underline"
            >
              {t.auth.passwordResetConfirmTitle} →
            </Link>
          </div>
        ) : (
          <form className="space-y-4" onSubmit={handleSubmit}>
            <Input id="reset-email" name="email" type="email" label={t.auth.emailLabel} placeholder="name@example.com" required dir="ltr" />

            {error ? (
              <p role="alert" className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300">
                {error}
              </p>
            ) : null}

            <Button type="submit" fullWidth disabled={loading}>
              {loading ? t.auth.sendingReset : t.auth.passwordResetAction}
            </Button>
          </form>
        )}

        <Link href="/login" className="block text-center text-sm text-[var(--color-muted)] hover:underline">
          {t.auth.haveAccount}
        </Link>
      </div>
    </PublicAuthLayout>
  );
}
