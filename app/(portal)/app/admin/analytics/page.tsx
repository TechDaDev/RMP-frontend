"use client";

import Link from "next/link";
import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { DashboardSection } from "@/components/dashboard/DashboardSection";
import { DashboardStateCard } from "@/components/dashboard/DashboardStateCard";
import { buttonClassName } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/PageHeader";

export default function AdminAnalyticsPage() {
  const { t } = useAppPreferences();

  return (
    <div className="space-y-6">
      <PageHeader
        title={t.admin.adminFeatureAnalyticsExport}
        description={t.admin.datasetExportDescription}
        actions={
          <Link href="/app/admin" className={buttonClassName({ variant: "secondary" })}>
            {t.portal.dashboard}
          </Link>
        }
      />

      <DashboardSection title={t.admin.adminFeatureAnalyticsExport} description={t.admin.backendLimitedDescription}>
        <DashboardStateCard
          state="empty"
          title={t.admin.adminFeatureAnalyticsExport}
          description={t.admin.backendLimitedDescription}
        />
      </DashboardSection>
    </div>
  );
}