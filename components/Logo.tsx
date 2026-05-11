"use client";

import Image from "next/image";
import type { Locale } from "@/types/i18n";
import platformLogo from "@/logo/logo.png";

const brandAlt: Record<Locale, string> = {
  ar: "شعار منصة الرافدين الطبية",
  ku: "لۆگۆی پلاتفۆرمی پزیشکی ڕافیدەین",
  en: "Al-Rafidain Medical Platform logo",
};

interface LogoProps {
  locale: Locale;
}

export function Logo({ locale }: LogoProps) {
  return (
    <div className="flex min-w-0 items-center">
      <Image
        src={platformLogo}
        alt={brandAlt[locale]}
        width={867}
        height={348}
        loading="eager"
        fetchPriority="high"
        className="h-10 w-auto max-w-[11rem] shrink-0 object-contain"
      />
    </div>
  );
}

