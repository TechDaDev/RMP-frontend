import {
  DoctorIcon,
  LabIcon,
  PatientIcon,
  PharmacyIcon,
  ShieldIcon,
} from "@/components/icons";
import type { ComponentType } from "react";
import type { IconProps } from "@/components/icons";
import type { Locale } from "@/types/i18n";
import type { UserRole } from "@/types/roles";

type RoleIcon = ComponentType<IconProps>;

interface RoleMetadata {
  key: UserRole;
  labels: Record<Locale, string>;
  defaultRoute: string;
  description: Record<Locale, string>;
  Icon: RoleIcon;
}

export const roleMetadata: Record<UserRole, RoleMetadata> = {
  patient: {
    key: "patient",
    labels: {
      ar: "المريض",
      ku: "نەخۆش",
      en: "Patient",
    },
    defaultRoute: "/app/patient",
    description: {
      ar: "متابعة الاستشارات والوصفات والنتائج من واجهة واحدة.",
      ku: "بەدواداچوونی ڕاوێژ و ڕەچەتە و ئەنجامەکان لە یەک ڕووکاردا.",
      en: "Review consultations, prescriptions, and results in one place.",
    },
    Icon: PatientIcon,
  },
  doctor: {
    key: "doctor",
    labels: {
      ar: "الطبيب",
      ku: "پزیشک",
      en: "Doctor",
    },
    defaultRoute: "/app/doctor",
    description: {
      ar: "إدارة الاستشارات وخطط الرعاية والتحويلات الداخلية.",
      ku: "بەڕێوەبردنی ڕاوێژ و پلانی چاودێری و هەناردنە ناوخۆییەکان.",
      en: "Coordinate consultations, care plans, and internal workflows.",
    },
    Icon: DoctorIcon,
  },
  pharmacist: {
    key: "pharmacist",
    labels: {
      ar: "الصيدلية",
      ku: "دەرمانخانە",
      en: "Pharmacist",
    },
    defaultRoute: "/app/pharmacist",
    description: {
      ar: "مراجعة الوصفات وتتبع صرف الأدوية ضمن مسار موحد.",
      ku: "پشکنینی ڕەچەتە و بەدواداچوونی دەرچوونی دەرمان لە ڕێڕەوێکی یەکگرتوودا.",
      en: "Review prescriptions and dispensing workflows in a unified flow.",
    },
    Icon: PharmacyIcon,
  },
  laboratory: {
    key: "laboratory",
    labels: {
      ar: "المختبر",
      ku: "تاقیگە",
      en: "Laboratory",
    },
    defaultRoute: "/app/lab",
    description: {
      ar: "تنظيم طلبات الفحص ورفع النتائج ومشاركتها بأمان.",
      ku: "ڕێکخستنی داواکارییەکانی تاقیکردنەوە و بەرزکردنەوە و هاوبەشکردنی ئەنجامەکان بە پاراستن.",
      en: "Organize test orders, uploads, and secure result delivery.",
    },
    Icon: LabIcon,
  },
  admin: {
    key: "admin",
    labels: {
      ar: "الإدارة",
      ku: "بەڕێوەبەرایەتی",
      en: "Admin",
    },
    defaultRoute: "/app/admin",
    description: {
      ar: "متابعة الحوكمة والمستخدمين والتحقق وحالة النظام.",
      ku: "بەدواداچوونی بەڕێوەبردن و بەکارهێنەران و پشتڕاستکردنەوە و دۆخی سیستەم.",
      en: "Oversee governance, users, verification, and system health.",
    },
    Icon: ShieldIcon,
  },
};

export const portalRoles: UserRole[] = [
  "patient",
  "doctor",
  "pharmacist",
  "laboratory",
  "admin",
];

export const registrationRoles: UserRole[] = [
  "patient",
  "doctor",
  "pharmacist",
  "laboratory",
];