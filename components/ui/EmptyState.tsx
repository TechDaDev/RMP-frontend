import type { ReactNode } from "react";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description: string;
}

export function EmptyState({ icon, title, description }: EmptyStateProps) {
  return (
    <div className="rounded-3xl border border-dashed border-[var(--color-border)] bg-[color:color-mix(in_srgb,var(--color-surface-alt)_70%,var(--color-surface))] p-6 text-center">
      {icon ? <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--color-surface)] text-[var(--color-primary)]">{icon}</div> : null}
      <h3 className="text-base font-bold text-[var(--color-text)]">{title}</h3>
      <p className="mt-2 text-sm leading-7 text-[var(--color-muted)]">{description}</p>
    </div>
  );
}