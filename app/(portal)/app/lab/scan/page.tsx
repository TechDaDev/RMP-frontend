"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { useAuth } from "@/components/auth/AuthProvider";
import { DashboardSection } from "@/components/dashboard/DashboardSection";
import { DashboardStateCard } from "@/components/dashboard/DashboardStateCard";
import { LaboratoryQrManualEntry } from "@/components/laboratory/LaboratoryQrManualEntry";
import { LaboratoryScannedOrderPanel } from "@/components/laboratory/LaboratoryScannedOrderPanel";
import { LaboratoryPageFrame } from "@/components/laboratory/ui/LaboratoryPageFrame";
import { Badge } from "@/components/ui/Badge";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { ArrowIcon } from "@/components/icons";
import { scanLabOrder } from "@/lib/laboratory/laboratoryService";
import { normalizeScannedOrderState } from "@/lib/laboratory/laboratoryScanState";
import type { LaboratoryCompletionResult, LaboratoryOrderScanResponse } from "@/types/laboratory";

export default function LaboratoryScanPage() {
  const { t } = useAppPreferences();
  const { verification } = useAuth();

  const isApproved = verification?.is_approved === true;

  const [scanResponse, setScanResponse] = useState<LaboratoryOrderScanResponse | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isRefreshingOrder, setIsRefreshingOrder] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);
  const [completionNotice, setCompletionNotice] = useState<string | null>(null);
  const [activeQrToken, setActiveQrToken] = useState<string | null>(null);

  const handleScan = useCallback(
    async (qrToken: string) => {
      setIsScanning(true);
      setScanError(null);

      try {
        const response = await scanLabOrder({ qr_token: qrToken });
        setScanResponse(response);
        setActiveQrToken(qrToken);
        setCompletionNotice(null);
      } catch (error) {
        if (error instanceof Error) {
          setScanError(error.message);
        } else {
          setScanError(t.laboratory.scanFailed);
        }
      } finally {
        setIsScanning(false);
      }
    },
    [t.laboratory.scanFailed],
  );

  const handleItemCompleted = useCallback(
    async (result: LaboratoryCompletionResult, completedItemIds: string[] = []) => {
      setScanError(null);
      setCompletionNotice(
        result.lab_order?.status === "fully_completed"
          ? t.laboratory.allItemsCompleted
          : t.laboratory.partialCompletionSaved,
      );

      if (!scanResponse) {
        return;
      }

      setIsRefreshingOrder(true);

      try {
        let rescanResponse: LaboratoryOrderScanResponse | null = null;

        if (activeQrToken) {
          try {
            rescanResponse = await scanLabOrder({ qr_token: activeQrToken });
          } catch {
            rescanResponse = null;
          }
        }

        const normalized = normalizeScannedOrderState({
          previousScan: scanResponse,
          completionResponse: result,
          rescanResponse,
          completedItemIds,
        });

        setScanResponse(normalized);
      } finally {
        setIsRefreshingOrder(false);
      }
    },
    [activeQrToken, scanResponse, t.laboratory.allItemsCompleted, t.laboratory.partialCompletionSaved],
  );

  const handleScanAnother = () => {
    setScanResponse(null);
    setScanError(null);
    setCompletionNotice(null);
    setActiveQrToken(null);
  };

  return (
    <LaboratoryPageFrame>
      <PageHeader
        badge={<Badge tone={isApproved ? "success" : "primary"}>{t.roles.laboratory}</Badge>}
        title={t.laboratory.scanLabOrder}
        description={t.laboratory.scanLabOrderSubtitle}
      />

      {isApproved ? (
        <>
          {!scanResponse ? (
            <DashboardSection title={t.laboratory.scanLabOrder} description={t.laboratory.manualQrOnly}>
              <LaboratoryQrManualEntry
                onSubmit={handleScan}
                isLoading={isScanning}
                error={scanError}
                disabled={false}
              />

              <div className="flex gap-2">
                <Link href="/app/lab" className="flex-1">
                  <Button variant="ghost" className="w-full">
                    <ArrowIcon size={18} />
                    {t.laboratory.backToLabDashboard}
                  </Button>
                </Link>
              </div>
            </DashboardSection>
          ) : (
            <>
              {completionNotice ? (
                <DashboardStateCard state="success" title={t.laboratory.orderUpdated} description={completionNotice} />
              ) : null}

              <DashboardSection title={t.laboratory.scannedOrder} description={t.laboratory.workflowStartsWithQr}>
                <LaboratoryScannedOrderPanel
                  scanResponse={scanResponse}
                  onItemCompleted={handleItemCompleted}
                  completionDisabled={isRefreshingOrder}
                  resultActionDisabled={isRefreshingOrder}
                />
              </DashboardSection>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button onClick={handleScanAnother} className="flex-1">
                  {t.laboratory.scanAnotherOrder}
                </Button>
                <Link href="/app/lab" className="flex-1">
                  <Button variant="ghost" className="w-full">
                    <ArrowIcon size={18} />
                    {t.laboratory.backToLabDashboard}
                  </Button>
                </Link>
              </div>
            </>
          )}
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
