"use client";

import Link from "next/link";
import { useState } from "react";
import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { PublicAuthLayout } from "@/components/layouts/PublicAuthLayout";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { PageHeader } from "@/components/ui/PageHeader";
import { registrationRoles, roleMetadata } from "@/lib/roles";
import type { UserRole } from "@/types/roles";

export default function RegisterPage() {
  const { locale, t } = useAppPreferences();
  const [selectedRole, setSelectedRole] = useState<UserRole>("patient");

  return (
    <PublicAuthLayout title={t.auth.registerTitle} subtitle={t.auth.registerSubtitle}>
      <div className="space-y-6">
        <PageHeader
          badge={<Badge tone="primary">{t.common.previewBadge}</Badge>}
          title={t.auth.registerTitle}
          description={t.auth.registerPreviewNotice}
        />

        <form className="space-y-5" onSubmit={(event) => event.preventDefault()}>
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <label className="text-sm font-semibold text-[var(--color-text)]">{t.auth.chooseAccountType}</label>
              <Badge tone="neutral">{t.common.accountType}</Badge>
            </div>

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

          <Input id="register-name" name="name" label={t.auth.nameLabel} placeholder={t.auth.nameLabel} required />
          <Input id="register-email" name="email" type="email" label={t.auth.emailLabel} placeholder="name@example.com" required dir="ltr" />
          <Input id="register-password" name="password" type="password" label={t.auth.passwordLabel} placeholder="••••••••" required dir="ltr" />

          <Button type="submit" fullWidth>
            {t.auth.registerAction}
          </Button>
        </form>

        <p className="text-sm text-[var(--color-muted)]">
          {t.auth.haveAccount} <Link href="/login" className="font-semibold text-[var(--color-primary)] hover:underline">{t.auth.loginTitle}</Link>
        </p>
      </div>
    </PublicAuthLayout>
  );
}