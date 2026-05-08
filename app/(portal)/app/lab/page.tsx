"use client";

import { useEffect, useMemo, useState } from "react";
import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { useAuth } from "@/components/auth/AuthProvider";
import { LaboratoryDashboardSummary } from "@/components/laboratory/LaboratoryDashboardSummary";
import { LaboratoryPrivacyNotice } from "@/components/laboratory/LaboratoryPrivacyNotice";
import { LaboratoryTestCatalogPreview } from "@/components/laboratory/LaboratoryTestCatalogPreview";
import { LaboratoryVerificationNotice } from "@/components/laboratory/LaboratoryVerificationNotice";
import { LaboratoryWorkflowCard } from "@/components/laboratory/LaboratoryWorkflowCard";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import { ShieldIcon } from "@/components/icons";
import { getLabTestCatalog } from "@/lib/laboratory/laboratoryService";
import type { LaboratorianProfileData } from "@/types/backend";
import type { LaboratoryTestCatalogItem } from "@/types/laboratory";

export default function LaboratoryPortalPage() {
  const { t } = useAppPreferences();
  const { profile, verification } = useAuth();
  const roleProfile = useMemo<LaboratorianProfileData | null>(
    () => (profile?.role_profile && "laboratory_name" in profile.role_profile ? profile.role_profile : null),
    [profile?.role_profile],
  );
  const isApproved = verification?.is_approved === true;
  const [catalog, setCatalog] = useState<LaboratoryTestCatalogItem[]>([]);
  const [catalogLoading, setCatalogLoading] = useState(false);
  const [catalogError, setCatalogError] = useState<string | null>(null);
  const visibleCatalog = isApproved ? catalog : [];
  const visibleCatalogLoading = isApproved ? catalogLoading : false;
  const visibleCatalogError = isApproved ? catalogError : null;

  useEffect(() => {
    if (!isApproved) {
      return;
    }

    let cancelled = false;

    async function loadCatalog() {
      setCatalogLoading(true);
      setCatalogError(null);

      try {
        const items = await getLabTestCatalog();
        if (!cancelled) {
          setCatalog(items);
        }
      } catch {
        if (!cancelled) {
          setCatalogError(t.laboratory.noLabTestsAvailable);
        }
      } finally {
        if (!cancelled) {
          setCatalogLoading(false);
        }
      }
    }

    void loadCatalog();

    return () => {
      cancelled = true;
    };
  }, [isApproved, t.laboratory.noLabTestsAvailable]);

  return (
    <div className="space-y-6">
      <PageHeader
        badge={<Badge tone={isApproved ? "success" : "primary"}>{t.roles.laboratory}</Badge>}
        title={t.laboratory.dashboardTitle}
        description={t.laboratory.dashboardSubtitle}
        actions={<Badge tone={isApproved ? "success" : "primary"}>{isApproved ? t.profile.verificationApproved : t.laboratory.verificationRequired}</Badge>}
      />

      <LaboratoryVerificationNotice verification={verification} roleProfile={roleProfile} />
      <LaboratoryDashboardSummary roleProfile={roleProfile} verification={verification} catalogCount={catalog.length} />

      {isApproved ? (
        <div className="space-y-6">
          <div className="grid gap-6 xl:grid-cols-2">
            <LaboratoryWorkflowCard />
            <LaboratoryPrivacyNotice />
          </div>
          <LaboratoryTestCatalogPreview items={visibleCatalog} loading={visibleCatalogLoading} error={visibleCatalogError} />
        </div>
      ) : (
        <EmptyState
          icon={<ShieldIcon size={20} />}
          title={t.laboratory.laboratoryVerificationPending}
          description={t.laboratory.laboratoryActionsDisabled}
        />
      )}
    </div>
  );
}