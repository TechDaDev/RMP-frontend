"use client";

import Link from "next/link";
import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { PublicAuthLayout } from "@/components/layouts/PublicAuthLayout";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { PageHeader } from "@/components/ui/PageHeader";

export default function LoginPage() {
  const { t } = useAppPreferences();

  return (
    <PublicAuthLayout title={t.auth.loginTitle} subtitle={t.auth.loginSubtitle}>
      <div className="space-y-6">
        <PageHeader
          badge={<Badge tone="primary">{t.common.previewLogin}</Badge>}
          title={t.auth.loginTitle}
          description={t.auth.loginPreviewNotice}
        />

        <form className="space-y-4" onSubmit={(event) => event.preventDefault()}>
          <Input id="login-email" name="email" type="email" label={t.auth.emailLabel} placeholder="name@example.com" required dir="ltr" />
          <Input id="login-password" name="password" type="password" label={t.auth.passwordLabel} placeholder="••••••••" required dir="ltr" />

          <label className="flex items-center gap-2 text-sm text-[var(--color-muted)]">
            <input type="checkbox" name="remember-me" className="h-4 w-4 rounded border-[var(--color-border)]" />
            <span>{t.auth.rememberMe}</span>
          </label>

          <Button type="submit" fullWidth>
            {t.auth.enterPlatform}
          </Button>
        </form>

        <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
          <button type="button" className="text-[var(--color-primary)] hover:underline">
            {t.auth.forgotPassword}
          </button>
          <p className="text-[var(--color-muted)]">
            {t.auth.noAccount} <Link href="/register" className="font-semibold text-[var(--color-primary)] hover:underline">{t.auth.createAccount}</Link>
          </p>
        </div>
      </div>
    </PublicAuthLayout>
  );
}