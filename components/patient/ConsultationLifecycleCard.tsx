"use client";

import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { Card } from "@/components/ui/Card";
import { getConsultationLifecycle, type ConsultationLifecycle } from "@/lib/patient/consultationStatus";
import type { ConsultationStatus } from "@/types/patient";

interface Step {
  key: ConsultationLifecycle | "submitted_marker";
  label: (labels: ReturnType<typeof useAppPreferences>["t"]["patient"]) => string;
  lifecycles: ConsultationLifecycle[];
}

const STEPS: Step[] = [
  {
    key: "submitted_marker",
    label: (p) => p.lifecycleSubmitted,
    lifecycles: ["pending_review", "accepted", "in_progress", "closed", "cancelled"],
  },
  {
    key: "pending_review",
    label: (p) => p.lifecycleDoctorReview,
    lifecycles: ["pending_review", "accepted", "in_progress", "closed"],
  },
  {
    key: "in_progress",
    label: (p) => p.lifecycleFollowUp,
    lifecycles: ["accepted", "in_progress", "closed"],
  },
  {
    key: "closed",
    label: (p) => p.lifecycleClosed,
    lifecycles: ["closed"],
  },
];

interface ConsultationLifecycleCardProps {
  status: ConsultationStatus;
}

export function ConsultationLifecycleCard({ status }: ConsultationLifecycleCardProps) {
  const { t } = useAppPreferences();
  const lifecycle = getConsultationLifecycle(status);

  // For cancelled/rejected show a simple cancelled notice instead of the steps
  if (lifecycle === "cancelled") {
    return (
      <Card>
        <p className="text-sm font-semibold text-[var(--color-text)]">{t.patient.lifecycleTitle}</p>
        <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200">
          {t.patient.statusHelpCancelled}
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <p className="text-sm font-semibold text-[var(--color-text)]">{t.patient.lifecycleTitle}</p>

      <ol className="mt-4 grid grid-cols-2 gap-0 overflow-hidden rounded-2xl border border-[var(--color-border)] sm:grid-cols-4">
        {STEPS.map((step, index) => {
          const isDone = step.lifecycles.includes(lifecycle) && step.key !== "submitted_marker"
            ? STEPS.findIndex((s) => s.key === lifecycle) > index
            : false;
          const isCurrent =
            (step.key === "pending_review" && lifecycle === "pending_review") ||
            (step.key === "in_progress" && (lifecycle === "accepted" || lifecycle === "in_progress")) ||
            (step.key === "closed" && lifecycle === "closed");
          const isReached = step.lifecycles.includes(lifecycle);

          return (
            <li
              key={step.key}
              className={[
                "flex flex-1 flex-col items-center justify-center gap-1 px-3 py-3 text-center text-xs font-semibold transition",
                "min-w-0 border border-transparent border-[var(--color-border)] sm:border-e sm:border-y-0 sm:border-s-0 last:sm:border-e-0",
                isCurrent
                  ? "bg-[color:color-mix(in_srgb,var(--color-primary)_15%,var(--color-surface))] text-[var(--color-primary)]"
                  : isReached || isDone
                    ? "bg-[var(--color-surface-alt)] text-[var(--color-muted)]"
                    : "bg-[var(--color-surface)] text-[var(--color-muted)] opacity-50",
              ].join(" ")}
            >
              <span
                className={[
                  "flex h-6 w-6 items-center justify-center rounded-full text-xs",
                  isCurrent
                    ? "bg-[var(--color-primary)] text-white"
                    : isReached || isDone
                      ? "bg-[var(--color-border)] text-[var(--color-muted)]"
                      : "border border-[var(--color-border)] text-[var(--color-muted)]",
                ].join(" ")}
              >
                {isCurrent ? "●" : isReached || isDone ? "✓" : String(index + 1)}
              </span>
              <span className="break-words leading-5">{step.label(t.patient)}</span>
            </li>
          );
        })}
      </ol>
    </Card>
  );
}
