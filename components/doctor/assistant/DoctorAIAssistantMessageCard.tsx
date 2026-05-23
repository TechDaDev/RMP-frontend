"use client";

import { useMemo } from "react";
import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { DoctorAIAssistantStatusBadge } from "@/components/doctor/assistant/DoctorAIAssistantStatusBadge";
import type {
  DoctorAIAssistantMessage,
  DoctorAIAssistantSourceSummary,
} from "@/types/doctor";

interface DoctorAIAssistantMessageCardProps {
  message: DoctorAIAssistantMessage;
  onMarkRead: (messageId: string, read: boolean) => Promise<void>;
}

function isSourceSummary(value: unknown): value is DoctorAIAssistantSourceSummary {
  return typeof value === "object" && value !== null;
}

function formatConfidence(value?: number | null): string | null {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return null;
  }

  if (value <= 1 && value >= 0) {
    return `${Math.round(value * 100)}%`;
  }

  return `${Math.round(value)}%`;
}

export function DoctorAIAssistantMessageCard({ message, onMarkRead }: DoctorAIAssistantMessageCardProps) {
  const { t } = useAppPreferences();

  const sourceSummary = useMemo(
    () => (isSourceSummary(message.summary) ? message.summary : undefined),
    [message.summary],
  );

  const documentTitles = sourceSummary?.document_titles?.filter(Boolean) ?? [];
  const confidence = formatConfidence(sourceSummary?.confidence);
  const fallbackReason = sourceSummary?.fallback_reason?.trim();
  const createdAt = message.created_at ? new Date(message.created_at).toLocaleString() : "-";
  const isRead = message.status === "read";

  return (
    <Card className="space-y-3 rounded-2xl border-[var(--color-border)] p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <h4 className="text-sm font-semibold text-[var(--color-text)]">{message.title}</h4>
        <DoctorAIAssistantStatusBadge status={message.status} safetyLevel={message.safety_level} />
      </div>

      <p className="text-xs text-[var(--color-muted)]">
        {t.doctor.aiAssistantCreatedAt}: {createdAt}
      </p>

      <p className="whitespace-pre-wrap text-sm leading-7 text-[var(--color-text)]">{message.body}</p>

      {documentTitles.length > 0 ? (
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-muted)]">
            {t.doctor.aiAssistantSources}
          </p>
          <ul className="space-y-1 text-xs text-[var(--color-muted)]">
            {documentTitles.map((title, index) => (
              <li key={`${message.id}-doc-${index}`} className="break-words">• {title}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {confidence ? (
        <p className="text-xs text-[var(--color-muted)]">
          {t.doctor.aiAssistantConfidence}: {confidence}
        </p>
      ) : null}

      {fallbackReason ? (
        <p className="text-xs text-[var(--color-muted)]">
          {t.doctor.aiAssistantFallbackReason}: {fallbackReason}
        </p>
      ) : null}

      {message.source_report ? (
        <p className="text-xs text-[var(--color-muted)]">
          {t.doctor.aiAssistantReportId}: {message.source_report}
        </p>
      ) : null}

      <Button
        variant="secondary"
        onClick={() => void onMarkRead(message.id, !isRead)}
      >
        {isRead ? t.doctor.aiAssistantMarkUnread : t.doctor.aiAssistantMarkRead}
      </Button>
    </Card>
  );
}
