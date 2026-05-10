"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { useAuth } from "@/components/auth/AuthProvider";
import { RequireRole } from "@/components/auth/RequireRole";
import { getPharmacistDispensingHistory } from "@/lib/pharmacist/pharmacistService";
import { DashboardSection } from "@/components/dashboard/DashboardSection";
import { DashboardStateCard } from "@/components/dashboard/DashboardStateCard";
import { PharmacistDispensingHistoryList } from "@/components/pharmacist/PharmacistDispensingHistoryList";
import { PharmacistPrivacyNotice } from "@/components/pharmacist/PharmacistPrivacyNotice";
import { PharmacistVerificationNotice } from "@/components/pharmacist/PharmacistVerificationNotice";
import { PharmacistPageFrame } from "@/components/pharmacist/ui/PharmacistPageFrame";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/PageHeader";
import { ArrowIcon } from "@/components/icons";
import type { PharmacistDispensingHistoryResponse } from "@/types/pharmacist";

export default function PharmacistHistoryPage() {
  const { t } = useAppPreferences();
  const { verification } = useAuth();
  const isApproved = verification?.is_approved === true;

  const [history, setHistory] = useState<PharmacistDispensingHistoryResponse | null>(null);
  const [isLoading, setIsLoading] = useState(isApproved);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isApproved) {
      return;
    }

    const loadHistory = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await getPharmacistDispensingHistory({
          limit: 20,
          offset: 0,
        });
        setHistory(response);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : t.pharmacist.dispensingHistoryLoadFailed;
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    loadHistory();
  }, [isApproved, t.pharmacist.dispensingHistoryLoadFailed]);

  return (
    <RequireRole role="pharmacist">
      <PharmacistPageFrame>
        <Link
          href="/app/pharmacist"
          className="inline-flex min-h-10 items-center gap-2 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm font-semibold text-[var(--color-text)] transition hover:bg-[var(--color-surface-alt)]"
        >
          <ArrowIcon size={16} />
          {t.pharmacist.backToPharmacistDashboard}
        </Link>

        <PageHeader
          badge={<Badge tone="info">{t.pharmacist.dispensingHistory}</Badge>}
          title={t.pharmacist.dispensingHistoryTitle}
          description={t.pharmacist.dispensingHistoryDescription}
        />

        <PharmacistVerificationNotice verification={verification} />

        {!isApproved && (
          <DashboardStateCard
            state="empty"
            title={t.pharmacist.verificationRequired}
            description={t.pharmacist.verificationRequiredDescription}
          />
        )}

        {isApproved && (
          <>
            {isLoading && (
              <DashboardStateCard state="loading" title={t.common.loading} description={t.pharmacist.dispensingHistoryDescription} />
            )}

            {error && !isLoading && (
              <DashboardStateCard
                state="error"
                title={t.pharmacist.dispensingHistoryLoadFailed}
                description={error}
              />
            )}

            {!isLoading && !error && history && history.results.length === 0 && (
              <DashboardStateCard
                state="empty"
                title={t.pharmacist.noDispensingHistoryRecords}
                description={t.pharmacist.dispensingHistoryEmpty}
                action={
                  <Link href="/app/pharmacist/scan" className="inline-flex">
                    <Button>{t.pharmacist.goToPrescriptionScan}</Button>
                  </Link>
                }
              />
            )}

            {!isLoading && !error && history && history.results.length > 0 && (
              <>
                <DashboardSection
                  title={t.pharmacist.dispensingHistoryTitle}
                  description={`${t.pharmacist.dispensingHistoryCount}: ${history.count}`}
                  actions={
                    <Badge tone="info">{String(history.count)}</Badge>
                  }
                >
                  <PharmacistDispensingHistoryList records={history.results} />
                </DashboardSection>

                <div className="flex justify-center">
                  <Link href="/app/pharmacist/scan" className="inline-flex">
                    <Button>{t.pharmacist.goToPrescriptionScan}</Button>
                  </Link>
                </div>
              </>
            )}
          </>
        )}

        <PharmacistPrivacyNotice />
      </PharmacistPageFrame>
    </RequireRole>
  );
}
