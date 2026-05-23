"use client";

import { PulseIcon } from "@/components/icons";
import { Card } from "@/components/ui/Card";
import { useAppPreferences } from "@/components/AppPreferencesProvider";

interface DoctorAiCaseSummaryCardProps {
  summary?: string | null;
}

function splitSummaryIntoParagraphs(summary: string): string[] {
  const sentences = summary
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);

  if (sentences.length === 0) {
    return [summary];
  }

  const paragraphs: string[] = [];
  let current = "";

  for (const sentence of sentences) {
    const candidate = current ? `${current} ${sentence}` : sentence;
    if (candidate.length > 230 && current) {
      paragraphs.push(current);
      current = sentence;
    } else {
      current = candidate;
    }
  }

  if (current) {
    paragraphs.push(current);
  }

  return paragraphs;
}

export function DoctorAiCaseSummaryCard({ summary }: DoctorAiCaseSummaryCardProps) {
  const { t } = useAppPreferences();
  const normalizedSummary = summary?.trim();
  const summaryParagraphs = normalizedSummary ? splitSummaryIntoParagraphs(normalizedSummary) : [];

  return (
    <Card className="space-y-4 rounded-2xl border-[color:color-mix(in_srgb,var(--color-primary)_22%,var(--color-border))] bg-[color:color-mix(in_srgb,var(--color-primary)_4%,var(--color-surface))] p-4 md:p-5">
      <div className="flex items-center gap-2.5">
        <PulseIcon size={18} className="text-[var(--color-primary)]" />
        <h3 className="text-base font-semibold tracking-[0.01em] text-[var(--color-text)]">
          {t.doctor.aiCaseSummaryTitle}
        </h3>
      </div>

      <div className="max-h-[26rem] overflow-y-auto rounded-xl border border-[var(--color-border)] bg-[color:color-mix(in_srgb,var(--color-surface)_82%,white)] px-4 py-3.5">
        {normalizedSummary ? (
          <div className="space-y-3">
            {summaryParagraphs.map((paragraph, index) => (
              <p key={`${index}-${paragraph.slice(0, 24)}`} className="text-[15px] leading-7 text-[var(--color-text)]">
                {paragraph}
              </p>
            ))}
          </div>
        ) : (
          <p className="text-sm text-[var(--color-muted)]">{t.doctor.aiCaseSummaryFallback}</p>
        )}
      </div>

      <p className="rounded-lg bg-[color:color-mix(in_srgb,var(--color-primary)_8%,transparent)] px-3 py-2 text-xs leading-6 text-[var(--color-muted)]">
        {t.doctor.aiCaseSummaryDisclaimer}
      </p>
    </Card>
  );
}
