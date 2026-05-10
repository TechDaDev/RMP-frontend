"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { useAuth } from "@/components/auth/AuthProvider";
import { RequireRole } from "@/components/auth/RequireRole";
import { DashboardStateCard } from "@/components/dashboard/DashboardStateCard";
import { LaboratoryResultDetailPanel } from "@/components/laboratory/LaboratoryResultDetailPanel";
import { LaboratoryPageFrame } from "@/components/laboratory/ui/LaboratoryPageFrame";
import { Badge } from "@/components/ui/Badge";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { getLaboratoryResultDetail } from "@/lib/laboratory/laboratoryService";
import { canCorrectResult } from "@/lib/laboratory/laboratoryStatus";
import type { LaboratoryResultDetail } from "@/types/laboratory";

export default function LaboratoryResultDetailPage() {
  const { t } = useAppPreferences();
  const { verification } = useAuth();
  const params = useParams<{ resultId: string }>();
  const resultId = params?.resultId;
  const [result, setResult] = useState<LaboratoryResultDetail | null>(null);
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

  return (
    <RequireRole role="laboratorian">
      <LaboratoryPageFrame>
        <PageHeader
          badge={<Badge tone={isApproved ? "success" : "primary"}>{t.roles.laboratory}</Badge>}
          title={t.laboratory.labResultDetail}
          description={t.laboratory.resultDetailDescription}
        />

        {!resultId || loading ? (
          <DashboardStateCard
            state="loading"
            title={t.common.loading}
            description=""
          />
        ) : error ? (
          <DashboardStateCard
            state="error"
            title={t.common.error}
            description={error}
          />
        ) : !result ? (
          <DashboardStateCard
            state="empty"
            title={t.laboratory.resultNotFound}
            description=""
          />
        ) : (
          <>
            <LaboratoryResultDetailPanel
              result={result}
              canCorrect={canCorrect && isApproved}
              isApproved={isApproved}
            />

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href="/app/lab/scan" className="flex-1">
                <Button variant="secondary" className="w-full">
                  {t.laboratory.backToScan}
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
