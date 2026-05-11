import type { ReactNode } from "react";

interface FeatureCardProps {
  title: string;
  desc: string;
  icon?: ReactNode;
}

export function FeatureCard({ title, desc, icon }: FeatureCardProps) {
  return (
    <article className="group rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--card-shadow)] transition duration-300 hover:-translate-y-1.5 hover:border-[var(--color-primary)] hover:shadow-[var(--card-shadow-lg)]">
      {icon != null && (
        <span className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-[color:color-mix(in_srgb,var(--color-primary)_10%,var(--color-surface-alt))] text-[var(--color-primary)] transition group-hover:bg-[color:color-mix(in_srgb,var(--color-primary)_18%,var(--color-surface-alt))]">
          {icon}
        </span>
      )}
      <h3 className="text-base font-bold text-[var(--color-text)]">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">{desc}</p>
    </article>
  );
}

