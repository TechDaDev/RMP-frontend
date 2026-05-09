"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { useAuth } from "@/components/auth/AuthProvider";
import { RequireRole } from "@/components/auth/RequireRole";
import { LaboratoryResultDetailPanel } from "@/components/laboratory/LaboratoryResultDetailPanel";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { ShieldIcon } from "@/components/icons";
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
      <div className="space-y-6">
        <PageHeader
          badge={<Badge tone={isApproved ? "success" : "primary"}>{t.roles.laboratory}</Badge>}
          title={t.laboratory.labResultDetail || "Lab Result"}
          description={t.laboratory.resultDetailDescription || "View and manage lab result"}
        />

        {!resultId || loading ? (
          <EmptyState
            icon={<ShieldIcon size={20} />}
            title={t.common.loading || "Loading..."}
            description=""
          />
        ) : error ? (
          <EmptyState
            icon={<ShieldIcon size={20} />}
            title={t.common.error || "Error"}
            description={error}
          />
        ) : !result ? (
          <EmptyState
            icon={<ShieldIcon size={20} />}
            title={t.laboratory.resultNotFound || "Result not found"}
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
                  {t.laboratory.backToScan || "Back to Scan"}
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
