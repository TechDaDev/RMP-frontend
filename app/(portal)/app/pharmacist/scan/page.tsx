"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { useAuth } from "@/components/auth/AuthProvider";
import { RequireRole } from "@/components/auth/RequireRole";
import { ArrowIcon, ShieldIcon } from "@/components/icons";
import { PharmacistQrManualEntry } from "@/components/pharmacist/PharmacistQrManualEntry";
import { PharmacistScannedPrescriptionPanel } from "@/components/pharmacist/PharmacistScannedPrescriptionPanel";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import { ApiError } from "@/lib/api/errors";
import { scanPrescription } from "@/lib/pharmacist/pharmacistService";
import type {
  PharmacistDispensePrescriptionResult,
  PharmacistPrescriptionItem,
  PharmacistScanResponse,
} from "@/types/pharmacist";

export default function PharmacistScanPage() {
  const { t } = useAppPreferences();
  const { verification } = useAuth();

  const isApproved = verification?.is_approved === true;

  const [scanResponse, setScanResponse] = useState<PharmacistScanResponse | null>(null);
  const [dispensedItems, setDispensedItems] = useState<PharmacistPrescriptionItem[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);

  const handleScan = useCallback(
    async (qrToken: string) => {
      setScanError(null);
      setIsScanning(true);

      try {
        const response = await scanPrescription({ qr_token: qrToken });

        if (!response.prescription?.id) {
          setScanResponse(null);
          setScanError(t.pharmacist.scanFailed);
          return;
        }

        setScanResponse(response);
        setDispensedItems([]);
      } catch (error) {
        if (error instanceof ApiError && error.status === 400) {
          setScanError(error.message || t.pharmacist.invalidQrToken);
        } else if (error instanceof Error) {
          setScanError(error.message);
        } else {
          setScanError(t.pharmacist.scanFailed);
        }
      } finally {
        setIsScanning(false);
      }
    },
    [t.pharmacist.invalidQrToken, t.pharmacist.scanFailed],
  );

  const handleDispenseComplete = useCallback((result: PharmacistDispensePrescriptionResult) => {
    setScanResponse((prev) => {
      if (!prev) return prev;
      const newRemainingIds = new Set((result.remaining_items ?? []).map((i) => i.id));
      const newlyDispensed = (prev.remaining_items ?? []).filter((i) => !newRemainingIds.has(i.id));
      setDispensedItems((d) => [...d, ...newlyDispensed]);
      return {
        ...prev,
        prescription: result.prescription ?? prev.prescription,
        remaining_items: result.remaining_items ?? [],
        locked: result.locked ?? false,
        message: result.message ?? null,
      };
    });
  }, []);

  const handleScanAnother = () => {
    setScanResponse(null);
    setScanError(null);
    setDispensedItems([]);
  };

  return (
    <RequireRole role="pharmacist">
      <div className="space-y-6">
        <PageHeader
          badge={<Badge tone={isApproved ? "success" : "warning"}>{t.roles.pharmacist}</Badge>}
          title={t.pharmacist.scanPrescription}
          description={t.pharmacist.scanPrescriptionSubtitle}
        />

        {isApproved ? (
          <div className="space-y-6">
            {!scanResponse ? (
              <>
                <PharmacistQrManualEntry
                  onSubmit={handleScan}
                  isLoading={isScanning}
                  error={scanError}
                  disabled={false}
                />

                <Link href="/app/pharmacist" className="block">
                  <Button variant="ghost" className="w-full sm:w-auto">
                    <ArrowIcon size={18} />
                    {t.pharmacist.backToPharmacistDashboard}
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <PharmacistScannedPrescriptionPanel
                  scanResponse={scanResponse}
                  dispensedItems={dispensedItems}
                  onDispenseComplete={handleDispenseComplete}
                />

                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button onClick={handleScanAnother} className="sm:flex-1">
                    {t.pharmacist.scanAnotherPrescription}
                  </Button>
                  <Link href="/app/pharmacist" className="sm:flex-1">
                    <Button variant="ghost" className="w-full">
                      <ArrowIcon size={18} />
                      {t.pharmacist.backToPharmacistDashboard}
                    </Button>
                  </Link>
                </div>
              </>
            )}
          </div>
        ) : (
          <EmptyState
            icon={<ShieldIcon size={20} />}
            title={t.pharmacist.pharmacistVerificationPending}
            description={t.pharmacist.pharmacistActionsDisabled}
          />
        )}
      </div>
    </RequireRole>
  );
}
