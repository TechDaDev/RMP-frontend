"use client";

import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { DashboardStateCard } from "@/components/dashboard/DashboardStateCard";
import { DoctorAIAssistantGenerateCard } from "@/components/doctor/assistant/DoctorAIAssistantGenerateCard";
import { DoctorAIAssistantMessageCard } from "@/components/doctor/assistant/DoctorAIAssistantMessageCard";
import type { DoctorAIAssistantMessage } from "@/types/doctor";

interface DoctorAIAssistantPanelProps {
  consultationId: string;
  isApproved: boolean;
  messages: DoctorAIAssistantMessage[];
  loading: boolean;
  error: string | null;
  generating: boolean;
  onRetry: () => void;
  onGenerateFromReport?: (reportId: string, question?: string) => Promise<void>;
  onMarkRead: (messageId: string, read: boolean) => Promise<void>;
}

export function DoctorAIAssistantPanel({
  consultationId,
  isApproved,
  messages,
  loading,
  error,
  generating,
  onRetry,
  onGenerateFromReport,
  onMarkRead,
}: DoctorAIAssistantPanelProps) {
  const { t } = useAppPreferences();

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-[color:color-mix(in_srgb,var(--color-primary)_25%,var(--color-border))] bg-[color:color-mix(in_srgb,var(--color-primary)_8%,var(--color-surface))] px-4 py-3 text-sm leading-7 text-[var(--color-text)]">
        <p className="font-semibold">{t.doctor.aiAssistantSafetyNotice}</p>
        <p className="text-[var(--color-muted)]">{t.doctor.aiAssistantSeparateFromChat}</p>
      </div>

      <DoctorAIAssistantGenerateCard
        isApproved={isApproved}
        generating={generating}
        onGenerateFromReport={onGenerateFromReport}
      />

      {!isApproved ? (
        <DashboardStateCard
          state="empty"
          title={t.doctor.aiAssistantRequiresApprovedDoctor}
          description={t.doctor.aiAssistantDoctorOnly}
        />
      ) : loading ? (
        <DashboardStateCard state="loading" description={t.common.loading} />
      ) : error ? (
        <DashboardStateCard
          state="error"
          title={t.doctor.aiAssistantLoadFailed}
          description={error}
          action={
            <button
              type="button"
              className="rounded-xl border border-[var(--color-border)] px-3 py-2 text-sm font-semibold text-[var(--color-text)]"
              onClick={onRetry}
            >
              {t.doctor.aiAssistantRetry}
            </button>
          }
        />
      ) : messages.length === 0 ? (
        <DashboardStateCard
          state="empty"
          title={t.doctor.aiAssistantNoMessages}
          description={t.doctor.aiAssistantNoMessagesDescription}
        />
      ) : (
        <div className="space-y-3">
          {messages.map((message) => (
            <DoctorAIAssistantMessageCard
              key={`${consultationId}-${message.id}`}
              message={message}
              onMarkRead={onMarkRead}
            />
          ))}
        </div>
      )}
    </div>
  );
}
