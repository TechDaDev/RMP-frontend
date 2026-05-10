"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { useAuth } from "@/components/auth/AuthProvider";
import { RequireRole } from "@/components/auth/RequireRole";
import { DashboardSection } from "@/components/dashboard/DashboardSection";
import { DashboardStateCard } from "@/components/dashboard/DashboardStateCard";
import { LaboratoryResultForm } from "@/components/laboratory/LaboratoryResultForm";
import { LaboratoryResultCreatedPanel } from "@/components/laboratory/LaboratoryResultCreatedPanel";
import { LaboratoryPageFrame } from "@/components/laboratory/ui/LaboratoryPageFrame";
import { Badge } from "@/components/ui/Badge";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { ArrowIcon } from "@/components/icons";
import type { LaboratoryResultDetail } from "@/types/laboratory";

export default function LaboratoryCreateResultPage() {
  const { t } = useAppPreferences();
  const { verification } = useAuth();
  const params = useParams<{ itemId: string }>();
  const searchParams = useSearchParams();
  const itemId = params?.itemId;
  const orderId = searchParams.get("orderId");
  const [createdResult, setCreatedResult] = useState<LaboratoryResultDetail | null>(null);

  const isApproved = verification?.is_approved === true;
  const scanBackHref = orderId ? `/app/lab/scan?orderId=${orderId}` : "/app/lab/scan";

  return (
    <RequireRole role="laboratorian">
      <LaboratoryPageFrame>
        <PageHeader
          badge={<Badge tone={isApproved ? "success" : "primary"}>{t.roles.laboratory}</Badge>}
          title={t.laboratory.createLabResultTitle}
          description={t.laboratory.createLabResultDescription}
        />

        {!itemId ? (
          <DashboardStateCard
            state="empty"
            title={t.laboratory.resultCreationUnavailable}
            description={t.laboratory.resultCreationUnavailable}
          />
        ) : null}

        {itemId && !isApproved ? (
          <DashboardStateCard
            state="empty"
            title={t.laboratory.laboratoryVerificationPending}
            description={t.laboratory.laboratoryActionsDisabled}
          />
        ) : null}

        {itemId && isApproved ? (
          createdResult ? (
            <LaboratoryResultCreatedPanel result={createdResult} backToScanHref={scanBackHref} />
          ) : (
            <DashboardSection title={t.laboratory.createLabResultTitle} description={t.laboratory.createLabResultDescription}>
              <LaboratoryResultForm itemId={itemId} onCreated={setCreatedResult} />
            </DashboardSection>
          )
        ) : null}

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href={scanBackHref} className="flex-1">
            <Button variant="ghost" className="w-full">
              <ArrowIcon size={18} />
              {t.laboratory.backToScan}
            </Button>
          </Link>
          <Link href="/app/lab" className="flex-1">
            <Button variant="secondary" className="w-full">
              {t.laboratory.backToLabDashboard}
            </Button>
          </Link>
        </div>
      </LaboratoryPageFrame>
    </RequireRole>
  );
}
