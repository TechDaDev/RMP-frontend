import Link from "next/link";
import type { ReactNode } from "react";
import { Card } from "@/components/ui/Card";

type DashboardStatTone = "neutral" | "primary" | "success" | "info" | "warning" | "danger";

interface DashboardStatCardProps {
  label: string;
  value: ReactNode;
  description?: string;
  icon?: ReactNode;
  tone?: DashboardStatTone;
  href?: string;
  surface?: "card" | "panel";
}

const toneClasses = {
  neutral: "text-[var(--color-muted)] bg-[var(--color-surface-alt)]",
  primary: "text-[var(--color-primary)] bg-[color:color-mix(in_srgb,var(--color-primary)_10%,var(--color-surface))]",
  success: "text-green-700 bg-green-50 dark:text-green-300 dark:bg-green-950",
  info: "text-blue-700 bg-blue-50 dark:text-blue-300 dark:bg-blue-950",
  warning: "text-amber-700 bg-amber-50 dark:text-amber-300 dark:bg-amber-950",
  danger: "text-red-700 bg-red-50 dark:text-red-300 dark:bg-red-950",
} satisfies Record<DashboardStatTone, string>;

export function DashboardStatCard({
  label,
  value,
  description,
  icon,
  tone = "neutral",
  href,
  surface = "card",
}: DashboardStatCardProps) {
  const content = (
    <>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="break-words text-sm font-medium text-[var(--color-muted)]">{label}</p>
          <p className="mt-3 break-words text-3xl font-black text-[var(--color-text)]">{value ?? "—"}</p>
        </div>
        {icon ? (
          <span
            className={["flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl", toneClasses[tone]].join(" ")}
            aria-hidden="true"
          >
            {icon}
          </span>
        ) : null}
      </div>
      {description ? (
        <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">{description}</p>
      ) : null}
    </>
  );

  if (surface === "panel") {
    return (
      <div className="h-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-4">
        {content}
      </div>
    );
  }

  if (href) {
    return (
      <Link href={href} className="focus-ring block h-full rounded-3xl">
        <Card hoverable className="h-full">
          {content}
        </Card>
      </Link>
    );
  }

  return <Card className="h-full">{content}</Card>;
}
