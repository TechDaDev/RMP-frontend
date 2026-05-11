"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { DashboardSection } from "@/components/dashboard/DashboardSection";
import { DashboardStateCard } from "@/components/dashboard/DashboardStateCard";
import { Badge } from "@/components/ui/Badge";
import { Button, buttonClassName } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";
import {
  approveAdminKnowledgeDocument,
  archiveAdminKnowledgeDocument,
  embedAdminKnowledgeDocument,
  getAdminKnowledgeDocumentChunks,
  getAdminKnowledgeDocumentDetail,
  processAdminKnowledgeDocument,
  rejectAdminKnowledgeDocument,
} from "@/lib/admin/adminService";
import type { AdminKnowledgeChunk, AdminKnowledgeDocumentDetail } from "@/types/admin";

function formatDate(value?: string | null) {
  if (!value) {
    return "-";
  }

  return new Date(value).toLocaleString();
}

export default function AdminKnowledgeDocumentDetailPage() {
  const { t } = useAppPreferences();
  const params = useParams<{ id: string }>();
  const id = useMemo(() => String(params?.id ?? ""), [params?.id]);
  const [detail, setDetail] = useState<AdminKnowledgeDocumentDetail | null>(null);
  const [chunks, setChunks] = useState<AdminKnowledgeChunk[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [busyAction, setBusyAction] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      return;
    }

    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const [documentDetail, documentChunks] = await Promise.all([
          getAdminKnowledgeDocumentDetail(id),
          getAdminKnowledgeDocumentChunks(id, { limit: 5 }),
        ]);

        if (cancelled) {
          return;
        }

        setDetail(documentDetail);
        setChunks(documentChunks);
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
  }, [id, t.admin.loadFailedDescription]);

  async function runAction(actionKey: string, task: () => Promise<void>) {
    if (!id || busyAction) {
      return;
    }

    setBusyAction(actionKey);
    setActionMessage(null);

    try {
      await task();
      setActionMessage(t.admin.decisionSucceeded);
      const [documentDetail, documentChunks] = await Promise.all([
        getAdminKnowledgeDocumentDetail(id),
        getAdminKnowledgeDocumentChunks(id, { limit: 5 }),
      ]);
      setDetail(documentDetail);
      setChunks(documentChunks);
    } catch {
      setActionMessage(t.admin.decisionFailed);
    } finally {
      setBusyAction(null);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        badge={<Badge tone="primary">{t.admin.knowledgeBaseTitle}</Badge>}
        title={detail?.title || t.admin.viewDetails}
        description={t.admin.knowledgeDocumentDetailDescription}
        actions={<Link href="/app/admin/knowledge-base" className={buttonClassName({ variant: "secondary", className: "w-full sm:w-auto" })}>{t.patient.backToLabResults}</Link>}
      />

      <DashboardSection title={t.admin.knowledgeDocumentSummary} description={t.admin.knowledgeDocumentSummaryDescription}>
        {loading ? (
          <DashboardStateCard state="loading" description={t.common.loading} />
        ) : error ? (
          <DashboardStateCard
            state="error"
            title={t.admin.loadFailedTitle}
            description={error}
            action={<Button variant="secondary" onClick={() => window.location.reload()}>{t.common.retry}</Button>}
          />
        ) : detail ? (
          <Card className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="primary">{detail.document_type || "-"}</Badge>
              <Badge tone={detail.approval_status === "approved" ? "success" : detail.approval_status === "rejected" ? "danger" : "warning"}>{detail.approval_status || "-"}</Badge>
              <Badge tone="neutral">{detail.processing_status || "-"}</Badge>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <p className="text-sm text-[var(--color-muted)]" dir="ltr">{detail.uploaded_by_email || "-"}</p>
              <p className="text-sm text-[var(--color-muted)]">{formatDate(detail.created_at)}</p>
              <p className="text-sm text-[var(--color-muted)]">{detail.language || "-"}</p>
              <p className="text-sm text-[var(--color-muted)]">{detail.audience || "-"}</p>
              <p className="text-sm text-[var(--color-muted)]">{detail.chunk_count || "0"}</p>
              <p className="text-sm text-[var(--color-muted)]">{detail.security_status || "-"}</p>
            </div>

            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
              <Button variant="secondary" className="w-full" disabled={busyAction !== null} onClick={() => void runAction("process", () => processAdminKnowledgeDocument(id))}>{t.admin.processDocument}</Button>
              <Button variant="secondary" className="w-full" disabled={busyAction !== null} onClick={() => void runAction("approve", () => approveAdminKnowledgeDocument(id))}>{t.admin.approve}</Button>
              <Button variant="secondary" className="w-full" disabled={busyAction !== null} onClick={() => void runAction("embed", () => embedAdminKnowledgeDocument(id))}>{t.admin.embedDocument}</Button>
              <Button variant="secondary" className="w-full" disabled={busyAction !== null} onClick={() => void runAction("archive", () => archiveAdminKnowledgeDocument(id))}>{t.admin.archiveDocument}</Button>
              <Button
                variant="secondary"
                className="w-full"
                disabled={busyAction !== null || rejectReason.trim().length === 0}
                onClick={() => void runAction("reject", () => rejectAdminKnowledgeDocument(id, rejectReason.trim()))}
              >
                {t.admin.reject}
              </Button>
            </div>

            <label className="block space-y-2">
              <span className="text-sm font-semibold text-[var(--color-text)]">{t.admin.approvalReason}</span>
              <input
                value={rejectReason}
                onChange={(event) => setRejectReason(event.target.value)}
                className="min-h-11 w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 text-sm text-[var(--color-text)] outline-none transition focus:border-[var(--color-primary)]"
              />
            </label>

            {actionMessage ? <p className="text-sm text-[var(--color-muted)]">{actionMessage}</p> : null}
          </Card>
        ) : (
          <DashboardStateCard state="empty" title={t.admin.noDocumentsTitle} description={t.admin.noDocumentsDescription} />
        )}
      </DashboardSection>

      <DashboardSection title={t.admin.documentChunksTitle} description={t.admin.documentChunksDescription}>
        {chunks.length === 0 ? (
          <DashboardStateCard state="empty" title={t.admin.noChunksTitle} description={t.admin.noChunksDescription} />
        ) : (
          <div className="space-y-3">
            {chunks.map((chunk) => (
              <Card key={chunk.id || `${chunk.chunk_index}`} className="space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <Badge tone="primary">#{chunk.chunk_index ?? "-"}</Badge>
                  <Badge tone={chunk.has_embedding ? "success" : "warning"}>{chunk.has_embedding ? t.admin.embeddedStatus : t.admin.notEmbeddedStatus}</Badge>
                </div>
                <p className="break-words text-sm text-[var(--color-muted)]">{chunk.text || "-"}</p>
              </Card>
            ))}
          </div>
        )}
      </DashboardSection>
    </div>
  );
}
