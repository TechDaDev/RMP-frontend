"use client";

import type { Locale } from "@/types/i18n";

const brandShort: Record<Locale, string> = {
  ar: "الرافدين",
  ku: "ڕافیدەین",
  en: "Al-Rafidain",
};

interface LogoProps {
  locale: Locale;
}

export function Logo({ locale }: LogoProps) {
  return (
    <div className="flex items-center gap-3">
      <svg
        aria-hidden="true"
        viewBox="0 0 64 64"
        className="h-10 w-10 shrink-0"
        role="img"
      >
        <defs>
          <linearGradient id="lg-river-a" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-primary)" />
            <stop offset="100%" stopColor="var(--color-secondary)" />
          </linearGradient>
          <linearGradient id="lg-river-b" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-accent)" />
            <stop offset="100%" stopColor="var(--color-primary)" />
          </linearGradient>
          <linearGradient id="lg-bg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="color-mix(in srgb, var(--color-primary) 14%, var(--color-surface))" />
            <stop offset="100%" stopColor="var(--color-surface)" />
          </linearGradient>
        </defs>

        {/* Background tile */}
        <rect x="2" y="2" width="60" height="60" rx="16" fill="url(#lg-bg)" stroke="var(--color-border)" strokeWidth="1.2" />

        {/* Left river arc (Tigris) */}
        <path
          d="M17 14 C10 22 10 42 17 50"
          stroke="url(#lg-river-a)"
          strokeWidth="3.6"
          strokeLinecap="round"
          fill="none"
        />

        {/* Right river arc (Euphrates) */}
        <path
          d="M47 14 C54 22 54 42 47 50"
          stroke="url(#lg-river-b)"
          strokeWidth="3.6"
          strokeLinecap="round"
          fill="none"
        />

        {/* Medical cross */}
        <line x1="32" y1="22" x2="32" y2="42" stroke="var(--color-primary)" strokeWidth="3" strokeLinecap="round" />
        <line x1="22" y1="32" x2="42" y2="32" stroke="var(--color-primary)" strokeWidth="3" strokeLinecap="round" />

        {/* Pulse line */}
        <path
          d="M18 38h5l2.5-4.5 3 9 3-6.5h5l2 2h6"
          stroke="var(--color-accent)"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        >
          <animate
            attributeName="stroke-dasharray"
            values="0,80;20,40;0,80"
            dur="3.5s"
            repeatCount="indefinite"
          />
        </path>
      </svg>

      <div className="leading-tight">
        <p className="text-xs font-bold tracking-wider text-[var(--color-primary)] uppercase opacity-75">
          {brandShort[locale]}
        </p>
        <p className="text-[0.7rem] font-medium text-[var(--color-muted)] leading-none">
          {locale === "en" ? "Digital Medical Platform" : locale === "ku" ? "پلاتفۆرمی پزیشکی" : "المنصة الطبية الرقمية"}
        </p>
      </div>
    </div>
  );
}

