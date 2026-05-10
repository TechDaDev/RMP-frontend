import { useEffect, type ReactNode } from "react";
import type { Locale, Translations } from "@/types/i18n";

interface PortalMobileDrawerProps {
  open: boolean;
  locale: Locale;
  t: Translations;
  onClose: () => void;
  children: ReactNode;
}

export function PortalMobileDrawer({
  open,
  locale,
  t,
  onClose,
  children,
}: PortalMobileDrawerProps) {
  useEffect(() => {
    if (!open) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, open]);

  if (!open) {
    return null;
  }

  const isRtl = locale !== "en";

  return (
    <div className="fixed inset-0 z-40 bg-[rgba(3,10,20,0.4)] lg:hidden" role="presentation">
      <button
        type="button"
        className="absolute inset-0 h-full w-full cursor-default"
        onClick={onClose}
        aria-label={t.ui.closePortalNavigation}
      />
      <aside
        id="portal-mobile-navigation"
        role="dialog"
        aria-modal="true"
        aria-label={t.ui.portalNavigation}
        className={[
          "absolute top-0 h-full w-[min(20rem,calc(100vw-2rem))] overflow-y-auto overscroll-contain border-[var(--color-border)] bg-[var(--color-bg)] p-4 shadow-2xl",
          isRtl ? "right-0 border-l" : "left-0 border-r",
        ].join(" ")}
      >
        {children}
      </aside>
    </div>
  );
}
