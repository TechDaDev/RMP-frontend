"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { useAuth } from "@/components/auth/AuthProvider";
import { RequireRole } from "@/components/auth/RequireRole";
import { LaboratoryResultCorrectionForm } from "@/components/laboratory/LaboratoryResultCorrectionForm";
import { LaboratoryResultCorrectionPanel } from "@/components/laboratory/LaboratoryResultCorrectionPanel";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { ShieldIcon } from "@/components/icons";
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
        <EmptyState
          icon={<ShieldIcon size={20} />}
          title={t.laboratory.correctionUnavailable || "Correction unavailable"}
          description=""
        />
      </RequireRole>
    );
  }

  if (loading) {
    return (
      <RequireRole role="laboratorian">
        <PageHeader
          badge={<Badge tone="primary">{t.roles.laboratory}</Badge>}
          title={t.laboratory.correctLabResultTitle || "Correct Result"}
          description=""
        />
        <EmptyState
          icon={<ShieldIcon size={20} />}
          title={t.common.loading || "Loading..."}
          description=""
        />
      </RequireRole>
    );
  }

  if (error || !result) {
    return (
      <RequireRole role="laboratorian">
        <PageHeader
          badge={<Badge tone="primary">{t.roles.laboratory}</Badge>}
          title={t.laboratory.correctLabResultTitle || "Correct Result"}
          description=""
        />
        <EmptyState
          icon={<ShieldIcon size={20} />}
          title={t.common.error || "Error"}
          description={error || "Result not found"}
        />
      </RequireRole>
    );
  }

  if (correctedResult) {
    return (
      <RequireRole role="laboratorian">
        <div className="space-y-6">
          <PageHeader
            badge={<Badge tone="success">{t.roles.laboratory}</Badge>}
            title={t.laboratory.labResultCorrected || "Result Corrected"}
            description=""
          />
          <LaboratoryResultCorrectionPanel result={correctedResult} resultId={resultId} />
        </div>
      </RequireRole>
    );
  }

  return (
    <RequireRole role="laboratorian">
      <div className="space-y-6">
        <PageHeader
          badge={<Badge tone={isApproved ? "success" : "primary"}>{t.roles.laboratory}</Badge>}
          title={t.laboratory.correctLabResultTitle || "Correct Result"}
          description={t.laboratory.correctLabResultDescription || "Submit corrected result values"}
        />

        {!isApproved ? (
          <EmptyState
            icon={<ShieldIcon size={20} />}
            title={t.laboratory.laboratoryVerificationPending || "Verification pending"}
            description={t.laboratory.verificationRequiredForCorrection || "Complete profile verification to correct results"}
          />
        ) : !canCorrect ? (
          <EmptyState
            icon={<ShieldIcon size={20} />}
            title={t.laboratory.correctionUnavailable || "Correction unavailable"}
            description={
              result.status === "reviewed" || result.status === "released"
                ? t.laboratory.correctionUnavailableReviewed || "Cannot correct after doctor review"
                : t.laboratory.correctionUnavailableReleased || "Cannot correct released results"
            }
          />
        ) : (
          <>
            <LaboratoryResultCorrectionForm
              result={result}
              resultId={resultId}
              onCorrected={setCorrectedResult}
            />
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href={`/app/lab/results/${resultId}`} className="flex-1">
                <Button variant="secondary" className="w-full">
                  {t.laboratory.backToResultDetail || "Back to Result"}
                </Button>
              </Link>
              <Link href="/app/lab" className="flex-1">
                <Button variant="secondary" className="w-full">
                  {t.laboratory.backToLabDashboard || "Back to Lab Dashboard"}
                </Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </RequireRole>
  );
}
