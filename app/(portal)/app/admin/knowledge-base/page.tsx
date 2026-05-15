"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { DashboardSection } from "@/components/dashboard/DashboardSection";
import { DashboardStateCard } from "@/components/dashboard/DashboardStateCard";
import { Badge } from "@/components/ui/Badge";
import { Button, buttonClassName } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";
import { createAdminKnowledgeDocument, getAdminKnowledgeDocuments } from "@/lib/admin/adminService";
import { ApiError } from "@/lib/api/errors";
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
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "",
    document_type: "medical_book",
    language: "ar",
    audience: "doctor",
    specialty: "",
    file: null as File | null,
  });

  const loadDocuments = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getAdminKnowledgeDocuments();
      setDocuments(response);
    } catch {
      setError(t.admin.loadFailedDescription);
    } finally {
      setLoading(false);
    }
  }, [t.admin.loadFailedDescription]);

  useEffect(() => {
    void loadDocuments();
  }, [loadDocuments]);

  async function handleUpload(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!form.file || uploading) {
      return;
    }

    setUploading(true);
    setUploadError(null);
    setUploadSuccess(null);

    try {
      await createAdminKnowledgeDocument({
        title: form.title.trim(),
        document_type: form.document_type,
        language: form.language,
        audience: form.audience.trim(),
        specialty: form.specialty,
        file: form.file,
      });

      setUploadSuccess("Document uploaded successfully.");
      setForm((prev) => ({
        ...prev,
        title: "",
        specialty: "",
        file: null,
      }));
      void loadDocuments();
    } catch (err) {
      if (err instanceof ApiError) {
        setUploadError(err.message || t.admin.decisionFailed);
      } else {
        setUploadError(t.admin.decisionFailed);
      }
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        badge={<Badge tone="primary">{t.admin.knowledgeBaseTitle}</Badge>}
        title={t.admin.knowledgeBaseTitle}
        description={t.admin.knowledgeBaseDescription}
        actions={<Link href="/app/admin" className={buttonClassName({ variant: "secondary", className: "w-full sm:w-auto" })}>{t.portal.dashboard}</Link>}
      />

      <DashboardSection title="Upload Document" description="Add a new document to the Knowledge Base.">
        <Card>
          <form className="grid gap-4 md:grid-cols-2" onSubmit={handleUpload}>
            <label className="space-y-1 text-sm font-medium text-[var(--color-text)]">
              Title
              <input
                className="min-h-11 w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 text-sm text-[var(--color-text)]"
                value={form.title}
                onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
                required
              />
            </label>

            <label className="space-y-1 text-sm font-medium text-[var(--color-text)]">
              Document Type
              <select
                className="min-h-11 w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 text-sm text-[var(--color-text)]"
                value={form.document_type}
                onChange={(event) => setForm((prev) => ({ ...prev, document_type: event.target.value }))}
              >
                <option value="medical_book">medical_book</option>
                <option value="laboratory_book">laboratory_book</option>
                <option value="clinical_guideline">clinical_guideline</option>
                <option value="drug_reference">drug_reference</option>
                <option value="patient_education">patient_education</option>
                <option value="platform_policy">platform_policy</option>
                <option value="other">other</option>
              </select>
            </label>

            <label className="space-y-1 text-sm font-medium text-[var(--color-text)]">
              Language
              <select
                className="min-h-11 w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 text-sm text-[var(--color-text)]"
                value={form.language}
                onChange={(event) => setForm((prev) => ({ ...prev, language: event.target.value }))}
              >
                <option value="ar">Arabic</option>
                <option value="en">English</option>
                <option value="ku">Kurdish</option>
              </select>
            </label>

            <label className="space-y-1 text-sm font-medium text-[var(--color-text)]">
              Audience
              <input
                className="min-h-11 w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 text-sm text-[var(--color-text)]"
                value={form.audience}
                onChange={(event) => setForm((prev) => ({ ...prev, audience: event.target.value }))}
                required
              />
            </label>

            <label className="space-y-1 text-sm font-medium text-[var(--color-text)] md:col-span-2">
              Specialty (optional)
              <input
                className="min-h-11 w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 text-sm text-[var(--color-text)]"
                value={form.specialty}
                onChange={(event) => setForm((prev) => ({ ...prev, specialty: event.target.value }))}
              />
            </label>

            <label className="space-y-1 text-sm font-medium text-[var(--color-text)] md:col-span-2">
              File (PDF, DOCX, TXT)
              <input
                type="file"
                accept=".pdf,.docx,.txt"
                className="min-h-11 w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2 text-sm text-[var(--color-text)]"
                onChange={(event) => setForm((prev) => ({ ...prev, file: event.target.files?.[0] ?? null }))}
                required
              />
            </label>

            {uploadError ? <p className="md:col-span-2 text-sm font-medium text-red-600 dark:text-red-300">{uploadError}</p> : null}
            {uploadSuccess ? <p className="md:col-span-2 text-sm font-medium text-green-700 dark:text-green-300">{uploadSuccess}</p> : null}

            <div className="md:col-span-2">
              <Button type="submit" disabled={uploading || !form.file || !form.title.trim()}>
                {uploading ? "Uploading..." : "Upload Document"}
              </Button>
            </div>
          </form>
        </Card>
      </DashboardSection>

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
