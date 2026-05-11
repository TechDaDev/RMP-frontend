"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { DashboardSection } from "@/components/dashboard/DashboardSection";
import { DashboardStateCard } from "@/components/dashboard/DashboardStateCard";
import { Badge } from "@/components/ui/Badge";
import { Button, buttonClassName } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";
import { getAdminKnowledgeDocuments } from "@/lib/admin/adminService";
import type { AdminKnowledgeDocument } from "@/types/admin";

function formatDate(value?: string) {
  if (!value) {
    return "-";
  }

  return new Date(value).toLocaleString();
}

export default function AdminKnowledgeBasePage() {
  const { t } = useAppPreferences();
  const [documents, setDocuments] = useState<AdminKnowledgeDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadDocuments() {
      setLoading(true);
      setError(null);

      try {
        const response = await getAdminKnowledgeDocuments();
        if (!cancelled) {
          setDocuments(response);
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

    void loadDocuments();

    return () => {
      cancelled = true;
    };
  }, [t.admin.loadFailedDescription]);

  return (
    <div className="space-y-6">
      <PageHeader
        badge={<Badge tone="primary">{t.admin.knowledgeBaseTitle}</Badge>}
        title={t.admin.knowledgeBaseTitle}
        description={t.admin.knowledgeBaseDescription}
        actions={<Link href="/app/admin" className={buttonClassName({ variant: "secondary", className: "w-full sm:w-auto" })}>{t.portal.dashboard}</Link>}
      />

      <DashboardSection title={t.admin.totalKnowledgeDocuments} description={t.admin.totalKnowledgeDocumentsDescription}>
        {loading ? (
          <DashboardStateCard state="loading" description={t.common.loading} />
        ) : error ? (
          <DashboardStateCard
            state="error"
            title={t.admin.loadFailedTitle}
            description={error}
            action={<Button variant="secondary" onClick={() => window.location.reload()}>{t.common.retry}</Button>}
          />
        ) : documents.length === 0 ? (
          <DashboardStateCard state="empty" title={t.admin.noDocumentsTitle} description={t.admin.noDocumentsDescription} />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {documents.map((doc) => (
              <Card key={doc.id} className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <Badge tone="primary">{doc.document_type || "-"}</Badge>
                  <Badge tone={doc.approval_status === "approved" ? "success" : doc.approval_status === "rejected" ? "danger" : "warning"}>
                    {doc.approval_status || "-"}
                  </Badge>
                </div>
                <h3 className="break-words text-base font-bold text-[var(--color-text)]">{doc.title || "-"}</h3>
                <p className="text-sm text-[var(--color-muted)]" dir="ltr">{doc.uploaded_by_email || "-"}</p>
                <p className="text-xs text-[var(--color-muted)]">{formatDate(doc.created_at)}</p>
                <Link
                  href={`/app/admin/knowledge-base/${doc.id}`}
                  className={buttonClassName({ variant: "secondary", className: "w-full" })}
                >
                  {t.admin.viewDetails}
                </Link>
              </Card>
            ))}
          </div>
        )}
      </DashboardSection>
    </div>
  );
}
