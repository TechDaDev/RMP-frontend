import type { Locale } from "@/types/i18n";
import { DOC_EXACT_MEDICAL_TERMS } from "@/lib/patient/docExactMedicalTerms";

type LocalizedMedicalTerm = {
  ar: string;
  ku: string;
};

type LocalizedWord = {
  ar: string;
  ku: string;
};

const MEDICAL_TERMS: Record<string, LocalizedMedicalTerm> = {
  general: { ar: "عام", ku: "گشتی" },
  respiratory: { ar: "تنفسي", ku: "هەناسەدان" },
  cardiac: { ar: "قلبي", ku: "دڵ" },
  neurological: { ar: "عصبي", ku: "ئەعصاب" },
  gastrointestinal: { ar: "الجهاز الهضمي", ku: "دەستگەی هەرس" },
  musculoskeletal: { ar: "عضلي هيكلي", ku: "ماسولکە و ئێسک" },
  dermatological: { ar: "جلدي", ku: "پێست" },
  ent: { ar: "أنف وأذن وحنجرة", ku: "لووتکە و گوێ و گەروو" },
  urological: { ar: "بولي", ku: "پێشەوی" },
  gynecological: { ar: "نسائية", ku: "ژنانی" },
  ophthalmological: { ar: "عيون", ku: "چاو" },
  psychiatric: { ar: "نفسي", ku: "دەروونی" },
  endocrine: { ar: "غدد صماء", ku: "غوددی هۆرمۆنی" },
  emergency_red_flags: { ar: "طوارئ / علامات خطر", ku: "فریاکەوتن / نیشانەی مەترسیدار" },
  emergency_or_red_flags: { ar: "طوارئ / علامات خطر", ku: "فریاکەوتن / نیشانەی مەترسیدار" },
  red_flags: { ar: "علامات خطر", ku: "نیشانەی مەترسیدار" },

  fever: { ar: "حمى", ku: "تا" },
  high_fever: { ar: "حمى مرتفعة", ku: "تای بەرز" },
  chills: { ar: "قشعريرة", ku: "لەرز" },
  fatigue: { ar: "إرهاق", ku: "ماندووبوون" },
  weakness: { ar: "ضعف عام", ku: "لاوازی گشتی" },
  malaise: { ar: "تعب عام", ku: "نەخۆشی گشتی" },

  cough: { ar: "سعال", ku: "کۆخە" },
  dry_cough: { ar: "سعال جاف", ku: "کۆخەی وشک" },
  productive_cough: { ar: "سعال مع بلغم", ku: "کۆخەی بەلغەم" },
  shortness_of_breath: { ar: "ضيق في التنفس", ku: "کەمی هەناسە" },
  wheezing: { ar: "صفير بالصدر", ku: "فیکەی سینگ" },
  sore_throat: { ar: "التهاب/ألم الحلق", ku: "ئازاری گەروو" },
  runny_nose: { ar: "سيلان الأنف", ku: "ڕژانی لووت" },
  nasal_congestion: { ar: "انسداد الأنف", ku: "گیربوونی لووت" },

  chest_pain: { ar: "ألم الصدر", ku: "ئازاری سنگ" },
  severe_chest_pain: { ar: "ألم صدر شديد", ku: "ئازاری توندی سنگ" },
  palpitations: { ar: "خفقان القلب", ku: "لێدانی خێرای دڵ" },
  syncope: { ar: "إغماء", ku: "بێهۆشی" },
  loss_of_consciousness: { ar: "فقدان الوعي", ku: "لەدەستدانی هۆشیاری" },
  sudden_confusion: { ar: "تشوش مفاجئ", ku: "شێوانی لەناکاو" },
  severe_bleeding: { ar: "نزيف شديد", ku: "خوێنڕێژی توند" },
  severe_allergic_reaction: { ar: "تحسس شديد", ku: "وەڵامدانی هەستیاری توند" },
  blue_lips_or_face: { ar: "ازرقاق الشفاه أو الوجه", ku: "شینبوونی لێو یان ڕوو" },

  headache: { ar: "صداع", ku: "سەرئێشە" },
  dizziness: { ar: "دوخة", ku: "سەرسوڕان" },
  seizure: { ar: "نوبة تشنج", ku: "گێژاو" },
  numbness: { ar: "خدر", ku: "بێهەستبوون" },
  tingling: { ar: "تنميل", ku: "مورمورە" },

  abdominal_pain: { ar: "ألم البطن", ku: "ئازاری سک" },
  severe_abdominal_pain: { ar: "ألم بطن شديد", ku: "ئازاری توندی سک" },
  nausea: { ar: "غثيان", ku: "دڵتێکەڵبوون" },
  vomiting: { ar: "قيء", ku: "هەڵگەڕان" },
  diarrhea: { ar: "إسهال", ku: "سکچوون" },
  constipation: { ar: "إمساك", ku: "قبز" },
  bloating: { ar: "انتفاخ", ku: "پڕبوونی سک" },

  back_pain: { ar: "ألم الظهر", ku: "ئازاری پشت" },
  joint_pain: { ar: "ألم المفاصل", ku: "ئازاری جومگە" },
  muscle_pain: { ar: "ألم العضلات", ku: "ئازاری ماسولکە" },

  rash: { ar: "طفح جلدي", ku: "ڕەشەی پێست" },
  itching: { ar: "حكة", ku: "خوران" },

  painful_urination: { ar: "حرقة/ألم عند التبول", ku: "ئازار لە کاتی میزکردن" },
  frequent_urination: { ar: "كثرة التبول", ku: "زۆر میزکردن" },

  blurred_vision: { ar: "تشوش الرؤية", ku: "تێکچوونی بینین" },
  eye_pain: { ar: "ألم العين", ku: "ئازاری چاو" },

  anxiety: { ar: "قلق", ku: "دڵەڕاوکێ" },
  depression: { ar: "اكتئاب", ku: "دڵتەنگی" },

  hemoptysis: { ar: "نفث الدم", ku: "خوێن لەگەڵ کۆخە" },
  dyspnea: { ar: "ضيق نفس", ku: "کەمی هەناسە" },
};

