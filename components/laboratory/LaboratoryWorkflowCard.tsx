import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { LabIcon, PulseIcon, ShieldIcon } from "@/components/icons";

export function LaboratoryWorkflowCard() {
  const { t } = useAppPreferences();

  const steps = [
    {
      title: t.laboratory.scanLabOrder,
      description: t.laboratory.workflowStartsWithQr,
      badge: t.laboratory.scanQrComingNext,
      Icon: ShieldIcon,
    },
    {
      title: t.laboratory.completeItems,
      description: t.laboratory.completeItemsAfterScan,
      badge: t.laboratory.completedItems,
      Icon: LabIcon,
    },
    {
      title: t.laboratory.createResult,
      description: t.laboratory.createResultAfterCompletion,
      badge: t.laboratory.resultStatusSubmitted,
      Icon: PulseIcon,
    },
  ];

  return (
    <Card className="rounded-[2rem]">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-[var(--color-text)]">{t.laboratory.workflowStartsWithQr}</h2>
          <p className="mt-1 text-sm leading-7 text-[var(--color-muted)]">{t.laboratory.scanQrComingNext}</p>
        </div>
        <Badge tone="primary">{t.laboratory.labOrderDetail}</Badge>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        {steps.map(({ title, description, badge, Icon }) => (
          <div key={title} className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--color-surface)] text-[var(--color-primary)]">
                <Icon size={18} />
              </div>
              <Badge tone="neutral">{badge}</Badge>
            </div>
            <h3 className="mt-4 text-base font-semibold text-[var(--color-text)]">{title}</h3>
            <p className="mt-2 text-sm leading-7 text-[var(--color-muted)]">{description}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
