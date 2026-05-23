"use client";

import { FormEvent, KeyboardEvent, useMemo, useRef, useState } from "react";
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
  onSend: (body: string) => Promise<void>;
}

interface PreviewImage {
  src: string;
  label: string;
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

function isImageAttachment(path?: string): boolean {
  if (!path) {
    return false;
  }

  const sanitizedPath = path.split("?")[0];
  return /\.(png|jpe?g|gif|webp|bmp|svg|avif)$/i.test(sanitizedPath);
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
  const formRef = useRef<HTMLFormElement | null>(null);
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<PreviewImage | null>(null);

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

    if (!trimmed || !canWrite) {
      return;
    }

    setSending(true);
    setSendError(null);
    try {
      await onSend(trimmed);
      setBody("");
    } catch {
      setSendError(t.patient.noDataDescription);
    } finally {
      setSending(false);
    }
  }

  function handleMessageKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key !== "Enter") {
      return;
    }

    if (event.ctrlKey) {
      return;
    }

    event.preventDefault();
    formRef.current?.requestSubmit();
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
              {message.body ? (
                <p className="mt-2 whitespace-pre-wrap text-sm text-[var(--color-text)]">{message.body}</p>
              ) : null}
              {message.attachments && message.attachments.length > 0 ? (
                <div className="mt-2 flex flex-wrap gap-2">
                  {message.attachments.map((attachment, index) => {
                    if (!attachment.file) {
                      return null;
                    }

                    const key = attachment.id ?? attachment.file ?? String(index);
                    const label = attachment.file_name || attachment.file;

                    if (isImageAttachment(attachment.file_name ?? attachment.file)) {
                      return (
                        <button
                          key={key}
                          type="button"
                          className="group overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] text-start"
                          onClick={() => setPreviewImage({ src: attachment.file as string, label })}
                          aria-label={label}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={attachment.file}
                            alt={label}
                            className="h-24 w-24 object-cover transition group-hover:scale-105"
                          />
                        </button>
                      );
                    }

                    return (
                      <a
                        key={key}
                        href={attachment.file}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-xl border border-[var(--color-border)] px-3 py-2 text-xs font-semibold text-[var(--color-primary)] underline-offset-2 hover:underline"
                      >
                        {label}
                      </a>
                    );
                  })}
                </div>
              ) : null}
            </div>
          ))}
        </div>
      ) : null}

      {blockedMessage ? <p className="text-sm text-[var(--color-muted)]">{blockedMessage}</p> : null}

      <form ref={formRef} className="space-y-2" onSubmit={handleSubmit}>
        <textarea
          value={body}
          onChange={(event) => setBody(event.target.value)}
          onKeyDown={handleMessageKeyDown}
          placeholder={t.doctor.messagePlaceholder}
          className="min-h-24 w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-primary)]"
          disabled={!canWrite || sending}
        />
        {sendError ? <p className="text-sm text-red-600 dark:text-red-300">{sendError}</p> : null}
        <Button type="submit" className="w-full sm:w-auto" disabled={!canWrite || sending || body.trim().length === 0}>
          {sending ? t.doctor.sendingDoctorResponse : t.doctor.sendMessage}
        </Button>
      </form>

      {previewImage ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(3,10,20,0.8)] p-4"
          role="dialog"
          aria-modal="true"
          onClick={() => setPreviewImage(null)}
        >
          <div
            className="max-h-[90vh] w-full max-w-5xl overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-3"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-3 flex items-center justify-between gap-2">
              <p className="truncate text-sm font-semibold text-[var(--color-text)]">{previewImage.label}</p>
              <Button variant="secondary" onClick={() => setPreviewImage(null)}>
                {t.common.cancel}
              </Button>
            </div>
            <div className="flex max-h-[calc(90vh-5rem)] items-center justify-center rounded-xl bg-[var(--color-surface-alt)] p-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewImage.src}
                alt={previewImage.label}
                className="max-h-[calc(90vh-7rem)] w-auto max-w-full object-contain"
              />
            </div>
          </div>
        </div>
      ) : null}
    </Card>
  );
}
