"use client";

import { PulseIcon } from "@/components/icons";
import { Card } from "@/components/ui/Card";
import { useAppPreferences } from "@/components/AppPreferencesProvider";

interface DoctorAiCaseSummaryCardProps {
  summary?: string | null;
}

export function DoctorAiCaseSummaryCard({ summary }: DoctorAiCaseSummaryCardProps) {
  const { t } = useAppPreferences();
  const normalizedSummary = summary?.trim();

  return (
    <Card className="space-y-4">
      <div className="flex items-center gap-2">
        <PulseIcon size={18} />
        <h3 className="text-base font-semibold text-[var(--color-text)]">{t.doctor.aiCaseSummaryTitle}</h3>
      </div>

      <div className="rounded-2xl border border-[var(--color-border)] bg-[color:color-mix(in_srgb,var(--color-primary)_10%,var(--color-surface))] px-4 py-3">
        {normalizedSummary ? (
          <p className="whitespace-pre-wrap text-sm leading-7 text-[var(--color-text)]">{normalizedSummary}</p>
        ) : (
          <p className="text-sm text-[var(--color-muted)]">{t.doctor.aiCaseSummaryFallback}</p>
        )}
      </div>

      <p className="text-xs leading-6 text-[var(--color-muted)]">{t.doctor.aiCaseSummaryDisclaimer}</p>
    </Card>
  );
}
