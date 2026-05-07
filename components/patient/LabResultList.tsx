"use client";

import Link from "next/link";
import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { ArrowIcon, LabIcon } from "@/components/icons";
import { buttonClassName } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import type { PatientLabResultListItem } from "@/types/patient";

function formatDate(value?: string | null) {
  if (!value) {
    return "-";
  }
  return new Date(value).toLocaleString();
}

interface LabResultListProps {
  results: PatientLabResultListItem[];
}

export function LabResultList({ results }: LabResultListProps) {
  const { t } = useAppPreferences();

  if (results.length === 0) {
    return <EmptyState icon={<LabIcon size={20} />} title={t.patient.labResultsEmptyTitle} description={t.patient.labResultsEmptyDescription} />;
  }

  return (
    <div className="space-y-4">
      {results.map((result) => (
        <Card key={result.id} className="rounded-[2rem]">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">{t.patient.status}</p>
                <p className="mt-2 text-sm font-semibold text-[var(--color-text)]">{t.patient.statusLabels[result.status ?? "released"] ?? result.status ?? "-"}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">{t.patient.value}</p>
                <p className="mt-2 text-sm font-semibold text-[var(--color-text)]">{result.numeric_value || result.text_value || result.blood_group_value || "-"}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">{t.patient.consultation}</p>
                <p className="mt-2 text-sm font-semibold text-[var(--color-text)]">{result.test_label}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">{t.patient.verifiedAt}</p>
                <p className="mt-2 text-sm font-semibold text-[var(--color-text)]">{formatDate(result.released_at)}</p>
              </div>
            </div>
            <Link href={`/app/patient/lab-results/${result.id}`} className={buttonClassName({ variant: "secondary" })}>
              {t.patient.labResultDetailTitle}
              <ArrowIcon size={16} />
            </Link>
          </div>
        </Card>
      ))}
    </div>
  );
}