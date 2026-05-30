import type { BackendUser, ProfilesMeResponse, StaffProfileData } from "@/types/backend";
import type { EffectiveRole } from "@/lib/auth/roleHelpers";

export type AdminSection =
  | "verification"
  | "knowledge_base"
  | "rag_feedback"
  | "analytics"
  | "export"
  | "audit_logs"
  | "finance_dashboard"
  | "wallet_transactions"
  | "payment_intents"
  | "manual_recharge"
  | "provider_earnings"
  | "recharge_requests";

const SECTION_ALIASES: Record<string, AdminSection> = {
  verification: "verification",
  verifications: "verification",
  verification_review: "verification",
  approval: "verification",
  approvals: "verification",
  knowledge_base: "knowledge_base",
  knowledgebase: "knowledge_base",
  knowledge_base_documents: "knowledge_base",
  kb: "knowledge_base",
  rag_feedback: "rag_feedback",
  feedback: "rag_feedback",
  rag: "rag_feedback",
  analytics: "analytics",
  rag_analytics: "analytics",
  export: "export",
  exports: "export",
  dataset_export: "export",
  audit_logs: "audit_logs",
  audit_log: "audit_logs",
  audit: "audit_logs",
  finance_dashboard: "finance_dashboard",
  financial_dashboard: "finance_dashboard",
  finance: "finance_dashboard",
  wallet_transactions: "wallet_transactions",
  wallet_transaction: "wallet_transactions",
  payment_intents: "payment_intents",
  payment_intent: "payment_intents",
  manual_recharge: "manual_recharge",
  recharge: "manual_recharge",
  provider_earnings: "provider_earnings",
  earnings: "provider_earnings",
  recharge_requests: "recharge_requests",
  wallet_recharge_requests: "recharge_requests",
  recharge_request: "recharge_requests",
};

export const ALL_ADMIN_SECTIONS: AdminSection[] = [
  "verification",
  "knowledge_base",
  "rag_feedback",
  "analytics",
  "export",
  "audit_logs",
  "finance_dashboard",
  "wallet_transactions",
  "payment_intents",
  "manual_recharge",
  "provider_earnings",
  "recharge_requests",
];

export const FINANCIAL_SECTIONS: AdminSection[] = [
  "finance_dashboard",
  "wallet_transactions",
  "payment_intents",
  "manual_recharge",
  "provider_earnings",
  "recharge_requests",
];

export const ADMIN_SECTION_ROUTE_RULES: Array<{ prefix: string; anyOf: AdminSection[] }> = [
  { prefix: "/app/admin/verifications", anyOf: ["verification"] },
  { prefix: "/app/admin/knowledge-base", anyOf: ["knowledge_base"] },
  { prefix: "/app/admin/rag-feedback", anyOf: ["rag_feedback"] },
  { prefix: "/app/admin/analytics", anyOf: ["analytics", "export"] },
  { prefix: "/app/admin/audit-logs", anyOf: ["audit_logs"] },
  { prefix: "/app/financial/wallet-transactions", anyOf: ["wallet_transactions"] },
  { prefix: "/app/financial/payment-intents", anyOf: ["payment_intents"] },
  { prefix: "/app/financial/manual-recharge", anyOf: ["manual_recharge"] },
  { prefix: "/app/financial/provider-earnings", anyOf: ["provider_earnings"] },
  { prefix: "/app/financial/recharge-requests", anyOf: ["recharge_requests", "finance_dashboard"] },
  { prefix: "/app/financial", anyOf: ["finance_dashboard"] },
];

function normalizeSectionKey(value: string): string {
  return value.trim().toLowerCase().replace(/[\s-]+/g, "_");
}

function normalizeSection(value: string): AdminSection | null {
  return SECTION_ALIASES[normalizeSectionKey(value)] ?? null;
}

function extractStaffProfile(user: BackendUser | null, profile: ProfilesMeResponse | null): StaffProfileData | null {
  const profileRole = profile?.role_profile;
  if (profileRole && typeof profileRole === "object" && "staff_role" in profileRole) {
    return profileRole as StaffProfileData;
  }

  return user?.staff_profile ?? null;
}

export function getAllowedAdminSections(args: {
  user: BackendUser | null;
  profile: ProfilesMeResponse | null;
  role: EffectiveRole;
}): Set<AdminSection> {
  const { user, profile, role } = args;
  const staffProfile = extractStaffProfile(user, profile);
  const rawSections = staffProfile?.allowed_admin_sections ?? [];
  const normalized = new Set<AdminSection>();

  rawSections.forEach((item) => {
    if (typeof item !== "string") {
      return;
    }

    const section = normalizeSection(item);
    if (section) {
      normalized.add(section);
    }
  });

  if (role === "financial") {
    if (normalized.size === 0) {
      return new Set(FINANCIAL_SECTIONS);
    }

    return new Set(FINANCIAL_SECTIONS.filter((section) => normalized.has(section)));
  }

  if (user?.user_type === "admin") {
    return normalized.size > 0 ? normalized : new Set(ALL_ADMIN_SECTIONS);
  }

  return normalized;
}

export function hasAdminSection(allowedSections: Set<AdminSection>, section: AdminSection): boolean {
  return allowedSections.has(section);
}

export function hasAnyAdminSection(allowedSections: Set<AdminSection>, sections: AdminSection[]): boolean {
  return sections.some((section) => allowedSections.has(section));
}

export function getRouteSectionRule(pathname: string): { prefix: string; anyOf: AdminSection[] } | null {
  for (const rule of ADMIN_SECTION_ROUTE_RULES) {
    if (pathname === rule.prefix || pathname.startsWith(`${rule.prefix}/`)) {
      return rule;
    }
  }

  return null;
}