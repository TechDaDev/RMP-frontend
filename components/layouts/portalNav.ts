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
import { getAllowedAdminSections, hasAdminSection } from "@/lib/admin/adminSections";
import type { ProfilesMeResponse, BackendUser } from "@/types/backend";
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

export function getPortalNavItems(
  userType: string | undefined | null,
  t: Translations,
  options?: { user?: BackendUser | null; profile?: ProfilesMeResponse | null },
): PortalNavItem[] {
  const allowedAdminSections = getAllowedAdminSections({
    user: options?.user ?? null,
    profile: options?.profile ?? null,
    role: userType === "financial" ? "financial" : userType === "admin" ? "admin" : null,
  });

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
        ...(hasAdminSection(allowedAdminSections, "knowledge_base")
          ? [{ href: "/app/admin/knowledge-base", label: t.admin.knowledgeBaseTitle, icon: FileTextIcon }]
          : []),
        ...(hasAdminSection(allowedAdminSections, "rag_feedback")
          ? [{ href: "/app/admin/rag-feedback", label: t.admin.ragFeedbackTitle, icon: ShieldIcon }]
          : []),
        ...(hasAdminSection(allowedAdminSections, "verification")
          ? [{ href: "/app/admin/verifications", label: t.admin.verificationReviewTitle, icon: ShieldIcon }]
          : []),
        ...(hasAdminSection(allowedAdminSections, "analytics") || hasAdminSection(allowedAdminSections, "export")
          ? [{ href: "/app/admin/analytics", label: t.admin.adminFeatureAnalyticsExport, icon: GridIcon }]
          : []),
        ...(hasAdminSection(allowedAdminSections, "audit_logs")
          ? [{ href: "/app/admin/audit-logs", label: t.admin.adminFeatureAuditLogs, icon: FileTextIcon }]
          : []),
        ...(hasAdminSection(allowedAdminSections, "finance_dashboard")
          ? [{ href: "/app/financial", label: "Finance Dashboard", icon: GridIcon }]
          : []),
        ...(hasAdminSection(allowedAdminSections, "wallet_transactions")
          ? [{ href: "/app/financial/wallet-transactions", label: "Wallet Transactions", icon: FileTextIcon }]
          : []),
        ...(hasAdminSection(allowedAdminSections, "payment_intents")
          ? [{ href: "/app/financial/payment-intents", label: "Payment Intents", icon: FileTextIcon }]
          : []),
        ...(hasAdminSection(allowedAdminSections, "manual_recharge")
          ? [{ href: "/app/financial/manual-recharge", label: "Manual Recharge", icon: ShieldIcon }]
          : []),
        ...(hasAdminSection(allowedAdminSections, "provider_earnings")
          ? [{ href: "/app/financial/provider-earnings", label: "Provider Earnings", icon: FileTextIcon }]
          : []),
        { href: "/app/profile", label: t.portal.profile, icon: UserIcon, exact: true },
      ];
    case "financial":
      return [
        ...(hasAdminSection(allowedAdminSections, "finance_dashboard")
          ? [{ href: "/app/financial", label: "Finance Dashboard", icon: GridIcon, exact: true }]
          : []),
        ...(hasAdminSection(allowedAdminSections, "wallet_transactions")
          ? [{ href: "/app/financial/wallet-transactions", label: "Wallet Transactions", icon: FileTextIcon }]
          : []),
        ...(hasAdminSection(allowedAdminSections, "payment_intents")
          ? [{ href: "/app/financial/payment-intents", label: "Payment Intents", icon: FileTextIcon }]
          : []),
        ...(hasAdminSection(allowedAdminSections, "manual_recharge")
          ? [{ href: "/app/financial/manual-recharge", label: "Manual Recharge", icon: ShieldIcon }]
          : []),
        ...(hasAdminSection(allowedAdminSections, "provider_earnings")
          ? [{ href: "/app/financial/provider-earnings", label: "Provider Earnings", icon: FileTextIcon }]
          : []),
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
