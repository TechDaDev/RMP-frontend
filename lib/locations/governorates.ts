import type { Locale } from "@/types/i18n";

export type GovernorateCode =
  | "baghdad"
  | "basra"
  | "nineveh"
  | "erbil"
  | "sulaymaniyah"
  | "duhok"
  | "halabja"
  | "anbar"
  | "babel"
  | "karbala"
  | "najaf"
  | "wasit"
  | "diyala"
  | "salah_al_din"
  | "kirkuk"
  | "maysan"
  | "dhi_qar"
  | "muthanna"
  | "qadisiyyah";

interface GovernorateOption {
  value: GovernorateCode;
  labels: Record<Locale, string>;
}

const GOVERNORATE_OPTIONS: GovernorateOption[] = [
  { value: "baghdad", labels: { ar: "بغداد", ku: "بەغدا", en: "Baghdad" } },
  { value: "basra", labels: { ar: "البصرة", ku: "بەسرە", en: "Basra" } },
  { value: "nineveh", labels: { ar: "نينوى", ku: "نەینەوا", en: "Nineveh" } },
  { value: "erbil", labels: { ar: "أربيل", ku: "هەولێر", en: "Erbil" } },
  { value: "sulaymaniyah", labels: { ar: "السليمانية", ku: "سلێمانی", en: "Sulaymaniyah" } },
  { value: "duhok", labels: { ar: "دهوك", ku: "دهۆک", en: "Duhok" } },
  { value: "halabja", labels: { ar: "حلبجة", ku: "هەڵەبجە", en: "Halabja" } },
  { value: "anbar", labels: { ar: "الأنبار", ku: "ئەنبار", en: "Anbar" } },
  { value: "babel", labels: { ar: "بابل", ku: "بابڵ", en: "Babel" } },
  { value: "karbala", labels: { ar: "كربلاء", ku: "کەربەلا", en: "Karbala" } },
  { value: "najaf", labels: { ar: "النجف", ku: "نەجەف", en: "Najaf" } },
  { value: "wasit", labels: { ar: "واسط", ku: "واسط", en: "Wasit" } },
  { value: "diyala", labels: { ar: "ديالى", ku: "دیالە", en: "Diyala" } },
  { value: "salah_al_din", labels: { ar: "صلاح الدين", ku: "سەلاحەدین", en: "Salah al-Din" } },
  { value: "kirkuk", labels: { ar: "كركوك", ku: "کەرکووک", en: "Kirkuk" } },
  { value: "maysan", labels: { ar: "ميسان", ku: "مەیسان", en: "Maysan" } },
  { value: "dhi_qar", labels: { ar: "ذي قار", ku: "زیقار", en: "Dhi Qar" } },
  { value: "muthanna", labels: { ar: "المثنى", ku: "موسەننا", en: "Muthanna" } },
  { value: "qadisiyyah", labels: { ar: "القادسية", ku: "قادسیە", en: "Qadisiyyah" } },
];

function normalize(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, "_");
}

export function getGovernorateDropdownOptions(locale: Locale): Array<{ value: GovernorateCode; label: string }> {
  return GOVERNORATE_OPTIONS.map((item) => ({
    value: item.value,
    label: item.labels[locale],
  }));
}

export function resolveGovernorateCode(value: string | null | undefined): GovernorateCode | null {
  if (!value) {
    return null;
  }

  const normalized = normalize(value);
  for (const item of GOVERNORATE_OPTIONS) {
    if (normalized === item.value) {
      return item.value;
    }

    if (Object.values(item.labels).some((label) => normalize(label) === normalized)) {
      return item.value;
    }
  }

  return null;
}

export function localizeGovernorate(value: string | null | undefined, locale: Locale): string {
  if (!value) {
    return "";
  }

  const code = resolveGovernorateCode(value);
  if (!code) {
    return value;
  }

  const item = GOVERNORATE_OPTIONS.find((option) => option.value === code);
  return item ? item.labels[locale] : value;
}
