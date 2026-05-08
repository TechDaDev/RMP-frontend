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
import type { LaboratoryOrderScanResponse } from "@/types/laboratory";

export default function LaboratoryScanPage() {
  const { t } = useAppPreferences();
  const { verification } = useAuth();

  const isApproved = verification?.is_approved === true;

  const [scanResponse, setScanResponse] = useState<LaboratoryOrderScanResponse | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);

  const handleScan = useCallback(
    async (qrToken: string) => {
      setIsScanning(true);
      setScanError(null);

      try {
        const response = await scanLabOrder({ qr_token: qrToken });
        setScanResponse(response);
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

  const handleScanAnother = () => {
    setScanResponse(null);
    setScanError(null);
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
              <LaboratoryScannedOrderPanel scanResponse={scanResponse} />

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
