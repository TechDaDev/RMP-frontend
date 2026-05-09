"use client";

import { useMemo } from "react";
import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { useAuth } from "@/components/auth/AuthProvider";
import { RequireRole } from "@/components/auth/RequireRole";
import { PharmacistDashboardSummary } from "@/components/pharmacist/PharmacistDashboardSummary";
import { PharmacistPrivacyNotice } from "@/components/pharmacist/PharmacistPrivacyNotice";
import { PharmacistVerificationNotice } from "@/components/pharmacist/PharmacistVerificationNotice";
import { PharmacistWorkflowCard } from "@/components/pharmacist/PharmacistWorkflowCard";
import { FileTextIcon, PharmacyIcon, PrescriptionIcon, ShieldIcon } from "@/components/icons";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import { canPharmacistScan } from "@/lib/pharmacist/pharmacistStatus";
import type { PharmacistProfileData, UserProfileData } from "@/types/backend";

export default function PharmacistPortalPage() {
  const { t } = useAppPreferences();
  const { user, profile, verification } = useAuth();
  const isApproved = verification?.is_approved === true;
  const canStartWorkflow = canPharmacistScan(isApproved);
  const hasScanRoute = false;
  const hasHistoryEndpoint = false;

  const roleProfile = useMemo<PharmacistProfileData | null>(
    () => (profile?.role_profile && "pharmacy_name" in profile.role_profile ? profile.role_profile : null),
    [profile?.role_profile],
  );

  const userProfile = useMemo<UserProfileData | null>(
    () => profile?.user_profile ?? null,
    [profile?.user_profile],
  );

  const workflowCards = [
    {
      title: t.pharmacist.scanPrescription,
      subtitle: t.pharmacist.workflowStartsWithQr,
      status: hasScanRoute ? t.common.liveBadge : t.pharmacist.scanPrescriptionComingNext,
      statusTone: hasScanRoute ? "primary" : "warning",
      actionLabel: hasScanRoute ? t.pharmacist.scanPrescription : t.pharmacist.scanPrescriptionComingNext,
      icon: ShieldIcon,
      href: hasScanRoute && canStartWorkflow ? "/app/pharmacist/scan" : undefined,
      disabled: !hasScanRoute || !canStartWorkflow,
    },
    {
      title: t.pharmacist.prescriptionDetail,
      subtitle: t.pharmacist.scanPrescriptionSubtitle,
      status: t.pharmacist.scanPrescriptionComingNext,
      statusTone: "warning",
      actionLabel: t.pharmacist.scanPrescriptionComingNext,
      icon: PrescriptionIcon,
      disabled: true,
    },
    {
      title: t.pharmacist.dispensePrescription,
      subtitle: t.pharmacist.partialDispensingSupported,
      status: t.pharmacist.dispensingComingLater,
      statusTone: "warning",
      actionLabel: t.pharmacist.dispensingComingLater,
      icon: PharmacyIcon,
      disabled: true,
    },
    {
      title: t.pharmacist.dispensingHistory,
      subtitle: t.pharmacist.doctorCanReviewDispensing,
      status: hasHistoryEndpoint ? t.common.liveBadge : t.pharmacist.historyComingLater,
      statusTone: hasHistoryEndpoint ? "primary" : "warning",
      actionLabel: hasHistoryEndpoint ? t.pharmacist.dispensingHistory : t.pharmacist.historyComingLater,
      icon: FileTextIcon,
      disabled: !hasHistoryEndpoint,
    },
  ];

  return (
    <RequireRole role="pharmacist">
      <div className="space-y-6">
        <PageHeader
          badge={<Badge tone={isApproved ? "success" : "warning"}>{t.roles.pharmacist}</Badge>}
          title={t.pharmacist.dashboardTitle}
          description={t.pharmacist.dashboardSubtitle}
          actions={
            <Badge tone={isApproved ? "success" : "warning"}>
              {isApproved ? t.pharmacist.verifiedPharmacistAccount : t.pharmacist.pharmacistActionsDisabled}
            </Badge>
          }
        />

        <PharmacistVerificationNotice verification={verification} />

        <PharmacistDashboardSummary
          user={user}
          userProfile={userProfile}
          roleProfile={roleProfile}
          verification={verification}
        />

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {workflowCards.map((card) => (
            <PharmacistWorkflowCard
              key={card.title}
              title={card.title}
              subtitle={card.subtitle}
              status={card.status}
              statusTone={card.statusTone as "primary" | "warning"}
              actionLabel={card.actionLabel}
              icon={card.icon}
              href={card.href}
              disabled={card.disabled}
            />
          ))}
        </div>

        <PharmacistPrivacyNotice />

        <EmptyState
          icon={<ShieldIcon size={20} />}
          title={t.pharmacist.scanPrescriptionComingNext}
          description={t.pharmacist.dispensingComingLater}
        />
      </div>
    </RequireRole>
  );
}