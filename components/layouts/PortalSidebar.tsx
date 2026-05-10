import Link from "next/link";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { CloseIcon, LogOutIcon, UserIcon } from "@/components/icons";
import { Badge } from "@/components/ui/Badge";
import { buttonClassName } from "@/components/ui/Button";
import type { BackendUser } from "@/types/backend";
import type { Locale, Translations } from "@/types/i18n";
import type { Theme } from "@/lib/theme";
import { PortalNavItem } from "./PortalNavItem";
import type { PortalNavItem as PortalNavItemModel } from "./portalNav";

interface PortalSidebarProps {
  locale: Locale;
  theme: Theme;
  t: Translations;
  user: BackendUser | null;
  currentRoleLabel: string;
  navItems: PortalNavItemModel[];
  activeHref: string | null;
  onLocaleChange: (locale: Locale) => void;
  onThemeToggle: () => void;
  onLogout: () => void;
  onNavigate?: () => void;
  onClose?: () => void;
  showClose?: boolean;
}

function displayName(user: BackendUser | null, fallback: string): string {
  if (!user) {
    return fallback;
  }

  const fullName = user.full_name?.trim();
  if (fullName) {
    return fullName;
  }

  const builtName = `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim();
  return builtName || user.email || fallback;
}

export function PortalSidebar({
  locale,
  theme,
  t,
  user,
  currentRoleLabel,
  navItems,
  activeHref,
  onLocaleChange,
  onThemeToggle,
  onLogout,
  onNavigate,
  onClose,
  showClose = false,
}: PortalSidebarProps) {
  return (
    <div className="flex h-full min-h-0 flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <Link href="/" className="focus-ring min-w-0 rounded-xl" onClick={onNavigate}>
          <Logo locale={locale} />
        </Link>
        {showClose ? (
          <button
            type="button"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] transition hover:bg-[var(--color-surface-alt)] lg:hidden"
            onClick={onClose}
            aria-label={t.ui.closePortalNavigation}
          >
            <CloseIcon size={18} />
          </button>
        ) : null}
      </div>

      <div className="rounded-2xl border border-[var(--color-border)] bg-[color:color-mix(in_srgb,var(--color-primary)_5%,var(--color-surface))] p-3">
        <Badge tone="primary" className="px-2.5 py-0.5">{t.portal.currentRole}</Badge>
        <p className="mt-2 break-words text-sm font-bold text-[var(--color-text)]">{currentRoleLabel}</p>
        <p className="mt-1 text-xs leading-6 text-[var(--color-muted)]">{user ? t.portal.connectedNotice : t.portal.previewNotice}</p>
      </div>

      <nav className="min-h-0 space-y-1.5 overflow-y-auto pe-1" aria-label={t.ui.portalNavigation}>
        {navItems.map((item) => (
          <PortalNavItem
            key={item.href}
            item={item}
            active={activeHref === item.href}
            onNavigate={onNavigate}
          />
        ))}
      </nav>

      <div className="mt-auto space-y-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-3">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--color-surface-alt)] text-[var(--color-primary)]" aria-hidden="true">
            <UserIcon size={17} />
          </span>
          <div className="min-w-0">
            <p className="break-words text-sm font-bold leading-5 text-[var(--color-text)]">{displayName(user, t.portal.demoUser)}</p>
            <p className="break-words text-xs leading-5 text-[var(--color-muted)]">{user ? user.email : currentRoleLabel}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <LanguageSwitcher locale={locale} onChange={onLocaleChange} t={t} compact onAfterChange={onNavigate} ariaLabel={t.ui.languageSwitcherLabel} />
          <ThemeToggle theme={theme} onToggle={onThemeToggle} t={t} compact ariaLabel={t.ui.themeToggleLabel} />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Link href="/" className={buttonClassName({ variant: "secondary", className: "min-w-0 px-3 text-xs" })} onClick={onNavigate}>
            {t.common.backToHome}
          </Link>
          <button
            type="button"
            className={buttonClassName({ variant: "ghost", className: "min-w-0 px-3 text-xs" })}
            onClick={() => {
              onNavigate?.();
              onLogout();
            }}
          >
            <LogOutIcon size={15} />
            <span className="min-w-0 truncate">{t.portal.logout}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
