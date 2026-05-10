import type { ReactNode } from "react";
import { CheckCircleIcon, FileTextIcon, PulseIcon, ShieldIcon } from "@/components/icons";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";

type DashboardState = "loading" | "error" | "empty" | "success";

interface DashboardStateCardProps {
  state: DashboardState;
  title?: string;
  description: string;
  action?: ReactNode;
  icon?: ReactNode;
}

const stateTone = {
  loading: "border-[var(--color-border)]",
  error: "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950",
  empty: "border-[var(--color-border)]",
  success: "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950",
} satisfies Record<DashboardState, string>;

const stateIcon = {
  loading: <PulseIcon size={20} />,
  error: <ShieldIcon size={20} />,
  empty: <FileTextIcon size={20} />,
  success: <CheckCircleIcon size={20} />,
} satisfies Record<DashboardState, ReactNode>;

export function DashboardStateCard({
  state,
  title,
  description,
  action,
  icon,
}: DashboardStateCardProps) {
  if (state === "empty") {
    return (
      <div className="space-y-4">
        <EmptyState icon={icon ?? stateIcon.empty} title={title ?? description} description={description} />
        {action ? <div className="flex flex-wrap gap-2">{action}</div> : null}
      </div>
    );
  }

  return (
    <Card className={["space-y-4", stateTone[state]].join(" ")}>
      <div className="flex items-start gap-3">
        <span
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[var(--color-surface-alt)] text-[var(--color-primary)]"
          aria-hidden="true"
        >
          {icon ?? stateIcon[state]}
        </span>
        <div className="min-w-0">
          {title ? <h3 className="text-base font-bold text-[var(--color-text)]">{title}</h3> : null}
          <p className="text-sm leading-7 text-[var(--color-muted)]">{description}</p>
        </div>
      </div>
      {action ? <div className="flex flex-wrap gap-2">{action}</div> : null}
    </Card>
  );
}
