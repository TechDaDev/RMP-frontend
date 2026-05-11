"use client";

import { useCallback, useMemo, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { useAuth } from "@/components/auth/AuthProvider";
import { Badge } from "@/components/ui/Badge";
import { roleMetadata } from "@/lib/roles";
import type { UserRole } from "@/types/roles";
import { PortalMobileDrawer } from "./PortalMobileDrawer";
import { PortalSidebar } from "./PortalSidebar";
import { PortalTopbar } from "./PortalTopbar";
import { getActivePortalNavHref, getPortalNavItems } from "./portalNav";

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

  const navItems = useMemo(() => getPortalNavItems(user?.user_type, t), [t, user?.user_type]);
  const activeHref = useMemo(() => getActivePortalNavHref(pathname, navItems), [navItems, pathname]);

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
  }, []);

  function handleLogout() {
    logout();
    router.push("/login");
  }

  const sidebar = (
    <PortalSidebar
      locale={locale}
      theme={theme}
      t={t}
      user={user}
      currentRoleLabel={currentRoleLabel}
      navItems={navItems}
      activeHref={activeHref}
      onLocaleChange={setLocale}
      onThemeToggle={toggleTheme}
      onLogout={handleLogout}
      onNavigate={closeMenu}
    />
  );

  return (
    <div className="min-h-screen overflow-x-hidden bg-transparent">
      <div className="container-grid flex min-h-screen gap-5 py-3 md:py-5">
        <aside className="hidden w-72 shrink-0 lg:block xl:w-76">
          <div className="sticky top-5 max-h-[calc(100vh-2.5rem)] overflow-hidden rounded-3xl border border-[var(--color-border)] bg-[color:color-mix(in_srgb,var(--color-surface)_94%,transparent)] p-4 shadow-[var(--card-shadow)] backdrop-blur">
            {sidebar}
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col gap-4">
          <PortalTopbar
            t={t}
            currentRoleLabel={currentRoleLabel}
            user={user}
            menuOpen={menuOpen}
            onMenuOpen={() => setMenuOpen(true)}
          />

          {verification?.required && verification.is_approved === true ? (
            <div role="status" className="rounded-2xl border border-green-200 bg-green-50 px-4 py-2.5 text-sm font-medium text-green-700 break-words dark:border-green-800 dark:bg-green-950 dark:text-green-300">
              <Badge tone="success" className="me-2">✓</Badge>
              {t.auth.verificationApprovedBadge}
            </div>
          ) : verification?.required && !verification.is_approved ? (
            verification.status === "pending" ? (
              <div role="status" className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm font-medium text-amber-800 break-words dark:border-amber-800 dark:bg-amber-950 dark:text-amber-200">
                <span className="font-bold">{t.auth.verificationPendingTitle}:</span> {t.auth.verificationPendingDesc}
              </div>
            ) : verification.status === "rejected" ? (
              <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-medium text-red-700 break-words dark:border-red-800 dark:bg-red-950 dark:text-red-300">
                <span className="font-bold">{t.auth.verificationRejectedTitle}:</span> {t.auth.verificationRejectedDesc}
              </div>
            ) : verification.status === "suspended" ? (
              <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-medium text-red-700 break-words dark:border-red-800 dark:bg-red-950 dark:text-red-300">
                <span className="font-bold">{t.auth.verificationSuspendedTitle}:</span> {t.auth.verificationSuspendedDesc}
              </div>
            ) : null
          ) : null}

          <main id="portal-content" className="flex-1 pb-6">
            {children}
          </main>
        </div>
      </div>

      <PortalMobileDrawer open={menuOpen} locale={locale} t={t} onClose={closeMenu}>
        <PortalSidebar
          locale={locale}
          theme={theme}
          t={t}
          user={user}
          currentRoleLabel={currentRoleLabel}
          navItems={navItems}
          activeHref={activeHref}
          onLocaleChange={setLocale}
          onThemeToggle={toggleTheme}
          onLogout={handleLogout}
          onNavigate={closeMenu}
          onClose={closeMenu}
          showClose
        />
      </PortalMobileDrawer>
    </div>
  );
}
