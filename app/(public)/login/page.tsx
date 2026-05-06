"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { useAuth } from "@/components/auth/AuthProvider";
import { PublicAuthLayout } from "@/components/layouts/PublicAuthLayout";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { PageHeader } from "@/components/ui/PageHeader";
import { ApiError } from "@/lib/api/errors";

export default function LoginPage() {
  const { t } = useAppPreferences();
  const { login } = useAuth();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const form = event.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;

    try {
      await login({ email, password });
      // login() loads the profile; redirect based on user_type is handled in portal entry
      router.push("/app");
    } catch (err) {
      if (err instanceof ApiError) {
        // Inactive account → direct to activate page
        if (err.status === 403 || (err.message && err.message.toLowerCase().includes("active"))) {
          setError(t.auth.errorAccountInactive);
        } else if (err.status === 401 || err.status === 400) {
          setError(t.auth.errorInvalidCredentials);
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
    <PublicAuthLayout title={t.auth.loginTitle} subtitle={t.auth.loginSubtitle}>
      <div className="space-y-6">
        <PageHeader
          title={t.auth.loginTitle}
          description={t.auth.loginSubtitle}
        />

        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input id="login-email" name="email" type="email" label={t.auth.emailLabel} placeholder="name@example.com" required dir="ltr" />
          <Input id="login-password" name="password" type="password" label={t.auth.passwordLabel} placeholder="••••••••" required dir="ltr" />

          {error ? (
            <p role="alert" className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300">
              {error}
            </p>
          ) : null}

          <Button type="submit" fullWidth disabled={loading}>
            {loading ? t.auth.loggingIn : t.auth.enterPlatform}
          </Button>
        </form>

        <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
          <Link href="/password-reset" className="text-[var(--color-primary)] hover:underline">
            {t.auth.forgotPassword}
          </Link>
          <p className="text-[var(--color-muted)]">
            {t.auth.noAccount} <Link href="/register" className="font-semibold text-[var(--color-primary)] hover:underline">{t.auth.createAccount}</Link>
          </p>
        </div>
      </div>
    </PublicAuthLayout>
  );
}