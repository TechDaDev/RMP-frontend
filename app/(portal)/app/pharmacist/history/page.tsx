"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { useAuth } from "@/components/auth/AuthProvider";
import { RequireRole } from "@/components/auth/RequireRole";
import { getPharmacistDispensingHistory } from "@/lib/pharmacist/pharmacistService";
import { PharmacistDispensingHistoryList } from "@/components/pharmacist/PharmacistDispensingHistoryList";
import { PharmacistPrivacyNotice } from "@/components/pharmacist/PharmacistPrivacyNotice";
import { PharmacistVerificationNotice } from "@/components/pharmacist/PharmacistVerificationNotice";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import { ArrowIcon, FileTextIcon } from "@/components/icons";
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
        const errorMessage = err instanceof Error ? err.message : "Failed to load dispensing history";
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    loadHistory();
  }, [isApproved]);

  return (
    <RequireRole role="pharmacist">
      <div className="space-y-6">
        <Link
          href="/app/pharmacist"
          className="inline-flex items-center gap-2 rounded px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
        >
          <ArrowIcon size={16} style={{ transform: "rotate(180deg)" }} />
          {t.pharmacist.backToPharmacistDashboard}
        </Link>

        <PageHeader
          badge={<Badge tone="info">{t.pharmacist.dispensingHistory}</Badge>}
          title={t.pharmacist.dispensingHistoryTitle}
          description={t.pharmacist.dispensingHistoryDescription}
        />

        <PharmacistVerificationNotice verification={verification} />

        {!isApproved && (
          <EmptyState
            icon={<FileTextIcon size={20} />}
            title={t.pharmacist.verificationRequired}
            description={t.pharmacist.verificationRequiredDescription}
          />
        )}

        {isApproved && (
          <>
            {isLoading && (
              <div className="rounded-lg border border-neutral-200 bg-white p-8 text-center dark:border-neutral-800 dark:bg-neutral-950">
                <div className="inline-flex items-center gap-3">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-neutral-300 border-t-blue-500 dark:border-neutral-700 dark:border-t-blue-400"></div>
                  <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    {t.common.loading}
                  </span>
                </div>
              </div>
            )}

            {error && !isLoading && (
              <EmptyState
                icon={<FileTextIcon size={20} />}
                title={t.pharmacist.dispensingHistoryLoadFailed}
                description={error}
              />
            )}

            {!isLoading && !error && history && history.results.length === 0 && (
              <div className="space-y-4">
                <EmptyState
                  icon={<FileTextIcon size={20} />}
                  title={t.pharmacist.noDispensingHistoryRecords}
                  description={t.pharmacist.dispensingHistoryEmpty}
                />
                <div className="text-center">
                  <Link
                    href="/app/pharmacist/scan"
                    className="inline-flex items-center gap-2 rounded bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
                  >
                    {t.pharmacist.goToPrescriptionScan}
                  </Link>
                </div>
              </div>
            )}

            {!isLoading && !error && history && history.results.length > 0 && (
              <>
                <div className="rounded-lg border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-950">
                  <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    {t.pharmacist.dispensingHistoryCount}: <span className="font-bold text-blue-600 dark:text-blue-400">{history.count}</span>
                  </p>
                </div>

                <PharmacistDispensingHistoryList records={history.results} />

                <div className="text-center">
                  <Link
                    href="/app/pharmacist/scan"
                    className="inline-flex items-center gap-2 rounded bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
                  >
                    {t.pharmacist.goToPrescriptionScan}
                  </Link>
                </div>
              </>
            )}
          </>
        )}

        <PharmacistPrivacyNotice />
      </div>
    </RequireRole>
  );
}
