"use client";

import { useState, type FormEvent } from "react";
import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import type { ConsultationMessage, ConsultationStatus } from "@/types/patient";

const textAreaClassName = "w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text)] outline-none transition focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[color:color-mix(in_srgb,var(--color-primary)_18%,transparent)]";

function formatDate(value?: string) {
  if (!value) {
    return "-";
  }

  return new Date(value).toLocaleString();
}

interface ConsultationMessagesPanelProps {
  status: ConsultationStatus;
  messages: ConsultationMessage[];
  sending: boolean;
  error?: string | null;
  success?: string | null;
  onRefresh: () => void;
  onSend: (body: string) => Promise<void>;
}

export function ConsultationMessagesPanel({
  status,
  messages,
  sending,
  error,
  success,
  onRefresh,
  onSend,
}: ConsultationMessagesPanelProps) {
  const { t } = useAppPreferences();
  const [body, setBody] = useState("");
  const canSend = status === "accepted" || status === "doctor_responded";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await onSend(body);
    setBody("");
  }

  return (
    <Card className="space-y-5 rounded-[2rem]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-[var(--color-text)]">{t.patient.messagesTitle}</h2>
          <p className="mt-2 text-sm text-[var(--color-muted)]">{t.patient.messagesSubtitle}</p>
        </div>
        <Button variant="secondary" onClick={onRefresh}>{t.patient.messagesRefresh}</Button>
      </div>

      {messages.length === 0 ? (
        <EmptyState title={t.patient.messagesEmptyTitle} description={t.patient.messagesEmptyDescription} />
      ) : (
        <div className="space-y-3">
          {messages.map((message) => (
            <div key={message.id} className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] px-4 py-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm font-semibold text-[var(--color-text)]">{message.sender?.full_name || t.portal.demoUser}</p>
                <p className="text-xs text-[var(--color-muted)]">{formatDate(message.created_at)}</p>
              </div>
              <p className="mt-3 text-sm leading-7 text-[var(--color-text)]">{message.body}</p>
            </div>
          ))}
        </div>
      )}

      {!canSend ? (
        <p className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-100">
          {t.patient.messagesUnavailable}
        </p>
      ) : null}

      {success ? <p className="text-sm font-medium text-green-600 dark:text-green-300">{success}</p> : null}
      {error ? <p className="text-sm font-medium text-red-600 dark:text-red-300">{error}</p> : null}

      <form className="space-y-4" onSubmit={handleSubmit} noValidate>
        <textarea
          className={textAreaClassName}
          rows={4}
          value={body}
          onChange={(event) => setBody(event.target.value)}
          placeholder={t.patient.messagePlaceholder}
          disabled={!canSend || sending}
        />
        <Button type="submit" disabled={!canSend || sending || body.trim().length === 0}>
          {sending ? t.patient.sendingMessage : t.patient.sendMessage}
        </Button>
      </form>
    </Card>
  );
}