const MEDICAL_WORDS: Record<string, LocalizedWord> = {
  and: { ar: "و", ku: "و" },
  or: { ar: "أو", ku: "یان" },
  of: { ar: "من", ku: "ی" },
  in: { ar: "في", ku: "لە" },
  with: { ar: "مع", ku: "لەگەڵ" },

  emergency: { ar: "طوارئ", ku: "فریاکەوتن" },
  red: { ar: "خطر", ku: "مەترسیدار" },
  flag: { ar: "علامة", ku: "نیشانە" },
  flags: { ar: "علامات", ku: "نیشانەکان" },
  severe: { ar: "شديد", ku: "توند" },
  mild: { ar: "خفيف", ku: "سووک" },
  moderate: { ar: "متوسط", ku: "مامناوەند" },
  chronic: { ar: "مزمن", ku: "مزمن" },
  sudden: { ar: "مفاجئ", ku: "لەناکاو" },

  pain: { ar: "ألم", ku: "ئازار" },
  chest: { ar: "صدر", ku: "سنگ" },
  abdominal: { ar: "بطني", ku: "سک" },
  abdomen: { ar: "بطن", ku: "سک" },
  belly: { ar: "بطن", ku: "سک" },
  head: { ar: "رأس", ku: "سەر" },
  headache: { ar: "صداع", ku: "سەرئێشە" },
  back: { ar: "ظهر", ku: "پشت" },
  neck: { ar: "رقبة", ku: "مل" },
  throat: { ar: "حلق", ku: "گەروو" },
  ear: { ar: "أذن", ku: "گوێ" },
  ears: { ar: "الأذن", ku: "گوێ" },
  nose: { ar: "أنف", ku: "لووت" },
  eye: { ar: "عين", ku: "چاو" },
  eyes: { ar: "العيون", ku: "چاو" },
  lips: { ar: "شفاه", ku: "لێو" },
  face: { ar: "وجه", ku: "ڕوو" },

  fever: { ar: "حمى", ku: "تا" },
  high: { ar: "مرتفع", ku: "بەرز" },
  low: { ar: "منخفض", ku: "نزم" },
  cough: { ar: "سعال", ku: "کۆخە" },
  shortness: { ar: "ضيق", ku: "کەمی" },
  breath: { ar: "تنفس", ku: "هەناسە" },
  breathing: { ar: "التنفس", ku: "هەناسەدان" },
  wheezing: { ar: "صفير", ku: "فیکە" },
  congestion: { ar: "احتقان", ku: "گیربوون" },
  runny: { ar: "سيلان", ku: "ڕژان" },

  nausea: { ar: "غثيان", ku: "دڵتێکەڵبوون" },
  vomiting: { ar: "قيء", ku: "هەڵگەڕان" },
  diarrhea: { ar: "إسهال", ku: "سکچوون" },
  constipation: { ar: "إمساك", ku: "قبز" },
  bloating: { ar: "انتفاخ", ku: "پڕبوون" },

  bleeding: { ar: "نزيف", ku: "خوێنڕێژی" },
  blood: { ar: "دم", ku: "خوێن" },
  allergic: { ar: "تحسسي", ku: "هەستیاری" },
  reaction: { ar: "تفاعل", ku: "وەڵامدان" },
  confusion: { ar: "تشوش", ku: "شێوانی" },
  consciousness: { ar: "وعي", ku: "هۆشیاری" },
  loss: { ar: "فقدان", ku: "لەدەستدان" },
  seizure: { ar: "تشنج", ku: "گێژاو" },
  syncope: { ar: "إغماء", ku: "بێهۆشی" },
  dizziness: { ar: "دوخة", ku: "سەرسوڕان" },
  numbness: { ar: "خدر", ku: "بێهەستبوون" },
  tingling: { ar: "تنميل", ku: "مورمورە" },

  fatigue: { ar: "إرهاق", ku: "ماندووبوون" },
  weakness: { ar: "ضعف", ku: "لاوازی" },
  malaise: { ar: "تعب", ku: "نەخۆشی" },

  cardiac: { ar: "قلبي", ku: "دڵ" },
  respiratory: { ar: "تنفسي", ku: "هەناسەدان" },
  neurological: { ar: "عصبي", ku: "ئەعصاب" },
  gastrointestinal: { ar: "هضمي", ku: "هەرس" },
  musculoskeletal: { ar: "عضلي هيكلي", ku: "ماسولکە و ئێسک" },
  dermatological: { ar: "جلدي", ku: "پێست" },
  urological: { ar: "بولي", ku: "پێشەوی" },
  gynecological: { ar: "نسائية", ku: "ژنانی" },
  ophthalmological: { ar: "عيون", ku: "چاو" },
  psychiatric: { ar: "نفسي", ku: "دەروونی" },
  endocrine: { ar: "غدد", ku: "غودد" },
  general: { ar: "عام", ku: "گشتی" },
  ent: { ar: "أنف أذن حنجرة", ku: "لووتکە گوێ گەروو" },
};

