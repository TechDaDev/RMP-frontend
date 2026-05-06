"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { PublicAuthLayout } from "@/components/layouts/PublicAuthLayout";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { PageHeader } from "@/components/ui/PageHeader";
import { activateAccountService, resendActivationOtpService } from "@/lib/auth/authService";
import { ApiError } from "@/lib/api/errors";

function ActivateForm() {
  const { t } = useAppPreferences();
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email") ?? "";

  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendMessage, setResendMessage] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const form = event.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value.trim();
    const code = (form.elements.namedItem("code") as HTMLInputElement).value.trim();

    try {
      await activateAccountService({ email, code });
      router.push("/login");
    } catch (err) {
      if (err instanceof ApiError) {
        const details = err.fieldErrors;
        if (details) {
          setError(Object.values(details).flat().join(" "));
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

  async function handleResend() {
    if (!emailParam) return;
    setResendMessage(null);
    setError(null);
    setResending(true);
    try {
      await resendActivationOtpService({ email: emailParam });
      setResendMessage(t.auth.resendOtpSent);
    } catch {
      setError(t.auth.errorGeneric);
    } finally {
      setResending(false);
    }
  }

  return (
    <PublicAuthLayout title={t.auth.activateTitle} subtitle={t.auth.activateSubtitle}>
      <div className="space-y-6">
        <PageHeader title={t.auth.activateTitle} description={t.auth.activateSubtitle} />

        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input
            id="activate-email"
            name="email"
            type="email"
            label={t.auth.emailLabel}
            defaultValue={emailParam}
            required
            dir="ltr"
          />
          <Input
            id="activate-code"
            name="code"
            label={t.auth.otpLabel}
            placeholder="000000"
            required
            dir="ltr"
            maxLength={6}
          />

          {error ? (
            <p role="alert" className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300">
              {error}
            </p>
          ) : null}

          {resendMessage ? (
            <p role="status" className="rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-300">
              {resendMessage}
            </p>
          ) : null}

          <Button type="submit" fullWidth disabled={loading}>
            {loading ? t.auth.activating : t.auth.activateAction}
          </Button>
        </form>

        <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
          <button
            type="button"
            className="text-[var(--color-primary)] hover:underline disabled:opacity-50"
            onClick={handleResend}
            disabled={resending}
          >
            {t.auth.resendOtp}
          </button>
          <Link href="/login" className="text-[var(--color-muted)] hover:underline">
            {t.auth.haveAccount}
          </Link>
        </div>
      </div>
    </PublicAuthLayout>
  );
}

export default function ActivatePage() {
  return (
    <Suspense>
      <ActivateForm />
    </Suspense>
  );
}
