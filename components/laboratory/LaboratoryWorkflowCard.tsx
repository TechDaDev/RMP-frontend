import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { DashboardGrid } from "@/components/dashboard/DashboardGrid";
import { DashboardWorkflowCard } from "@/components/dashboard/DashboardWorkflowCard";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { LabIcon, PulseIcon, ShieldIcon } from "@/components/icons";

export function LaboratoryWorkflowCard() {
  const { t } = useAppPreferences();

  const steps = [
    {
      title: t.laboratory.scanLabOrder,
      description: t.laboratory.workflowStartsWithQr,
      badge: t.common.liveBadge,
      tone: "primary" as const,
      Icon: ShieldIcon,
      href: "/app/lab/scan",
      actionLabel: t.laboratory.scanLabOrder,
    },
    {
      title: t.laboratory.completeItems,
      description: t.laboratory.completeItemsAfterScan,
      badge: t.laboratory.scanQrComingNext,
      tone: "neutral" as const,
      Icon: LabIcon,
    },
    {
      title: t.laboratory.createResult,
      description: t.laboratory.createResultAfterCompletion,
      badge: t.laboratory.resultStatusSubmitted,
      tone: "neutral" as const,
      Icon: PulseIcon,
    },
  ];

  return (
    <Card>
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-[var(--color-text)]">{t.laboratory.workflowStartsWithQr}</h2>
          <p className="mt-1 text-sm leading-7 text-[var(--color-muted)]">{t.laboratory.scanQrComingNext}</p>
        </div>
        <Badge tone="primary">{t.laboratory.labOrderDetail}</Badge>
      </div>

      <div className="mt-5">
        <DashboardGrid columns="three">
          {steps.map(({ title, description, badge, tone, Icon, href, actionLabel }) => (
            <DashboardWorkflowCard
              key={title}
              title={title}
              description={description}
              status={badge}
              statusTone={tone}
              icon={<Icon size={18} />}
              href={href}
              actionLabel={actionLabel}
              surface="panel"
            />
          ))}
        </DashboardGrid>
      </div>
    </Card>
  );
}
