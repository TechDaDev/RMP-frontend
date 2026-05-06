import type { ReactNode } from "react";

interface FeatureCardProps {
  title: string;
  desc: string;
  icon?: ReactNode;
}

export function FeatureCard({ title, desc, icon = "●" }: FeatureCardProps) {
  return (
    <article className="group rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--card-shadow)] transition duration-300 hover:-translate-y-1.5 hover:shadow-[var(--card-shadow-lg)]">
      <span className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-surface-alt)] text-sm font-bold text-[var(--color-primary)]">
        {icon}
      </span>
      <h3 className="text-lg font-semibold text-[var(--color-text)]">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">{desc}</p>
    </article>
  );
}
