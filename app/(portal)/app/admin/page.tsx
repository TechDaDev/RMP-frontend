"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { useAuth } from "@/components/auth/AuthProvider";
import { DashboardGrid } from "@/components/dashboard/DashboardGrid";
import { DashboardSection } from "@/components/dashboard/DashboardSection";
import { DashboardStatCard } from "@/components/dashboard/DashboardStatCard";
import { DashboardStateCard } from "@/components/dashboard/DashboardStateCard";
import { DashboardWorkflowCard } from "@/components/dashboard/DashboardWorkflowCard";
import { FileTextIcon, GridIcon, PulseIcon, ShieldIcon } from "@/components/icons";
import { Badge } from "@/components/ui/Badge";
import { Button, buttonClassName } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/PageHeader";
import {
  getAllowedAdminSections,
  hasAdminSection,
} from "@/lib/admin/adminSections";
import {
  exportAdminRagDatasetJson,
  getAdminKnowledgeDocuments,
  getAdminRagAnalyticsSummary,
  getAdminRagFeedback,
} from "@/lib/admin/adminService";
import type { AdminRagAnalyticsSummary } from "@/types/admin";

function resolveLocaleTag(locale: string) {
  if (locale === "ar") return "ar-IQ";
  if (locale === "ku") return "ku";
  return "en-US";
}

function formatDate(value?: string | null, localeTag = "en-US") {
  if (!value) {
    return "-";
  }

  return new Date(value).toLocaleString(localeTag);
}

