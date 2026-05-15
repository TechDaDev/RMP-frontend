"use client";

import { useState } from "react";
import { EyeIcon, EyeOffIcon } from "@/components/icons";
import { useAppPreferences } from "@/components/AppPreferencesProvider";

interface PasswordInputProps {
  id: string;
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  autoComplete?: string;
  errorText?: string;
}

/**
 * Password input with an inline show/hide toggle button.
 * Mirrors the styling of the shared Input component.
 */
export function PasswordInput({
  id,
  name,
  label,
  placeholder,
  required,
  autoComplete,
  errorText,
}: PasswordInputProps) {
  const { t } = useAppPreferences();
  const [show, setShow] = useState(false);

  return (
    <label className="block space-y-2" htmlFor={id}>
      <span className="text-sm font-semibold text-[var(--color-text)]">{label}</span>
      <div className="relative">
        <input
          id={id}
          name={name}
          type={show ? "text" : "password"}
          placeholder={placeholder}
          required={required}
          autoComplete={autoComplete}
          dir="ltr"
          className="min-h-11 w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 pr-12 text-sm text-[var(--color-text)] outline-none transition placeholder:text-[var(--color-muted)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[color:color-mix(in_srgb,var(--color-primary)_18%,transparent)]"
        />
        <button
          type="button"
          tabIndex={-1}
          aria-label={show ? t.auth.hidePassword : t.auth.showPassword}
          className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-[var(--color-muted)] transition hover:text-[var(--color-text)]"
          onClick={() => setShow((v) => !v)}
        >
          {show ? <EyeOffIcon size={16} /> : <EyeIcon size={16} />}
        </button>
      </div>
      {errorText ? (
        <span className="block text-xs font-medium text-red-600 dark:text-red-300">
          {errorText}
        </span>
      ) : null}
    </label>
  );
}
