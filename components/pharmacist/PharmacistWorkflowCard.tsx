import type { ComponentType } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { buttonClassName } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import type { IconProps } from "@/components/icons";

interface PharmacistWorkflowCardProps {
  title: string;
  subtitle: string;
  status: string;
  statusTone?: "neutral" | "primary" | "success" | "info" | "warning" | "danger";
  actionLabel: string;
  icon: ComponentType<IconProps>;
  href?: string;
  disabled?: boolean;
}

export function PharmacistWorkflowCard({
  title,
  subtitle,
  status,
  statusTone = "neutral",
  actionLabel,
  icon: Icon,
  href,
  disabled = false,
}: PharmacistWorkflowCardProps) {
  const content = (
    <>
      <div className="flex items-start justify-between gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--color-surface)] text-[var(--color-primary)]">
          <Icon size={18} />
        </div>
        <Badge tone={statusTone}>{status}</Badge>
      </div>

      <h3 className="mt-4 text-base font-semibold text-[var(--color-text)]">{title}</h3>
      <p className="mt-2 text-sm leading-7 text-[var(--color-muted)]">{subtitle}</p>

      <div className="mt-4">
        {href && !disabled ? (
          <Link href={href} className={buttonClassName({ variant: "secondary", className: "w-full" })}>
            {actionLabel}
          </Link>
        ) : (
          <span
            className={buttonClassName({
              variant: "secondary",
              className: "w-full cursor-not-allowed opacity-60",
            })}
            aria-disabled="true"
          >
            {actionLabel}
          </span>
        )}
      </div>
    </>
  );

  return (
    <Card className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-4">
      {content}
    </Card>
  );
}