function formatDateOnly(value?: string | null, localeTag = "en-US") {
  if (!value) {
    return "-";
  }

  return new Date(value).toLocaleDateString(localeTag, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

export default function AdminPortalPage() {
  const { t, locale } = useAppPreferences();
  const { profile, user, effectiveRole } = useAuth();
  const localeTag = resolveLocaleTag(locale);
  const roleProfile = profile?.role_profile as {
    role_display?: string;
    department?: string;
    hire_date?: string;
    last_active?: string;
    has_completed_training?: boolean;
    allowed_admin_sections?: string[];
  } | null;
  const allowedSections = getAllowedAdminSections({ user, profile, role: effectiveRole });
  const canViewKnowledgeBase = hasAdminSection(allowedSections, "knowledge_base");
  const canViewRagFeedback = hasAdminSection(allowedSections, "rag_feedback");
  const canViewVerification = hasAdminSection(allowedSections, "verification");
  const canViewAnalytics = hasAdminSection(allowedSections, "analytics");
  const canExport = hasAdminSection(allowedSections, "export");
  const canViewAuditLogs = hasAdminSection(allowedSections, "audit_logs");
  const visibleFeatureCount = [
    canViewKnowledgeBase,
    canViewRagFeedback,
    canViewVerification,
    canViewAnalytics || canExport,
    canViewAuditLogs,
  ].filter(Boolean).length;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [analytics, setAnalytics] = useState<AdminRagAnalyticsSummary | null>(null);
  const [knowledgeCount, setKnowledgeCount] = useState(0);
  const [pendingFeedbackCount, setPendingFeedbackCount] = useState(0);
  const [exporting, setExporting] = useState(false);
  const [exportMessage, setExportMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadDashboard() {
      const shouldLoadKnowledge = canViewKnowledgeBase;
      const shouldLoadFeedback = canViewRagFeedback;
      const shouldLoadAnalytics = canViewAnalytics;

      if (!shouldLoadKnowledge && !shouldLoadFeedback && !shouldLoadAnalytics) {
        setLoading(false);
        setError(null);
        setAnalytics(null);
        setKnowledgeCount(0);
        setPendingFeedbackCount(0);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const [analyticsData, documents, pendingFeedback] = await Promise.all([
          shouldLoadAnalytics ? getAdminRagAnalyticsSummary() : Promise.resolve(null),
          shouldLoadKnowledge ? getAdminKnowledgeDocuments() : Promise.resolve([]),
          shouldLoadFeedback ? getAdminRagFeedback({ review_status: "pending" }) : Promise.resolve([]),
        ]);

        if (cancelled) {
          return;
        }

        setAnalytics(analyticsData);
        setKnowledgeCount(documents.length);
        setPendingFeedbackCount(pendingFeedback.length);
      } catch {
        if (!cancelled) {
          setError(t.admin.loadFailedDescription);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadDashboard();

    return () => {
      cancelled = true;
    };
  }, [canViewAnalytics, canViewKnowledgeBase, canViewRagFeedback, t.admin.loadFailedDescription]);

  async function handleExportDataset() {
    if (exporting) {
      return;
    }

    setExporting(true);
    setExportMessage(null);

    try {
      const result = await exportAdminRagDatasetJson();
      setExportMessage(`${t.admin.datasetExportSucceeded} (${result.record_count ?? 0})`);
    } catch {
      setExportMessage(t.admin.datasetExportFailed);
    } finally {
      setExporting(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        badge={<Badge tone="primary">{t.roles.admin}</Badge>}
        title={t.admin.dashboardTitle}
        description={t.admin.dashboardSubtitle}
        actions={<Badge tone="success">{t.common.liveBadge}</Badge>}
      />

      {/* Staff profile display */}
      <DashboardSection title={t.admin.staffProfileTitle} description={t.admin.staffProfileDescription}>
        {roleProfile ? (
          <div className="rounded-3xl border border-[var(--color-border)] bg-[linear-gradient(155deg,color-mix(in_srgb,var(--color-primary)_8%,var(--color-surface))_0%,var(--color-surface)_48%,color-mix(in_srgb,var(--color-secondary)_8%,var(--color-surface))_100%)] p-5 shadow-[var(--card-shadow)] md:p-6">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
              <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-3">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-muted)]">{t.admin.staffRoleLabel}</p>
                <p className="mt-1 text-sm font-semibold text-[var(--color-text)]">{roleProfile.role_display || "-"}</p>
              </div>
              <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-3">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-muted)]">{t.admin.staffDepartmentLabel}</p>
                <p className="mt-1 text-sm font-semibold text-[var(--color-text)]">{roleProfile.department || "-"}</p>
              </div>
              <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-3">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-muted)]">{t.admin.staffHiredLabel}</p>
                <p className="mt-1 text-sm font-semibold text-[var(--color-text)]">{formatDateOnly(roleProfile.hire_date, localeTag)}</p>
              </div>
              <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-3">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-muted)]">{t.admin.staffLastActiveLabel}</p>
                <p className="mt-1 text-sm font-semibold text-[var(--color-text)]">{formatDate(roleProfile.last_active, localeTag)}</p>
              </div>
              <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-3">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-muted)]">{t.admin.staffTrainingLabel}</p>
                <p className="mt-1 text-sm font-semibold text-[var(--color-text)]">
                  {roleProfile.has_completed_training ? t.admin.staffTrainingCompleted : t.admin.staffTrainingPending}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <DashboardStateCard state="empty" title={t.admin.staffProfileTitle} description={t.admin.staffProfileMissing} />
        )}
      </DashboardSection>

      <DashboardSection
        title={t.admin.platformStats}
        description={t.admin.platformStatsDescription}
        actions={
          <Button variant="secondary" className="w-full sm:w-auto" onClick={() => void handleExportDataset()} disabled={exporting || !canExport}>
            {exporting ? t.admin.datasetExporting : t.admin.datasetExportAction}
          </Button>
        }
      >
        {visibleFeatureCount === 0 ? (
          <DashboardStateCard state="empty" title={t.admin.staffProfileTitle} description={t.admin.backendLimitedDescription} />
        ) : loading ? (
          <DashboardStateCard state="loading" description={t.common.loading} />
        ) : error ? (
          <DashboardStateCard
            state="error"
            title={t.admin.loadFailedTitle}
            description={error}
            action={<Button variant="secondary" onClick={() => window.location.reload()}>{t.common.retry}</Button>}
          />
        ) : (
          <DashboardGrid columns="four">
            {canViewKnowledgeBase ? (
              <DashboardStatCard
                label={t.admin.totalKnowledgeDocuments}
                value={knowledgeCount}
                description={t.admin.totalKnowledgeDocumentsDescription}
                icon={<FileTextIcon size={18} />}
                tone="info"
              />
            ) : null}
            {canViewRagFeedback ? (
              <DashboardStatCard
                label={t.admin.pendingFeedbackReviews}
                value={pendingFeedbackCount}
                description={t.admin.pendingFeedbackReviewsDescription}
                icon={<ShieldIcon size={18} />}
                tone="warning"
              />
            ) : null}
            {canViewAnalytics ? (
              <DashboardStatCard
                label={t.admin.totalRagQueries}
                value={analytics?.usage?.total_queries ?? "-"}
                description={t.admin.totalRagQueriesDescription}
                icon={<PulseIcon size={18} />}
                tone="primary"
              />
            ) : null}
            {canViewAnalytics ? (
              <DashboardStatCard
                label={t.admin.feedbackCoverage}
                value={analytics?.feedback?.feedback_coverage_rate !== undefined
                  ? `${Math.round((analytics.feedback.feedback_coverage_rate ?? 0) * 100)}%`
                  : "-"}
                description={t.admin.feedbackCoverageDescription}
                icon={<GridIcon size={18} />}
                tone="success"
              />
            ) : null}
          </DashboardGrid>
        )}
        {exportMessage ? <p className="text-sm text-[var(--color-muted)]">{exportMessage}</p> : null}
      </DashboardSection>

      {visibleFeatureCount > 0 ? (
        <DashboardSection title={t.admin.adminFeaturesTitle}>
          <div className="flex flex-wrap gap-4">
            {canViewVerification ? (
              <Link href="/app/admin/verifications" className={buttonClassName({ variant: "primary" })}>{t.admin.adminFeatureVerifications}</Link>
            ) : null}
            {canViewKnowledgeBase ? (
              <Link href="/app/admin/knowledge-base" className={buttonClassName({ variant: "primary" })}>{t.admin.adminFeatureKnowledgeBase}</Link>
            ) : null}
            {canViewAnalytics || canExport ? (
              <Link href="/app/admin/analytics" className={buttonClassName({ variant: "primary" })}>{t.admin.adminFeatureAnalyticsExport}</Link>
            ) : null}
            {canViewAuditLogs ? (
              <Link href="/app/admin/audit-logs" className={buttonClassName({ variant: "primary" })}>{t.admin.adminFeatureAuditLogs}</Link>
            ) : null}
          </div>
        </DashboardSection>
      ) : null}

      {visibleFeatureCount > 0 ? (
        <DashboardSection title={t.admin.supportedWorkflows} description={t.admin.supportedWorkflowsDescription}>
          <DashboardGrid columns="three">
            {canViewKnowledgeBase ? (
              <DashboardWorkflowCard
                title={t.admin.knowledgeBaseTitle}
                description={t.admin.knowledgeBaseDescription}
                icon={<FileTextIcon size={18} />}
                status={t.common.liveBadge}
                statusTone="primary"
                actionLabel={t.admin.viewKnowledgeDocuments}
                href="/app/admin/knowledge-base"
              />
            ) : null}
            {canViewRagFeedback ? (
              <DashboardWorkflowCard
                title={t.admin.ragFeedbackTitle}
                description={t.admin.ragFeedbackDescription}
                icon={<ShieldIcon size={18} />}
                status={t.common.liveBadge}
                statusTone="primary"
                actionLabel={t.admin.viewRagFeedback}
                href="/app/admin/rag-feedback"
              />
            ) : null}
            {canViewVerification ? (
              <DashboardWorkflowCard
                title={t.admin.verificationReviewTitle}
                description={t.admin.verificationReviewDescription}
                icon={<ShieldIcon size={18} />}
                status={t.common.liveBadge}
                statusTone="primary"
                actionLabel={t.admin.adminFeatureVerifications}
                href="/app/admin/verifications"
              />
            ) : null}
            {canExport ? (
              <DashboardWorkflowCard
                title={t.admin.datasetExportTitle}
                description={t.admin.datasetExportDescription}
                icon={<PulseIcon size={18} />}
                status={t.common.liveBadge}
                statusTone="success"
                actionLabel={t.admin.adminFeatureAnalyticsExport}
                href="/app/admin/analytics"
              />
            ) : null}
            {canViewAuditLogs ? (
              <DashboardWorkflowCard
                title={t.admin.adminFeatureAuditLogs}
                description={t.admin.backendLimitedDescription}
                icon={<FileTextIcon size={18} />}
                status={t.common.liveBadge}
                statusTone="primary"
                actionLabel={t.admin.adminFeatureAuditLogs}
                href="/app/admin/audit-logs"
              />
            ) : null}
          </DashboardGrid>
        </DashboardSection>
      ) : null}

      <DashboardSection title={t.admin.backendLimitedTitle} description={t.admin.backendLimitedDescription}>
        <DashboardStateCard state="empty" description={t.admin.backendLimitedDescription} />
        <div className="flex flex-wrap gap-2">
          <Badge tone="warning">{t.admin.noGenericAdminApi}</Badge>
        </div>
      </DashboardSection>
    </div>
  );
}
