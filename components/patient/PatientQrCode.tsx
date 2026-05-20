"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";

interface PatientQrCodeProps {
  token?: string | null;
  imageUrl?: string | null;
  alt: string;
}

export function PatientQrCode({ token, imageUrl, alt }: PatientQrCodeProps) {
  const [generatedQrCode, setGeneratedQrCode] = useState<{ token: string; src: string } | null>(null);

  useEffect(() => {
    let cancelled = false;

    if (!token) {
      return () => {
        cancelled = true;
      };
    }

    void QRCode.toDataURL(token, {
      errorCorrectionLevel: "M",
      margin: 1,
      width: 192,
      color: {
        dark: "#0f1f33",
        light: "#ffffff",
      },
    }).then((dataUrl) => {
      if (!cancelled) {
        setGeneratedQrCode({ token, src: dataUrl });
      }
    });

    return () => {
      cancelled = true;
    };
  }, [token]);

  const src = (generatedQrCode && generatedQrCode.token === token ? generatedQrCode.src : null) || imageUrl;

  if (!src) {
    return <span className="block break-all">{token || "-"}</span>;
  }

  return (
    <div className="flex justify-center rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
      <div
        role="img"
        aria-label={alt}
        className="h-40 w-40 rounded-xl border border-slate-200 bg-white bg-contain bg-center bg-no-repeat shadow-[0_12px_28px_-18px_rgba(15,31,51,0.45)]"
        style={{ backgroundImage: `url(${src})` }}
      />
    </div>
  );
}