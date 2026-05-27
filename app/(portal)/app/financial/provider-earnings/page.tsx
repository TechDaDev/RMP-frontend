import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";

export default function FinancialProviderEarningsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        badge={<Badge tone="primary">Financial</Badge>}
        title="Provider Earnings"
        description="Provider payout reporting will appear here once the backend earnings endpoint is enabled."
      />

      <Card>
        <p className="text-sm text-[var(--color-muted)]">
          No earnings API is currently wired in this frontend build. This page is intentionally a placeholder.
        </p>
      </Card>
    </div>
  );
}
