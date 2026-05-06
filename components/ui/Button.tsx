import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";

interface ButtonClassNameOptions {
  variant?: ButtonVariant;
  fullWidth?: boolean;
  className?: string;
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  fullWidth?: boolean;
}

function joinClasses(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

export function buttonClassName({
  variant = "primary",
  fullWidth = false,
  className,
}: ButtonClassNameOptions = {}) {
  const base = "inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]";
  const styles = {
    primary:
      "bg-[linear-gradient(135deg,var(--color-primary),var(--color-secondary))] text-white shadow-[var(--card-shadow)] hover:-translate-y-0.5 hover:opacity-95",
    secondary:
      "border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] hover:-translate-y-0.5 hover:bg-[var(--color-surface-alt)]",
    ghost:
      "text-[var(--color-text)] hover:bg-[var(--color-surface-alt)]",
  } satisfies Record<ButtonVariant, string>;

  return joinClasses(base, styles[variant], fullWidth && "w-full", className);
}

export function Button({
  variant = "primary",
  fullWidth = false,
  className,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={buttonClassName({ variant, fullWidth, className })}
      {...props}
    />
  );
}