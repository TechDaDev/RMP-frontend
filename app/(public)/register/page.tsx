"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { PublicAuthLayout } from "@/components/layouts/PublicAuthLayout";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { PageHeader } from "@/components/ui/PageHeader";
import { registerService } from "@/lib/auth/authService";
import { registrationRoles, roleMetadata } from "@/lib/roles";
import { ApiError } from "@/lib/api/errors";
import type { UserRole } from "@/types/roles";

export default function RegisterPage() {
  const { locale, t } = useAppPreferences();
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<UserRole>("patient");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading) return;
    setError(null);
    setLoading(true);

    const form = event.currentTarget;
    const first_name = (form.elements.namedItem("first_name") as HTMLInputElement).value.trim();
    const last_name = (form.elements.namedItem("last_name") as HTMLInputElement).value.trim();
    const email = (form.elements.namedItem("email") as HTMLInputElement).value.trim();
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;
    const password_confirm = (form.elements.namedItem("password_confirm") as HTMLInputElement).value;

    try {
      await registerService({
        first_name,
        last_name,
        email,
        password,
        password_confirm,
        user_type: selectedRole as import("@/types/backend").BackendUserType,
      });
      router.push(`/activate?email=${encodeURIComponent(email)}`);
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 0) {
          setError(t.auth.networkError);
        } else if (err.fieldErrors) {
          const messages = Object.values(err.fieldErrors).flat().join(" ");
          setError(messages || t.auth.errorGeneric);
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
    <PublicAuthLayout title={t.auth.registerTitle} subtitle={t.auth.registerSubtitle}>
      <div className="space-y-6">
        <PageHeader
          title={t.auth.registerTitle}
          description={t.auth.registerSubtitle}
        />

        <form className="space-y-5" onSubmit={handleSubmit} noValidate>
          <div className="space-y-3">
            <label className="text-sm font-semibold text-[var(--color-text)]">{t.auth.chooseAccountType}</label>
            <div className="grid gap-3 sm:grid-cols-2">
              {registrationRoles.map((role) => {
                const meta = roleMetadata[role];
                const selected = selectedRole === role;
                return (
                  <button
                    key={role}
                    type="button"
                    className={[
                      "rounded-3xl border p-4 text-start transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]",
                      selected
                        ? "border-[var(--color-primary)] bg-[color:color-mix(in_srgb,var(--color-primary)_8%,var(--color-surface))]"
                        : "border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-primary)]",
                    ].join(" ")}
                    onClick={() => setSelectedRole(role)}
                    aria-pressed={selected}
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--color-surface-alt)] text-[var(--color-primary)]">
                      <meta.Icon size={18} />
                    </span>
                    <p className="mt-3 text-sm font-bold text-[var(--color-text)]">{meta.labels[locale]}</p>
                    <p className="mt-2 text-xs leading-6 text-[var(--color-muted)]">{meta.description[locale]}</p>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              id="register-first-name"
              name="first_name"
              label={t.auth.firstNameLabel}
              placeholder={t.auth.firstNameLabel}
              required
              autoComplete="given-name"
            />
            <Input
              id="register-last-name"
              name="last_name"
              label={t.auth.lastNameLabel}
              placeholder={t.auth.lastNameLabel}
              required
              autoComplete="family-name"
            />
          </div>
          <Input
            id="register-email"
            name="email"
            type="email"
            label={t.auth.emailLabel}
            placeholder="name@example.com"
            required
            dir="ltr"
            autoComplete="email"
          />
          <PasswordInput
            id="register-password"
            name="password"
            label={t.auth.passwordLabel}
            placeholder="••••••••"
            required
            autoComplete="new-password"
          />
          <PasswordInput
            id="register-password-confirm"
            name="password_confirm"
            label={t.auth.passwordConfirmLabel}
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
            {loading ? t.auth.registering : t.auth.registerAction}
          </Button>
        </form>

        <p className="text-sm text-[var(--color-muted)]">
          {t.auth.haveAccount}{" "}
          <Link href="/login" className="font-semibold text-[var(--color-primary)] hover:underline">
            {t.auth.loginTitle}
          </Link>
        </p>
      </div>
    </PublicAuthLayout>
  );
}