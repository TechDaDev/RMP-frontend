import {
  DoctorIcon,
  FileTextIcon,
  GridIcon,
  LabIcon,
  MessageIcon,
  PrescriptionIcon,
  ShieldIcon,
  UserIcon,
  type IconProps,
} from "@/components/icons";
import type { Translations } from "@/types/i18n";
import type { ComponentType } from "react";

export type PortalIconComponent = ComponentType<IconProps>;

export type PortalNavItem = {
  href: string;
  label: string;
  icon: PortalIconComponent;
  exact?: boolean;
  disabled?: boolean;
  badge?: string;
};

export function getPortalNavItems(userType: string | undefined | null, t: Translations): PortalNavItem[] {
  switch (userType) {
    case "patient":
      return [
        { href: "/app/patient", label: t.patient.dashboardTitle, icon: GridIcon, exact: true },
        { href: "/app/profile", label: t.portal.profile, icon: UserIcon, exact: true },
        { href: "/app/patient/consultations", label: t.patient.consultationsTitle, icon: MessageIcon },
        { href: "/app/patient/prescriptions", label: t.patient.prescriptionsTitle, icon: PrescriptionIcon },
        { href: "/app/patient/lab-orders", label: t.patient.labOrdersTitle, icon: FileTextIcon },
        { href: "/app/patient/lab-results", label: t.patient.labResultsTitle, icon: LabIcon },
        { href: "/app/patient/medical-record", label: t.patient.medicalRecordTitle, icon: FileTextIcon },
      ];
    case "doctor":
      return [
        { href: "/app/doctor", label: t.doctor.doctorDashboard, icon: GridIcon, exact: true },
        { href: "/app/doctor/consultations/pending", label: t.doctor.pendingConsultations, icon: MessageIcon },
        { href: "/app/doctor/consultations/assigned", label: t.doctor.assignedConsultations, icon: DoctorIcon },
        { href: "/app/profile", label: t.portal.profile, icon: UserIcon, exact: true },
      ];
    case "laboratorian":
      return [
        { href: "/app/lab", label: t.laboratory.dashboardTitle || t.roles.laboratory, icon: LabIcon, exact: true },
        { href: "/app/lab/scan", label: t.laboratory.scanLabOrder, icon: ShieldIcon },
        { href: "/app/profile", label: t.portal.profile, icon: UserIcon, exact: true },
      ];
    case "pharmacist":
      return [
        { href: "/app/pharmacist", label: t.dashboards.pharmacistTitle || t.roles.pharmacist, icon: PrescriptionIcon, exact: true },
        { href: "/app/pharmacist/scan", label: t.pharmacist.scanPrescription, icon: ShieldIcon },
        { href: "/app/pharmacist/history", label: t.pharmacist.dispensingHistory, icon: FileTextIcon },
        { href: "/app/profile", label: t.portal.profile, icon: UserIcon, exact: true },
      ];
    case "admin":
      return [
        { href: "/app/admin", label: t.admin.dashboardTitle, icon: GridIcon, exact: true },
        { href: "/app/admin/knowledge-base", label: t.admin.knowledgeBaseTitle, icon: FileTextIcon },
        { href: "/app/admin/rag-feedback", label: t.admin.ragFeedbackTitle, icon: ShieldIcon },
        { href: "/app/admin/verifications", label: t.admin.verificationReviewTitle, icon: ShieldIcon },
        { href: "/app/profile", label: t.portal.profile, icon: UserIcon, exact: true },
      ];
    default:
      return [
        { href: "/app", label: t.portal.dashboard, icon: GridIcon, exact: true },
        { href: "/app/profile", label: t.portal.profile, icon: UserIcon, exact: true },
      ];
  }
}

export function isPortalNavItemActive(pathname: string, item: PortalNavItem): boolean {
  if (item.exact || item.href === "/app/profile") {
    return pathname === item.href;
  }

  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}

export function getActivePortalNavHref(pathname: string, items: PortalNavItem[]): string | null {
  const matches = items
    .filter((item) => !item.disabled && isPortalNavItemActive(pathname, item))
    .sort((a, b) => b.href.length - a.href.length);

  return matches[0]?.href ?? null;
}
