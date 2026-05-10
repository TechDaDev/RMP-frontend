"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { useAuth } from "@/components/auth/AuthProvider";
import { RequireRole } from "@/components/auth/RequireRole";
import { DashboardSection } from "@/components/dashboard/DashboardSection";
import { DashboardStateCard } from "@/components/dashboard/DashboardStateCard";
import { LaboratoryResultCorrectionForm } from "@/components/laboratory/LaboratoryResultCorrectionForm";
import { LaboratoryResultCorrectionPanel } from "@/components/laboratory/LaboratoryResultCorrectionPanel";
import { LaboratoryPageFrame } from "@/components/laboratory/ui/LaboratoryPageFrame";
import { Badge } from "@/components/ui/Badge";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { getLaboratoryResultDetail } from "@/lib/laboratory/laboratoryService";
import { canCorrectResult } from "@/lib/laboratory/laboratoryStatus";
import type { LaboratoryResultDetail } from "@/types/laboratory";

export default function LaboratoryCorrectResultPage() {
  const { t } = useAppPreferences();
  const { verification } = useAuth();
  const params = useParams<{ resultId: string }>();
  const resultId = params?.resultId;
  const [result, setResult] = useState<LaboratoryResultDetail | null>(null);
  const [correctedResult, setCorrectedResult] = useState<LaboratoryResultDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isApproved = verification?.is_approved === true;
  const canCorrect = result?.status ? canCorrectResult(result.status) : false;

  useEffect(() => {
    if (!resultId) {
      return;
    }

    const loadResult = async () => {
      try {
        setLoading(true);
        const data = await getLaboratoryResultDetail(resultId);
        setResult(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load result");
        setResult(null);
      } finally {
        setLoading(false);
      }
    };

    loadResult();
  }, [resultId]);

  if (!resultId) {
    return (
      <RequireRole role="laboratorian">
        <LaboratoryPageFrame>
          <PageHeader
            badge={<Badge tone="primary">{t.roles.laboratory}</Badge>}
            title={t.laboratory.correctLabResultTitle}
            description=""
          />
          <DashboardStateCard
            state="empty"
            title={t.laboratory.correctionUnavailable}
            description=""
          />
        </LaboratoryPageFrame>
      </RequireRole>
    );
  }

  if (loading) {
    return (
      <RequireRole role="laboratorian">
        <LaboratoryPageFrame>
          <PageHeader
            badge={<Badge tone="primary">{t.roles.laboratory}</Badge>}
            title={t.laboratory.correctLabResultTitle}
            description=""
          />
          <DashboardStateCard state="loading" title={t.common.loading} description="" />
        </LaboratoryPageFrame>
      </RequireRole>
    );
  }

  if (error || !result) {
    return (
      <RequireRole role="laboratorian">
        <LaboratoryPageFrame>
          <PageHeader
            badge={<Badge tone="primary">{t.roles.laboratory}</Badge>}
            title={t.laboratory.correctLabResultTitle}
            description=""
          />
          <DashboardStateCard state="error" title={t.common.error} description={error || t.laboratory.resultNotFound} />
        </LaboratoryPageFrame>
      </RequireRole>
    );
  }

  if (correctedResult) {
    return (
      <RequireRole role="laboratorian">
        <LaboratoryPageFrame>
          <PageHeader
            badge={<Badge tone="success">{t.roles.laboratory}</Badge>}
            title={t.laboratory.labResultCorrected}
            description=""
          />
          <LaboratoryResultCorrectionPanel result={correctedResult} resultId={resultId} />
        </LaboratoryPageFrame>
      </RequireRole>
    );
  }

  return (
    <RequireRole role="laboratorian">
      <LaboratoryPageFrame>
        <PageHeader
          badge={<Badge tone={isApproved ? "success" : "primary"}>{t.roles.laboratory}</Badge>}
          title={t.laboratory.correctLabResultTitle}
          description={t.laboratory.correctLabResultDescription}
        />

        {!isApproved ? (
          <DashboardStateCard
            state="empty"
            title={t.laboratory.laboratoryVerificationPending}
            description={t.laboratory.verificationRequiredForCorrection}
          />
        ) : !canCorrect ? (
          <DashboardStateCard
            state="empty"
            title={t.laboratory.correctionUnavailable}
            description={
              result.status === "reviewed" || result.status === "released"
                ? t.laboratory.correctionUnavailableReviewed
                : t.laboratory.correctionUnavailableReleased
            }
          />
        ) : (
          <>
            <DashboardSection title={t.laboratory.correctLabResultTitle} description={t.laboratory.correctLabResultDescription}>
              <LaboratoryResultCorrectionForm
                result={result}
                resultId={resultId}
                onCorrected={setCorrectedResult}
              />
            </DashboardSection>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href={`/app/lab/results/${resultId}`} className="flex-1">
                <Button variant="secondary" className="w-full">
                  {t.laboratory.backToResultDetail}
                </Button>
              </Link>
              <Link href="/app/lab" className="flex-1">
                <Button variant="secondary" className="w-full">
                  {t.laboratory.backToLabDashboard}
                </Button>
              </Link>
            </div>
          </>
        )}
      </LaboratoryPageFrame>
    </RequireRole>
  );
}