const DOC_EXACT_MEDICAL_TERMS_BY_LOWER = Object.fromEntries(
  Object.entries(DOC_EXACT_MEDICAL_TERMS).map(([key, value]) => [key.toLowerCase(), value]),
) as Record<string, { ar: string; ku: string }>;

function normalizeTerm(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .replace(/ /g, "_");
}

function localizeExact(value: string, locale: Locale): string | null {
  if (locale === "en") {
    return null;
  }

  const docExact = DOC_EXACT_MEDICAL_TERMS[value] ?? DOC_EXACT_MEDICAL_TERMS_BY_LOWER[value.toLowerCase()];
  if (docExact) {
    return locale === "ar" ? docExact.ar : docExact.ku;
  }

  const key = normalizeTerm(value);
  const term = MEDICAL_TERMS[key];
  if (!term) {
    return null;
  }
  return locale === "ar" ? term.ar : term.ku;
}

function localizeWord(word: string, locale: Locale): string {
  const key = word.toLowerCase();
  const direct = MEDICAL_WORDS[key];
  if (direct) {
    return locale === "ar" ? direct.ar : direct.ku;
  }

  const singular = key.endsWith("ies")
    ? `${key.slice(0, -3)}y`
    : key.endsWith("es")
      ? key.slice(0, -2)
      : key.endsWith("s")
        ? key.slice(0, -1)
        : key;
  const singularMatch = MEDICAL_WORDS[singular];
  if (singularMatch) {
    return locale === "ar" ? singularMatch.ar : singularMatch.ku;
  }

  return word;
}

function localizeByWords(value: string, locale: Locale): string {
  const tokens = value.match(/[A-Za-z]+|[^A-Za-z]+/g);
  if (!tokens) {
    return value;
  }

  let changed = false;
  const localized = tokens.map((token) => {
    if (!/^[A-Za-z]+$/.test(token)) {
      return token;
    }
    const translated = localizeWord(token, locale);
    if (translated !== token) {
      changed = true;
    }
    return translated;
  });

  return changed ? localized.join("") : value;
}

export function localizeMedicalTerm(value: string | null | undefined, locale: Locale): string {
  const source = value?.trim();
  if (!source || locale === "en") {
    return source ?? "";
  }

  const exact = localizeExact(source, locale);
  if (exact) {
    return exact;
  }

  return localizeByWords(source, locale);
}
