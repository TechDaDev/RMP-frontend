import type { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
}

export function Card({ hoverable = false, className, ...props }: CardProps) {
  return (
    <div
      className={[
        "rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--card-shadow)]",
        hoverable && "transition hover:-translate-y-1 hover:border-[var(--color-primary)]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    />
  );
}