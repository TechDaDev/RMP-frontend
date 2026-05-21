"use client";

import { useState, type FormEvent } from "react";
import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import type { ConsultationMessage } from "@/types/patient";

const textAreaClassName = "w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text)] outline-none transition focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[color:color-mix(in_srgb,var(--color-primary)_18%,transparent)]";

function formatDate(value?: string) {
  if (!value) {
    return "-";
  }

  return new Date(value).toLocaleString();
}

function getSenderLabel(message: ConsultationMessage, fallbackLabel: string): string {
  const fullName = message.sender?.full_name;
  if (fullName && fullName.length > 0) {
    return fullName;
  }

  const firstName = message.sender?.first_name ?? "";
  const lastName = message.sender?.last_name ?? "";
  const combinedName = `${firstName} ${lastName}`.trim();

  if (combinedName.length > 0) {
    return combinedName;
  }

  if (message.sender?.email) {
    return message.sender.email;
  }

  if (message.sender_role) {
    return message.sender_role;
  }

  return fallbackLabel;
}

interface ConsultationMessagesPanelProps {
  canSend: boolean;
  unavailableReason?: string | null;
  messages: ConsultationMessage[];
  sending: boolean;
  error?: string | null;
  success?: string | null;
  onRefresh: () => void;
  onSend: (body: string, attachments: File[]) => Promise<void>;
}

export function ConsultationMessagesPanel({
  canSend,
  unavailableReason,
  messages,
  sending,
  error,
  success,
  onRefresh,
  onSend,
}: ConsultationMessagesPanelProps) {
  const { t } = useAppPreferences();
  const [body, setBody] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await onSend(body, attachments);
    setBody("");
    setAttachments([]);
  }

  return (
    <Card className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h2 className="break-words text-lg font-bold text-[var(--color-text)]">{t.patient.messagesTitle}</h2>
          <p className="mt-2 text-sm text-[var(--color-muted)]">{t.patient.messagesSubtitle}</p>
        </div>
        <Button variant="secondary" className="w-full sm:w-auto" onClick={onRefresh}>{t.patient.messagesRefresh}</Button>
      </div>

      {messages.length > 0 ? (
        <div className="space-y-3">
          {messages.map((message) => (
            <div key={message.id} className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] px-4 py-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="break-words text-sm font-semibold text-[var(--color-text)]">{getSenderLabel(message, t.portal.demoUser)}</p>
                <p className="text-xs text-[var(--color-muted)]">{formatDate(message.created_at)}</p>
              </div>
              <p className="mt-3 break-words text-sm leading-7 text-[var(--color-text)]">{message.body}</p>
              {message.attachments && message.attachments.length > 0 ? (
                <div className="mt-3 flex flex-wrap gap-2">
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
      ) : canSend ? (
        <EmptyState title={t.patient.messagesEmptyTitle} description={t.patient.messagesEmptyDescription} />
      ) : null}

      {!canSend && unavailableReason ? (
        <p className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-100">
          {unavailableReason}
        </p>
      ) : null}

      {success ? <p className="text-sm font-medium text-green-600 dark:text-green-300">{success}</p> : null}
      {error ? <p className="text-sm font-medium text-red-600 dark:text-red-300">{error}</p> : null}

      {canSend ? (
        <form className="space-y-4" onSubmit={handleSubmit} noValidate>
          <textarea
            className={textAreaClassName}
            rows={4}
            value={body}
            onChange={(event) => setBody(event.target.value)}
            placeholder={t.patient.messagePlaceholder}
            disabled={sending}
          />
          <label className="block space-y-2">
            <span className="text-sm font-semibold text-[var(--color-text)]">{t.profile.uploadFile}</span>
            <input
              type="file"
              multiple
              className="min-h-11 w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] outline-none transition file:mr-3 file:rounded-xl file:border-0 file:bg-[var(--color-surface-alt)] file:px-3 file:py-2 file:text-sm file:font-semibold file:text-[var(--color-text)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[color:color-mix(in_srgb,var(--color-primary)_18%,transparent)]"
              onChange={(event) => setAttachments(Array.from(event.target.files ?? []))}
              disabled={sending}
            />
            <p className="text-xs text-[var(--color-muted)]">
              {attachments.length > 0
                ? `${t.profile.selectedFile}: ${attachments.map((file) => file.name).join(", ")}`
                : t.profile.noFileSelected}
            </p>
          </label>
          <Button type="submit" className="w-full sm:w-auto" disabled={sending || (body.trim().length === 0 && attachments.length === 0)}>
            {sending ? t.patient.sendingMessage : t.patient.sendMessage}
          </Button>
        </form>
      ) : null}
    </Card>
  );
}
