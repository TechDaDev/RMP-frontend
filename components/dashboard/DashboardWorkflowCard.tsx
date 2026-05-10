import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowIcon } from "@/components/icons";
import { Badge } from "@/components/ui/Badge";
import { buttonClassName } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

type DashboardWorkflowTone = "neutral" | "primary" | "success" | "info" | "warning" | "danger";

interface DashboardWorkflowCardProps {
  title: string;
  description: string;
  icon?: ReactNode;
  href?: string;
  actionLabel?: string;
  status?: string;
  statusTone?: DashboardWorkflowTone;
  disabled?: boolean;
  surface?: "card" | "panel";
}

export function DashboardWorkflowCard({
  title,
  description,
  icon,
  href,
  actionLabel,
  status,
  statusTone = "neutral",
  disabled = false,
  surface = "card",
}: DashboardWorkflowCardProps) {
  const hasAction = Boolean(actionLabel);
  const enabledLink = href && !disabled;

  const content = (
    <>
      <div className="flex items-start justify-between gap-3">
        {icon ? (
          <span
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--color-surface-alt)] text-[var(--color-primary)]"
            aria-hidden="true"
          >
            {icon}
          </span>
        ) : <span />}
        {status ? <Badge tone={statusTone}>{status}</Badge> : null}
      </div>

      <div className="min-w-0 space-y-2">
        <h3 className="break-words text-base font-bold text-[var(--color-text)]">{title}</h3>
        <p className="text-sm leading-7 text-[var(--color-muted)]">{description}</p>
      </div>

      {hasAction ? (
        <div className="mt-auto">
          {enabledLink ? (
            <Link href={href} className={buttonClassName({ variant: "secondary", className: "w-full" })}>
              <span className="min-w-0 truncate">{actionLabel}</span>
              <ArrowIcon size={16} />
            </Link>
          ) : (
            <span
              className={buttonClassName({
                variant: "secondary",
                className: "w-full cursor-not-allowed opacity-60",
              })}
              aria-disabled="true"
            >
              <span className="min-w-0 truncate">{actionLabel}</span>
            </span>
          )}
        </div>
      ) : null}
    </>
  );

  if (surface === "panel") {
    return (
      <div className="flex h-full flex-col gap-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-4">
        {content}
      </div>
    );
  }

  return (
    <Card className="flex h-full flex-col gap-4">
      {content}
    </Card>
  );
}
