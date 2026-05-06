"use client";

import type { Locale } from "@/types/i18n";

const brandNames: Record<Locale, string> = {
  ar: "منصة الرافدين الطبية الرقمية",
  ku: "پلاتفۆرمی پزیشکی دیجیتاڵی ڕافیدەین",
  en: "Al-Rafidain Digital Medical Platform",
};

interface LogoProps {
  locale: Locale;
}

export function Logo({ locale }: LogoProps) {
  return (
    <div className="flex items-center gap-3">
      <svg
        aria-hidden="true"
        viewBox="0 0 72 72"
        className="h-10 w-10 shrink-0"
        role="img"
      >
        <defs>
          <linearGradient id="riverA" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--color-primary)" />
            <stop offset="100%" stopColor="var(--color-secondary)" />
          </linearGradient>
          <linearGradient id="riverB" x1="1" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-accent)" />
            <stop offset="100%" stopColor="var(--color-primary)" />
          </linearGradient>
        </defs>

        <rect
          x="6"
          y="6"
          width="60"
          height="60"
          rx="18"
          fill="var(--color-surface)"
          stroke="var(--color-border)"
          strokeWidth="1.5"
        />
        <path
          d="M18 19C28 25 28 47 18 53"
          stroke="url(#riverA)"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M54 19C44 25 44 47 54 53"
          stroke="url(#riverB)"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M36 24v24M24 36h24"
          stroke="var(--color-primary)"
          strokeWidth="3.4"
          strokeLinecap="round"
        />
        <path
          d="M20 42h8l3-4 3 8 3-6h5"
          stroke="var(--color-accent)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        >
          <animate
            attributeName="stroke-dasharray"
            values="0,80;20,40;0,80"
            dur="4s"
            repeatCount="indefinite"
          />
        </path>
      </svg>
      <div>
        <p className="text-sm font-semibold tracking-wide text-[var(--color-text)]">
          {brandNames[locale]}
        </p>
      </div>
    </div>
  );
}
