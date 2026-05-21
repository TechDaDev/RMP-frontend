"use client";

import { FormEvent, useMemo, useState } from "react";
import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { canDoctorMessage } from "@/lib/doctor/doctorConsultationStatus";
import type { DoctorMessage } from "@/types/doctor";

interface DoctorMessagesPanelProps {
  status: string;
  isApproved: boolean;
  loading: boolean;
  error: string | null;
  messages: DoctorMessage[];
  onRetry: () => void;
  onSend: (body: string, attachments: File[]) => Promise<void>;
}

function getSenderLabel(message: DoctorMessage): string {
  const fullName = message.sender?.full_name;
  if (fullName && fullName.length > 0) {
    return fullName;
  }

  const firstName = message.sender?.first_name ?? "";
  const lastName = message.sender?.last_name ?? "";
  const fallback = `${firstName} ${lastName}`.trim();

  if (fallback.length > 0) {
    return fallback;
  }

  return message.sender_role ?? "-";
}

export function DoctorMessagesPanel({
  status,
  isApproved,
  loading,
  error,
  messages,
  onRetry,
  onSend,
}: DoctorMessagesPanelProps) {
  const { t } = useAppPreferences();
  const [body, setBody] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);

  const canWrite = isApproved && canDoctorMessage(status);
  const isReadOnlyClosed = status === "closed";

  const blockedMessage = useMemo(() => {
    if (!isApproved) {
      return t.doctor.messagesUnavailablePermission;
    }
    if (isReadOnlyClosed) {
      return t.doctor.messagesReadOnly;
    }
    if (!canDoctorMessage(status)) {
      return t.doctor.messagesUnavailableUntilAccepted;
    }
    return null;
  }, [isApproved, isReadOnlyClosed, status, t.doctor]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = body.trim();

    if ((!trimmed && attachments.length === 0) || !canWrite) {
      return;
    }

    setSending(true);
    setSendError(null);
    try {
      await onSend(trimmed, attachments);
      setBody("");
      setAttachments([]);
    } catch {
      setSendError(t.patient.noDataDescription);
    } finally {
      setSending(false);
    }
  }

  return (
    <Card className="space-y-3">
      <h3 className="text-base font-semibold text-[var(--color-text)]">{t.doctor.doctorMessages}</h3>

      {loading ? <p className="text-sm text-[var(--color-muted)]">{t.patient.loading}</p> : null}

      {error ? (
        <div className="rounded-2xl border border-amber-400/40 bg-amber-100/40 p-3 dark:bg-amber-900/20">
          <p className="text-sm text-[var(--color-text)]">{error}</p>
          <Button variant="secondary" className="mt-2" onClick={onRetry}>
            {t.doctor.retryMessages}
          </Button>
        </div>
      ) : null}

      {!loading && !error && messages.length === 0 ? (
        <p className="text-sm text-[var(--color-muted)]">{t.doctor.noMessagesYet}</p>
      ) : null}

      {!loading && !error && messages.length > 0 ? (
        <div className="max-h-80 space-y-2 overflow-y-auto rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-3">
          {messages.map((message) => (
            <div key={message.id} className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-2">
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-muted)]">
                  {getSenderLabel(message)}
                </p>
                <p className="text-xs text-[var(--color-muted)]">
                  {message.created_at ? new Date(message.created_at).toLocaleString() : "-"}
                </p>
              </div>
              <p className="mt-2 text-sm text-[var(--color-text)] whitespace-pre-wrap">{message.body || "-"}</p>
              {message.attachments && message.attachments.length > 0 ? (
                <div className="mt-2 flex flex-wrap gap-2">
                  {message.attachments.map((attachment, index) => (
                    attachment.file ? (
                      <a
                        key={attachment.id ?? attachment.file ?? String(index)}
                        href={attachment.file}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-xl border border-[var(--color-border)] px-3 py-2 text-xs font-semibold text-[var(--color-primary)] underline-offset-2 hover:underline"
                      >
                        {attachment.file_name || attachment.file}
                      </a>
                    ) : null
                  ))}
                </div>
              ) : null}
            </div>
          ))}
        </div>
      ) : null}

      {blockedMessage ? <p className="text-sm text-[var(--color-muted)]">{blockedMessage}</p> : null}

      <form className="space-y-2" onSubmit={handleSubmit}>
        <textarea
          value={body}
          onChange={(event) => setBody(event.target.value)}
          placeholder={t.doctor.messagePlaceholder}
          className="min-h-24 w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-primary)]"
          disabled={!canWrite || sending}
        />
        <label className="block space-y-2">
          <span className="text-sm font-semibold text-[var(--color-text)]">{t.profile.uploadFile}</span>
          <input
            type="file"
            multiple
            className="min-h-11 w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] outline-none transition file:mr-3 file:rounded-xl file:border-0 file:bg-[var(--color-surface-alt)] file:px-3 file:py-2 file:text-sm file:font-semibold file:text-[var(--color-text)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[color:color-mix(in_srgb,var(--color-primary)_18%,transparent)]"
            onChange={(event) => setAttachments(Array.from(event.target.files ?? []))}
            disabled={!canWrite || sending}
          />
          <p className="text-xs text-[var(--color-muted)]">
            {attachments.length > 0
              ? `${t.profile.selectedFile}: ${attachments.map((file) => file.name).join(", ")}`
              : t.profile.noFileSelected}
          </p>
        </label>
        {sendError ? <p className="text-sm text-red-600 dark:text-red-300">{sendError}</p> : null}
        <Button type="submit" className="w-full sm:w-auto" disabled={!canWrite || sending || (body.trim().length === 0 && attachments.length === 0)}>
          {sending ? t.doctor.sendingDoctorResponse : t.doctor.sendMessage}
        </Button>
      </form>
    </Card>
  );
}
