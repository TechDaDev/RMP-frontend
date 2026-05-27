"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { useAuth } from "@/components/auth/AuthProvider";
import { DashboardGrid } from "@/components/dashboard/DashboardGrid";
import { DashboardSection } from "@/components/dashboard/DashboardSection";
import { DashboardStateCard } from "@/components/dashboard/DashboardStateCard";
import { LaboratoryDashboardSummary } from "@/components/laboratory/LaboratoryDashboardSummary";
import { LaboratoryPrivacyNotice } from "@/components/laboratory/LaboratoryPrivacyNotice";
import { LaboratoryTestCatalogPreview } from "@/components/laboratory/LaboratoryTestCatalogPreview";
import { LaboratoryVerificationNotice } from "@/components/laboratory/LaboratoryVerificationNotice";
import { LaboratoryWorkflowCard } from "@/components/laboratory/LaboratoryWorkflowCard";
import { LaboratoryPageFrame } from "@/components/laboratory/ui/LaboratoryPageFrame";
import { Badge } from "@/components/ui/Badge";
import { PageHeader } from "@/components/ui/PageHeader";
import { getLabTestCatalog } from "@/lib/laboratory/laboratoryService";
import type { LaboratorianProfileData } from "@/types/backend";
import type { LaboratoryTestCatalogItem } from "@/types/laboratory";

/**
 * Laboratory dashboard page.
 * 
 * Verification Gate: Laboratorians must have is_approved = true to:
 * - Scan QR codes on lab orders
 * - Create and correct lab results
 * - View the lab test catalog
 * 
 * This gating pattern applies equally to doctors and pharmacists.
 * Profile fields: laboratorian_license_number, laboratory_name, laboratory_address, specialization, etc.
 * Read-only verification fields: verification_status, verified_at, verified_by, verification_notes
 */
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
    <LaboratoryPageFrame>
      <PageHeader
        badge={<Badge tone={isApproved ? "success" : "primary"}>{t.roles.laboratory}</Badge>}
        title={t.laboratory.dashboardTitle}
        description={t.laboratory.dashboardSubtitle}
        actions={<Badge tone={isApproved ? "success" : "primary"}>{isApproved ? t.profile.verificationApproved : t.laboratory.verificationRequired}</Badge>}
      />

      <LaboratoryVerificationNotice verification={verification} roleProfile={roleProfile} />
      <DashboardSection title={t.laboratory.labIdentity} description={t.profile.verificationGuidance}>
        <LaboratoryDashboardSummary roleProfile={roleProfile} verification={verification} catalogCount={catalog.length} />
      </DashboardSection>

      {isApproved ? (
        <>
          <DashboardSection title={t.laboratory.workflowStartsWithQr} description={t.laboratory.laboratoryActionsDisabled}>
            <DashboardGrid columns="two">
              <LaboratoryWorkflowCard />
              <LaboratoryPrivacyNotice />
              <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--card-shadow)]">
                <h3 className="text-base font-semibold text-[var(--color-text)]">Offerings</h3>
                <p className="mt-1 text-sm text-[var(--color-muted)]">Manage catalog-based and custom lab offerings.</p>
                <Link href="/app/lab/offerings" className="mt-3 inline-flex rounded-2xl border border-[var(--color-border)] px-4 py-2 text-sm font-semibold text-[var(--color-text)]">
                  Open offerings
                </Link>
              </div>
              <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--card-shadow)]">
                <h3 className="text-base font-semibold text-[var(--color-text)]">Lab requests</h3>
                <p className="mt-1 text-sm text-[var(--color-muted)]">Quote and manage service requests.</p>
                <Link href="/app/lab/requests" className="mt-3 inline-flex rounded-2xl border border-[var(--color-border)] px-4 py-2 text-sm font-semibold text-[var(--color-text)]">
                  Open requests
                </Link>
              </div>
            </DashboardGrid>
          </DashboardSection>
          <DashboardSection title={t.laboratory.testCatalogPreview} description={t.laboratory.workflowStartsWithQr}>
            <LaboratoryTestCatalogPreview items={visibleCatalog} loading={visibleCatalogLoading} error={visibleCatalogError} />
          </DashboardSection>
        </>
      ) : (
        <DashboardStateCard
          state="empty"
          title={t.laboratory.laboratoryVerificationPending}
          description={t.laboratory.laboratoryActionsDisabled}
        />
      )}
    </LaboratoryPageFrame>
  );
}
