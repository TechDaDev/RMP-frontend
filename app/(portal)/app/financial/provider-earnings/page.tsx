"use client";

import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";
import { useAppPreferences } from "@/components/AppPreferencesProvider";

export default function FinancialProviderEarningsPage() {
  const { t } = useAppPreferences();

  return (
    <div className="space-y-6">
      <PageHeader
        badge={<Badge tone="primary">{t.admin.financeRoleBadge}</Badge>}
        title={t.admin.financeProviderEarningsTitle}
        description={t.admin.financeProviderEarningsSubtitle}
      />

      <Card>
        <p className="text-sm text-[var(--color-muted)]">
          {t.admin.financeProviderEarningsPlaceholder}
        </p>
      </Card>
    </div>
  );
}
