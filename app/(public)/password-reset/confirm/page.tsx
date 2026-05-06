"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { PublicAuthLayout } from "@/components/layouts/PublicAuthLayout";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { PageHeader } from "@/components/ui/PageHeader";
import { confirmPasswordResetService } from "@/lib/auth/authService";
import { ApiError } from "@/lib/api/errors";

function PasswordResetConfirmForm() {
  const { t } = useAppPreferences();
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email") ?? "";

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading) return;
    setError(null);
    setLoading(true);

    const form = event.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value.trim();
    const code = (form.elements.namedItem("code") as HTMLInputElement).value.trim();
    const new_password = (form.elements.namedItem("new_password") as HTMLInputElement).value;
    const new_password_confirm = (form.elements.namedItem("new_password_confirm") as HTMLInputElement).value;

    try {
      await confirmPasswordResetService({ email, code, new_password, new_password_confirm });
      router.push("/login");
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 0) {
          setError(t.auth.networkError);
        } else if (err.fieldErrors) {
          setError(Object.values(err.fieldErrors).flat().join(" "));
        } else {
          setError(err.message || t.auth.errorGeneric);
        }
      } else {
        setError(t.auth.errorGeneric);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <PublicAuthLayout title={t.auth.passwordResetConfirmTitle} subtitle={t.auth.passwordResetConfirmSubtitle}>
      <div className="space-y-6">
        <PageHeader title={t.auth.passwordResetConfirmTitle} description={t.auth.passwordResetConfirmSubtitle} />

        <form className="space-y-4" onSubmit={handleSubmit} noValidate>
          <Input
            id="confirm-email"
            name="email"
            type="email"
            label={t.auth.emailLabel}
            defaultValue={emailParam}
            required
            dir="ltr"
            autoComplete="email"
          />
          <Input
            id="confirm-code"
            name="code"
            label={t.auth.otpLabel}
            placeholder="000000"
            required
            dir="ltr"
            maxLength={6}
            autoComplete="one-time-code"
          />
          <PasswordInput
            id="confirm-new-password"
            name="new_password"
            label={t.auth.newPasswordLabel}
            placeholder="••••••••"
            required
            autoComplete="new-password"
          />
          <PasswordInput
            id="confirm-new-password-confirm"
            name="new_password_confirm"
            label={t.auth.newPasswordConfirmLabel}
            placeholder="••••••••"
            required
            autoComplete="new-password"
          />

          {error ? (
            <p role="alert" className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300">
              {error}
            </p>
          ) : null}

          <Button type="submit" fullWidth disabled={loading}>
            {loading ? t.auth.sendingReset : t.auth.passwordResetConfirmAction}
          </Button>
        </form>

        <Link href="/login" className="block text-center text-sm text-[var(--color-muted)] hover:underline">
          {t.auth.haveAccount}
        </Link>
      </div>
    </PublicAuthLayout>
  );
}

export default function PasswordResetConfirmPage() {
  return (
    <Suspense>
      <PasswordResetConfirmForm />
    </Suspense>
  );
}
