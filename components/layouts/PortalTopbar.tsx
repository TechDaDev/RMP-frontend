import { MenuIcon, UserIcon } from "@/components/icons";
import type { BackendUser } from "@/types/backend";
import type { Translations } from "@/types/i18n";

interface PortalTopbarProps {
  t: Translations;
  currentRoleLabel: string;
  user: BackendUser | null;
  menuOpen: boolean;
  onMenuOpen: () => void;
}

function userInitial(user: BackendUser | null): string {
  const source = user?.full_name || user?.first_name || user?.email || "";
  return source.trim().charAt(0).toUpperCase();
}

export function PortalTopbar({ t, currentRoleLabel, user, menuOpen, onMenuOpen }: PortalTopbarProps) {
  const initial = userInitial(user);

  return (
    <header className="sticky top-3 z-30 rounded-2xl border border-[color:color-mix(in_srgb,var(--color-border)_72%,transparent)] bg-[color:color-mix(in_srgb,var(--color-bg)_88%,transparent)] px-3 py-2.5 backdrop-blur-md">
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] transition hover:bg-[var(--color-surface-alt)] lg:hidden"
          onClick={onMenuOpen}
          aria-label={t.ui.openPortalNavigation}
          aria-controls="portal-mobile-navigation"
          aria-expanded={menuOpen}
        >
          <MenuIcon size={18} />
        </button>

        <div className="min-w-0 flex-1">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-[var(--color-muted)]">{t.portal.dashboard}</p>
          <h2 className="truncate text-base font-bold text-[var(--color-text)]">{currentRoleLabel}</h2>
        </div>

        <div className="hidden min-w-0 items-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-2.5 py-1.5 md:flex">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[var(--color-surface-alt)] text-xs font-bold text-[var(--color-primary)]" aria-hidden="true">
            {initial || <UserIcon size={15} />}
          </span>
          <span className="max-w-44 truncate text-xs font-semibold text-[var(--color-text)]">
            {user?.full_name || user?.email || currentRoleLabel}
          </span>
        </div>
      </div>
    </header>
  );
}
