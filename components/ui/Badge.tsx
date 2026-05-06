import type { HTMLAttributes } from "react";

type BadgeTone = "neutral" | "primary" | "success";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
}

export function Badge({ tone = "neutral", className, ...props }: BadgeProps) {
  const tones = {
    neutral: "border border-[var(--color-border)] bg-[var(--color-surface-alt)] text-[var(--color-muted)]",
    primary:
      "border border-[color:color-mix(in_srgb,var(--color-primary)_24%,transparent)] bg-[color:color-mix(in_srgb,var(--color-primary)_10%,transparent)] text-[var(--color-primary)]",
    success:
      "border border-[color:color-mix(in_srgb,var(--color-accent)_24%,transparent)] bg-[color:color-mix(in_srgb,var(--color-accent)_10%,transparent)] text-[var(--color-accent)]",
  } satisfies Record<BadgeTone, string>;

  return (
    <span
      className={[
        "inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold",
        tones[tone],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    />
  );
}