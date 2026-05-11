"use client";

import { useEffect, useState } from "react";
import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { DashboardSection } from "@/components/dashboard/DashboardSection";
import { DashboardStateCard } from "@/components/dashboard/DashboardStateCard";
import { Badge } from "@/components/ui/Badge";
import { Button, buttonClassName } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";
import { getAdminRagFeedback, reviewAdminRagFeedback } from "@/lib/admin/adminService";
import type { AdminRagFeedbackItem } from "@/types/admin";
import Link from "next/link";

function formatDate(value?: string | null) {
  if (!value) {
    return "-";
  }

  return new Date(value).toLocaleString();
}

const reviewStatuses: Array<"reviewed" | "dismissed" | "escalated"> = [
  "reviewed",
  "dismissed",
  "escalated",
];

export default function AdminRagFeedbackPage() {
  const { t } = useAppPreferences();
  const [items, setItems] = useState<AdminRagFeedbackItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [workingId, setWorkingId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const feedback = await getAdminRagFeedback();
        if (!cancelled) {
          setItems(feedback);
        }
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

    void load();

    return () => {
      cancelled = true;
    };
  }, [t.admin.loadFailedDescription]);

  async function handleReview(item: AdminRagFeedbackItem, status: "reviewed" | "dismissed" | "escalated") {
    if (workingId) {
      return;
    }

    setWorkingId(item.id);

    try {
      const updated = await reviewAdminRagFeedback(item.id, { review_status: status });
      setItems((prev) => prev.map((entry) => (entry.id === item.id ? updated : entry)));
    } catch {
      setError(t.admin.decisionFailed);
    } finally {
      setWorkingId(null);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        badge={<Badge tone="primary">{t.admin.ragFeedbackTitle}</Badge>}
        title={t.admin.ragFeedbackTitle}
        description={t.admin.ragFeedbackDescription}
        actions={<Link href="/app/admin" className={buttonClassName({ variant: "secondary", className: "w-full sm:w-auto" })}>{t.portal.dashboard}</Link>}
      />

      <DashboardSection title={t.admin.pendingFeedbackReviews} description={t.admin.pendingFeedbackReviewsDescription}>
        {loading ? (
          <DashboardStateCard state="loading" description={t.common.loading} />
        ) : error ? (
          <DashboardStateCard
            state="error"
            title={t.admin.loadFailedTitle}
            description={error}
            action={<Button variant="secondary" onClick={() => window.location.reload()}>{t.common.retry}</Button>}
          />
        ) : items.length === 0 ? (
          <DashboardStateCard state="empty" title={t.admin.noFeedbackTitle} description={t.admin.noFeedbackDescription} />
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <Card key={item.id} className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge tone="primary">{item.rating || "-"}</Badge>
                  <Badge tone={item.needs_admin_review ? "warning" : "success"}>
                    {item.needs_admin_review ? t.admin.reviewRequired : t.admin.reviewNotRequired}
                  </Badge>
                  <Badge tone="neutral">{item.review_status || "pending"}</Badge>
                </div>

                <p className="text-sm font-semibold text-[var(--color-text)]" dir="ltr">{item.doctor_email || "-"}</p>
                <p className="break-words text-sm text-[var(--color-muted)]">{item.comment || "-"}</p>
                <p className="text-xs text-[var(--color-muted)]">{formatDate(item.created_at)}</p>

                <div className="grid gap-2 sm:grid-cols-3">
                  {reviewStatuses.map((status) => (
                    <Button
                      key={status}
                      variant="secondary"
                      className="w-full"
                      disabled={workingId !== null}
                      onClick={() => void handleReview(item, status)}
                    >
                      {status === "reviewed" ? t.admin.markReviewed : status === "dismissed" ? t.admin.dismissReview : t.admin.escalateReview}
                    </Button>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        )}
      </DashboardSection>
    </div>
  );
}
