"use client";

import Image from "next/image";
import type { Locale } from "@/types/i18n";
import platformLogoLight from "@/logo/logo_light.png";
import platformLogoDark from "@/logo/logo_dark.png";

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
        src={platformLogoLight}
        alt={brandAlt[locale]}
        width={867}
        height={348}
        loading="eager"
        fetchPriority="high"
        className="h-10 w-auto max-w-[11rem] shrink-0 object-contain dark:hidden"
      />
      <Image
        src={platformLogoDark}
        alt={brandAlt[locale]}
        width={867}
        height={348}
        loading="eager"
        fetchPriority="high"
        className="hidden h-10 w-auto max-w-[11rem] shrink-0 object-contain dark:block"
      />
    </div>
  );
}

