import type { ReactNode } from "react";

interface DashboardSectionProps {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
}

export function DashboardSection({
  eyebrow,
  title,
  description,
  actions,
  children,
}: DashboardSectionProps) {
  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          {eyebrow ? (
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-muted)]">
              {eyebrow}
            </p>
          ) : null}
          <h2 className="text-lg font-bold text-[var(--color-text)] md:text-xl">{title}</h2>
          {description ? (
            <p className="mt-1 max-w-3xl text-sm leading-7 text-[var(--color-muted)]">
              {description}
            </p>
          ) : null}
        </div>
        {actions ? <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div> : null}
      </div>
      {children}
    </section>
  );
}
