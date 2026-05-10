import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import type { PortalNavItem as PortalNavItemModel } from "./portalNav";

interface PortalNavItemProps {
  item: PortalNavItemModel;
  active: boolean;
  onNavigate?: () => void;
}

export function PortalNavItem({ item, active, onNavigate }: PortalNavItemProps) {
  const Icon = item.icon;

  const content = (
    <>
      <span
        className={[
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-xl transition-colors",
          active
            ? "bg-white/15 text-white"
            : "bg-[color:color-mix(in_srgb,var(--color-surface-alt)_70%,var(--color-surface))] text-[var(--color-primary)]",
        ].join(" ")}
        aria-hidden="true"
      >
        <Icon size={17} />
      </span>
      <span className="min-w-0 flex-1 whitespace-normal break-words text-start leading-5">{item.label}</span>
      {item.badge ? <Badge tone={active ? "neutral" : "primary"}>{item.badge}</Badge> : null}
    </>
  );

  const className = [
    "group flex min-h-11 w-full items-center gap-3 rounded-2xl px-3 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]",
    active
      ? "bg-[linear-gradient(135deg,var(--color-primary),var(--color-secondary))] text-white shadow-[var(--card-shadow)]"
      : "text-[var(--color-text)] hover:bg-[var(--color-surface-alt)]",
    item.disabled ? "pointer-events-none cursor-not-allowed opacity-55" : "",
  ].join(" ");

  if (item.disabled) {
    return (
      <span className={className} aria-disabled="true">
        {content}
      </span>
    );
  }

  return (
    <Link href={item.href} className={className} onClick={onNavigate} aria-current={active ? "page" : undefined}>
      {content}
    </Link>
  );
}
