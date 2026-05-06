import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  helperText?: string;
  errorText?: string;
}

export function Input({
  id,
  label,
  helperText,
  errorText,
  className,
  ...props
}: InputProps) {
  return (
    <label className="block space-y-2" htmlFor={id}>
      <span className="text-sm font-semibold text-[var(--color-text)]">{label}</span>
      <input
        id={id}
        className={[
          "min-h-11 w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 text-sm text-[var(--color-text)] outline-none transition placeholder:text-[var(--color-muted)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[color:color-mix(in_srgb,var(--color-primary)_18%,transparent)]",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        {...props}
      />
      {errorText ? (
        <span className="block text-xs font-medium text-red-600 dark:text-red-300">{errorText}</span>
      ) : helperText ? (
        <span className="block text-xs text-[var(--color-muted)]">{helperText}</span>
      ) : null}
    </label>
  );
}