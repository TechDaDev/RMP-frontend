"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { useAuth } from "@/components/auth/AuthProvider";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  BellIcon,
  CloseIcon,
  GridIcon,
  LogOutIcon,
  MenuIcon,
  MessageIcon,
  SettingsIcon,
  UserIcon,
} from "@/components/icons";
import { Badge } from "@/components/ui/Badge";
import { Button, buttonClassName } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { portalRoles, roleMetadata } from "@/lib/roles";
import type { UserRole } from "@/types/roles";

interface PortalShellProps {
  children: ReactNode;
}

function activeRoleFromPath(pathname: string): UserRole | undefined {
  if (pathname.startsWith("/app/patient")) return "patient";
  if (pathname.startsWith("/app/doctor")) return "doctor";
  if (pathname.startsWith("/app/pharmacist")) return "pharmacist";
  if (pathname.startsWith("/app/lab")) return "laboratory";
  if (pathname.startsWith("/app/admin")) return "admin";
  return undefined;
}

export function PortalShell({ children }: PortalShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const { locale, theme, t, setLocale, toggleTheme } = useAppPreferences();
  const { user, logout, verification } = useAuth();
  const activeRole = activeRoleFromPath(pathname);
  const currentRoleLabel = activeRole ? roleMetadata[activeRole].labels[locale] : t.portal.chooseRole;

  function handleLogout() {
    logout();
    router.push("/login");
  }

  const sidebar = (
    <div className="flex h-full flex-col gap-5">
      <div className="flex items-center justify-between gap-3 lg:block">
        <Link href="/" className="focus-ring rounded-xl" onClick={() => setMenuOpen(false)}>
          <Logo locale={locale} />
        </Link>
        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] lg:hidden"
          onClick={() => setMenuOpen(false)}
          aria-label={t.ui.closePortalNavigation}
        >
          <CloseIcon size={18} />
        </button>
      </div>

      <Card className="rounded-[2rem] bg-[color:color-mix(in_srgb,var(--color-primary)_8%,var(--color-surface))] p-4">
        <Badge tone="primary">{t.portal.currentRole}</Badge>
        <p className="mt-3 text-base font-bold text-[var(--color-text)]">{currentRoleLabel}</p>
        <p className="mt-2 text-sm leading-7 text-[var(--color-muted)]">{t.portal.previewNotice}</p>
      </Card>

      <nav className="space-y-2" aria-label={t.ui.portalNavigation}>
        <Link
          href="/app"
          className={buttonClassName({
            variant: pathname === "/app" ? "primary" : "ghost",
            className: "w-full justify-start rounded-2xl",
          })}
          onClick={() => setMenuOpen(false)}
        >
          <GridIcon size={18} />
          {t.portal.dashboard}
        </Link>
        <Link
          href="/app/profile"
          className={buttonClassName({
            variant: pathname === "/app/profile" ? "primary" : "ghost",
            className: "w-full justify-start rounded-2xl",
          })}
          onClick={() => setMenuOpen(false)}
        >
          <UserIcon size={18} />
          {t.portal.profile}
        </Link>
        {portalRoles.map((role) => {
          const meta = roleMetadata[role];
          const isActive = meta.defaultRoute === pathname;
          return (
            <Link
              key={role}
              href={meta.defaultRoute}
              className={buttonClassName({
                variant: isActive ? "secondary" : "ghost",
                className: "w-full justify-start rounded-2xl",
              })}
              onClick={() => setMenuOpen(false)}
            >
              <meta.Icon size={18} />
              {meta.labels[locale]}
            </Link>
          );
        })}
      </nav>

        <div className="mt-auto space-y-3 rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--color-surface-alt)] text-[var(--color-primary)]">
            <UserIcon size={18} />
          </span>
          <div>
            <p className="text-sm font-bold text-[var(--color-text)]">{user ? user.full_name ?? `${user.first_name} ${user.last_name}`.trim() : t.portal.demoUser}</p>
            <p className="text-xs text-[var(--color-muted)]">{user ? user.email : currentRoleLabel}</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <LanguageSwitcher locale={locale} onChange={setLocale} t={t} compact onAfterChange={() => setMenuOpen(false)} ariaLabel={t.ui.languageSwitcherLabel} />
          <ThemeToggle theme={theme} onToggle={toggleTheme} t={t} compact ariaLabel={t.ui.themeToggleLabel} />
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/" className={buttonClassName({ variant: "secondary", className: "flex-1" })} onClick={() => setMenuOpen(false)}>
            {t.common.backToHome}
          </Link>
          <button
            type="button"
            className={buttonClassName({ variant: "ghost", className: "flex-1" })}
            onClick={() => { setMenuOpen(false); handleLogout(); }}
          >
            <LogOutIcon size={16} />
            {t.portal.logout}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-transparent">
      <div className="container-grid flex min-h-screen gap-6 py-4 md:py-6">
        <aside className="hidden w-80 shrink-0 lg:block">{sidebar}</aside>

        <div className="flex min-w-0 flex-1 flex-col gap-4">
          <header className="sticky top-3 z-30 rounded-[2rem] border border-[var(--color-border)] bg-[color:color-mix(in_srgb,var(--color-bg)_90%,transparent)] px-4 py-3 backdrop-blur-md">
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] lg:hidden"
                onClick={() => setMenuOpen(true)}
                aria-label={t.ui.openPortalNavigation}
              >
                <MenuIcon size={18} />
              </button>

              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-muted)]">{t.portal.dashboard}</p>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <h2 className="text-lg font-bold text-[var(--color-text)]">{currentRoleLabel}</h2>
                  <Badge tone="success">{t.common.previewBadge}</Badge>
                </div>
              </div>

              <div className="hidden items-center gap-2 md:flex">
                <Button variant="ghost" aria-label={t.portal.notifications}>
                  <BellIcon size={18} />
                  <span className="hidden lg:inline">{t.portal.notifications}</span>
                </Button>
                <Button variant="ghost" aria-label={t.portal.messages}>
                  <MessageIcon size={18} />
                  <span className="hidden lg:inline">{t.portal.messages}</span>
                </Button>
                <Button variant="ghost" aria-label={t.portal.settings}>
                  <SettingsIcon size={18} />
                  <span className="hidden lg:inline">{t.portal.settings}</span>
                </Button>
              </div>
            </div>
          </header>

          {/* Verification / info banner */}
          {verification?.required && verification.is_approved === true ? (
            <div role="status" className="rounded-[2rem] border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-300">
              ✓ {t.auth.verificationApprovedBadge}
            </div>
          ) : verification?.required && !verification.is_approved ? (
            verification.status === "pending" ? (
              <div role="status" className="rounded-[2rem] border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-200">
                <span className="font-bold">{t.auth.verificationPendingTitle}:</span> {t.auth.verificationPendingDesc}
              </div>
            ) : verification.status === "rejected" ? (
              <div role="alert" className="rounded-[2rem] border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300">
                <span className="font-bold">{t.auth.verificationRejectedTitle}:</span> {t.auth.verificationRejectedDesc}
              </div>
            ) : verification.status === "suspended" ? (
              <div role="alert" className="rounded-[2rem] border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300">
                <span className="font-bold">{t.auth.verificationSuspendedTitle}:</span> {t.auth.verificationSuspendedDesc}
              </div>
            ) : null
          ) : null}

          <main id="portal-content" className="flex-1 pb-6">
            {children}
          </main>
        </div>
      </div>

      {menuOpen ? (
        <div className="fixed inset-0 z-40 bg-[rgba(3,10,20,0.4)] lg:hidden" role="presentation">
          <button
            type="button"
            className="absolute inset-0 h-full w-full"
            onClick={() => setMenuOpen(false)}
            aria-label={t.ui.closePortalNavigation}
          />
          <div className="relative z-10 h-full max-w-xs bg-[var(--color-bg)] p-4 shadow-2xl">{sidebar}</div>
        </div>
      ) : null}
    </div>
  );
}