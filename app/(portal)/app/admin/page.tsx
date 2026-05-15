"use client";

import { useEffect, useMemo, useState } from "react";
import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { useAuth } from "@/components/auth/AuthProvider";
import { DashboardGrid } from "@/components/dashboard/DashboardGrid";
import { DashboardSection } from "@/components/dashboard/DashboardSection";
import { DashboardStatCard } from "@/components/dashboard/DashboardStatCard";
import { DashboardStateCard } from "@/components/dashboard/DashboardStateCard";
import { DashboardWorkflowCard } from "@/components/dashboard/DashboardWorkflowCard";
import { FileTextIcon, GridIcon, PulseIcon, ShieldIcon } from "@/components/icons";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";
import {
  exportAdminRagDatasetJson,
  getAdminKnowledgeDocuments,
  getAdminRagAnalyticsSummary,
  getAdminRagFeedback,
} from "@/lib/admin/adminService";
import { localizeGovernorate } from "@/lib/locations/governorates";
import type { AdminRagAnalyticsSummary } from "@/types/admin";
import type { UserProfileData } from "@/types/backend";

function formatDate(value?: string | null) {
  if (!value) {
    return "-";
  }

  return new Date(value).toLocaleString();
}

export default function AdminPortalPage() {
  const { t, locale } = useAppPreferences();
  const { user, profile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [analytics, setAnalytics] = useState<AdminRagAnalyticsSummary | null>(null);
  const [knowledgeCount, setKnowledgeCount] = useState(0);
  const [pendingFeedbackCount, setPendingFeedbackCount] = useState(0);
  const [exporting, setExporting] = useState(false);
  const [exportMessage, setExportMessage] = useState<string | null>(null);

  const userProfile = useMemo<UserProfileData | null>(() => profile?.user_profile ?? null, [profile?.user_profile]);

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

      <DashboardSection title={t.admin.adminIdentity} description={t.admin.adminIdentityDescription}>
        <Card className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="break-words text-base font-bold text-[var(--color-text)]">{user?.full_name || user?.email || "-"}</p>
              <p className="text-sm text-[var(--color-muted)]" dir="ltr">{user?.email || "-"}</p>
            </div>
            <Badge tone={user?.is_active ? "success" : "warning"}>
              {user?.is_active ? t.profile.activeAccount : t.profile.inactiveAccount}
            </Badge>
          </div>

          <DashboardGrid columns="three">
            <DashboardStatCard label={t.profile.phone} value={userProfile?.phone_number || "-"} tone="neutral" surface="panel" />
            <DashboardStatCard
              label={t.profile.governorate}
              value={localizeGovernorate(userProfile?.governorate, locale) || "-"}
              tone="neutral"
              surface="panel"
            />
            <DashboardStatCard label={t.patient.updatedAt} value={formatDate(userProfile?.updated_at)} tone="neutral" surface="panel" />
          </DashboardGrid>
        </Card>
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
            actionLabel={t.admin.viewRagFeedback}
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
