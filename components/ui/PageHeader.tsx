import type { ReactNode } from "react";

interface PageHeaderProps {
  badge?: ReactNode;
  title: string;
  description: string;
  actions?: ReactNode;
}

export function PageHeader({ badge, title, description, actions }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 rounded-3xl border border-[var(--color-border)] bg-[color:color-mix(in_srgb,var(--color-surface-alt)_42%,var(--color-surface))] p-6 shadow-[var(--card-shadow)] lg:flex-row lg:items-end lg:justify-between">
      <div className="space-y-3">
        {badge ? <div>{badge}</div> : null}
        <div>
          <h1 className="text-2xl font-extrabold text-[var(--color-text)] md:text-3xl">{title}</h1>
          <p className="mt-2 max-w-3xl text-sm leading-7 text-[var(--color-muted)] md:text-base">{description}</p>
        </div>
      </div>
      {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
    </div>
  );
}