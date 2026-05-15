"use client";

import { useEffect, useState } from "react";
import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { useAuth } from "@/components/auth/AuthProvider";
import { PermissionGuard } from "@/components/auth/PermissionGuard";
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
  const { user, profile } = useAuth();
  const localeTag = resolveLocaleTag(locale);
  const roleProfile = profile?.role_profile as {
    role_display?: string;
    department?: string;
    hire_date?: string;
    last_active?: string;
    has_completed_training?: boolean;
  } | null;
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
      setLoading(true);
      setError(null);

      try {
        const [analyticsData, documents, pendingFeedback] = await Promise.all([
          getAdminRagAnalyticsSummary(),
          getAdminKnowledgeDocuments(),
          getAdminRagFeedback({ review_status: "pending" }),
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
  }, [t.admin.loadFailedDescription]);

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
          <Button variant="secondary" className="w-full sm:w-auto" onClick={() => void handleExportDataset()} disabled={exporting}>
            {exporting ? t.admin.datasetExporting : t.admin.datasetExportAction}
          </Button>
        }
      >
        {loading ? (
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
            <DashboardStatCard
              label={t.admin.totalKnowledgeDocuments}
              value={knowledgeCount}
              description={t.admin.totalKnowledgeDocumentsDescription}
              icon={<FileTextIcon size={18} />}
              tone="info"
            />
            <DashboardStatCard
              label={t.admin.pendingFeedbackReviews}
              value={pendingFeedbackCount}
              description={t.admin.pendingFeedbackReviewsDescription}
              icon={<ShieldIcon size={18} />}
              tone="warning"
            />
            <DashboardStatCard
              label={t.admin.totalRagQueries}
              value={analytics?.usage?.total_queries ?? "-"}
              description={t.admin.totalRagQueriesDescription}
              icon={<PulseIcon size={18} />}
              tone="primary"
            />
            <DashboardStatCard
              label={t.admin.feedbackCoverage}
              value={analytics?.feedback?.feedback_coverage_rate !== undefined
                ? `${Math.round((analytics.feedback.feedback_coverage_rate ?? 0) * 100)}%`
                : "-"}
              description={t.admin.feedbackCoverageDescription}
              icon={<GridIcon size={18} />}
              tone="success"
            />
          </DashboardGrid>
        )}
        {exportMessage ? <p className="text-sm text-[var(--color-muted)]">{exportMessage}</p> : null}
      </DashboardSection>

      {/* Permission-gated admin features */}
      <DashboardSection title={t.admin.adminFeaturesTitle}>
        <div className="flex flex-wrap gap-4">
          <PermissionGuard permission="can_approve_professionals">
            <a href="/app/admin/verifications" className={buttonClassName({ variant: "primary" })}>{t.admin.adminFeatureVerifications}</a>
          </PermissionGuard>
          <PermissionGuard permission="can_manage_knowledge_base">
            <a href="/app/admin/knowledge-base" className={buttonClassName({ variant: "primary" })}>{t.admin.adminFeatureKnowledgeBase}</a>
          </PermissionGuard>
          <PermissionGuard permission="can_export_datasets">
            <a href="/app/admin/analytics" className={buttonClassName({ variant: "primary" })}>{t.admin.adminFeatureAnalyticsExport}</a>
          </PermissionGuard>
          <PermissionGuard permission="can_view_audit_logs">
            <a href="/app/admin/audit-logs" className={buttonClassName({ variant: "primary" })}>{t.admin.adminFeatureAuditLogs}</a>
          </PermissionGuard>
        </div>
      </DashboardSection>

      <DashboardSection title={t.admin.supportedWorkflows} description={t.admin.supportedWorkflowsDescription}>
        <DashboardGrid columns="three">
          <DashboardWorkflowCard
            title={t.admin.knowledgeBaseTitle}
            description={t.admin.knowledgeBaseDescription}
            icon={<FileTextIcon size={18} />}
            status={t.common.liveBadge}
            statusTone="primary"
            actionLabel={t.admin.viewKnowledgeDocuments}
            href="/app/admin/knowledge-base"
          />
          <DashboardWorkflowCard
            title={t.admin.ragFeedbackTitle}
            description={t.admin.ragFeedbackDescription}
            icon={<ShieldIcon size={18} />}
            status={t.common.liveBadge}
            statusTone="primary"
            actionLabel={t.admin.viewRagFeedback}
            href="/app/admin/rag-feedback"
          />
          <DashboardWorkflowCard
            title={t.admin.verificationReviewTitle}
            description={t.admin.verificationReviewDescription}
            icon={<ShieldIcon size={18} />}
            status={t.common.liveBadge}
            statusTone="primary"
            actionLabel={t.admin.adminFeatureVerifications}
            href="/app/admin/verifications"
          />
          <DashboardWorkflowCard
            title={t.admin.datasetExportTitle}
            description={t.admin.datasetExportDescription}
            icon={<PulseIcon size={18} />}
            status={t.common.liveBadge}
            statusTone="success"
            actionLabel={t.admin.datasetExportAction}
            disabled
          />
        </DashboardGrid>
      </DashboardSection>

      <DashboardSection title={t.admin.backendLimitedTitle} description={t.admin.backendLimitedDescription}>
        <DashboardStateCard state="empty" description={t.admin.backendLimitedDescription} />
        <div className="flex flex-wrap gap-2">
          <Badge tone="warning">{t.admin.noGenericAdminApi}</Badge>
        </div>
      </DashboardSection>
    </div>
  );
}
