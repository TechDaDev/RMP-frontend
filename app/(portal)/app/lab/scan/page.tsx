"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { useAuth } from "@/components/auth/AuthProvider";
import { LaboratoryQrManualEntry } from "@/components/laboratory/LaboratoryQrManualEntry";
import { LaboratoryScannedOrderPanel } from "@/components/laboratory/LaboratoryScannedOrderPanel";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { ShieldIcon, ArrowIcon } from "@/components/icons";
import { scanLabOrder } from "@/lib/laboratory/laboratoryService";
import { isLabOrderLocked } from "@/lib/laboratory/laboratoryStatus";
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

  const refreshScannedOrder = useCallback(async () => {
    if (!activeQrToken) {
      return;
    }

    setIsRefreshingOrder(true);

    try {
      const refreshed = await scanLabOrder({ qr_token: activeQrToken });
      setScanResponse(refreshed);
      setScanError(null);
    } catch (error) {
      if (error instanceof Error) {
        setScanError(error.message);
      } else {
        setScanError(t.laboratory.scanFailed);
      }
    } finally {
      setIsRefreshingOrder(false);
    }
  }, [activeQrToken, t.laboratory.scanFailed]);

  const handleItemCompleted = useCallback(
    async (result: LaboratoryCompletionResult) => {
      setScanError(null);
      setCompletionNotice(
        result.lab_order?.status === "fully_completed"
          ? t.laboratory.allItemsCompleted
          : t.laboratory.partialCompletionSaved,
      );

      if (scanResponse) {
        setScanResponse({
          lab_order: {
            ...scanResponse.lab_order,
            ...result.lab_order,
            completed_items:
              result.lab_order?.completed_items ??
              result.completed_items ??
              scanResponse.lab_order.completed_items,
          },
          remaining_items: result.remaining_items ?? result.lab_order?.remaining_items ?? scanResponse.remaining_items,
          locked:
            result.locked ??
            (result.lab_order?.status ? isLabOrderLocked(result.lab_order.status) : scanResponse.locked),
          message: result.message ?? scanResponse.message,
        });
      }

      const hasCompletedItemsInResponse =
        Array.isArray(result.lab_order?.completed_items) || Array.isArray(result.completed_items);
      if (!hasCompletedItemsInResponse) {
        await refreshScannedOrder();
      }
    },
    [refreshScannedOrder, scanResponse, t.laboratory.allItemsCompleted, t.laboratory.partialCompletionSaved],
  );

  const handleScanAnother = () => {
    setScanResponse(null);
    setScanError(null);
    setCompletionNotice(null);
    setActiveQrToken(null);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        badge={<Badge tone={isApproved ? "success" : "primary"}>{t.roles.laboratory}</Badge>}
        title={t.laboratory.scanLabOrder}
        description={t.laboratory.scanLabOrderSubtitle}
      />

      {isApproved ? (
        <div className="space-y-6">
          {!scanResponse ? (
            <>
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
            </>
          ) : (
            <>
              {completionNotice ? (
                <div className="rounded-2xl border border-green-500/40 bg-green-500/10 p-3 text-sm font-medium text-green-700 dark:text-green-300">
                  {completionNotice}
                </div>
              ) : null}

              <LaboratoryScannedOrderPanel
                scanResponse={scanResponse}
                onItemCompleted={handleItemCompleted}
                completionDisabled={isRefreshingOrder}
                resultActionDisabled={isRefreshingOrder}
              />

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
        </div>
      ) : (
        <EmptyState
          icon={<ShieldIcon size={20} />}
          title={t.laboratory.laboratoryVerificationPending}
          description={t.laboratory.laboratoryActionsDisabled}
        />
      )}
    </div>
  );
}
