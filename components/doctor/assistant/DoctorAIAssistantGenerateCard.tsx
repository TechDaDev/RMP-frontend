"use client";

import { useState, type FormEvent } from "react";
import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

interface DoctorAIAssistantGenerateCardProps {
  isApproved: boolean;
  generating: boolean;
  onGenerateFromReport?: (reportId: string, question?: string) => Promise<void>;
}

const fieldClassName =
  "min-h-11 w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] outline-none transition focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[color:color-mix(in_srgb,var(--color-primary)_18%,transparent)]";

export function DoctorAIAssistantGenerateCard({
  isApproved,
  generating,
  onGenerateFromReport,
}: DoctorAIAssistantGenerateCardProps) {
  const { t } = useAppPreferences();
  const [reportId, setReportId] = useState("");
  const [question, setQuestion] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!onGenerateFromReport || !isApproved) {
      return;
    }

    const normalizedReportId = reportId.trim();
    if (!normalizedReportId) {
      return;
    }

    await onGenerateFromReport(normalizedReportId, question.trim() || undefined);
    setQuestion("");
  }

  return (
    <Card className="space-y-3 rounded-2xl border-[color:color-mix(in_srgb,var(--color-primary)_20%,var(--color-border))]">
      <div>
        <h4 className="text-sm font-semibold text-[var(--color-text)]">{t.doctor.aiAssistantGenerateTitle}</h4>
        <p className="mt-1 text-xs leading-6 text-[var(--color-muted)]">{t.doctor.aiAssistantGenerateDescription}</p>
      </div>

      <form className="space-y-3" onSubmit={handleSubmit} noValidate>
        <label className="block space-y-1.5">
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-muted)]">
            {t.doctor.aiAssistantReportId}
          </span>
          <input
            value={reportId}
            onChange={(event) => setReportId(event.target.value)}
            className={fieldClassName}
            disabled={!isApproved || generating}
          />
        </label>

        <label className="block space-y-1.5">
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-muted)]">
            {t.doctor.aiAssistantQuestion}
          </span>
          <textarea
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            placeholder={t.doctor.aiAssistantQuestionPlaceholder}
            rows={3}
            className={fieldClassName}
            disabled={!isApproved || generating}
          />
        </label>

        <p className="text-xs leading-6 text-[var(--color-muted)]">{t.doctor.aiAssistantProcessedReportRequired}</p>

        <Button
          type="submit"
          disabled={!isApproved || generating || !onGenerateFromReport || reportId.trim().length === 0}
        >
          {generating ? t.doctor.aiAssistantGenerating : t.doctor.aiAssistantGenerate}
        </Button>
      </form>
    </Card>
  );
}
