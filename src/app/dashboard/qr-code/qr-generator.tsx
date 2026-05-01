"use client";

import { useEffect, useRef, useMemo } from "react";
import QRCode from "qrcode";
import { Download } from "lucide-react";

interface QRCodeGeneratorProps {
  businessSlug: string;
  businessName: string;
}

export function QRCodeGenerator({
  businessSlug,
  businessName,
}: QRCodeGeneratorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const feedbackUrl = useMemo(
    () =>
      typeof window !== "undefined"
        ? `${window.location.origin}/feedback/${businessSlug}`
        : `/feedback/${businessSlug}`,
    [businessSlug]
  );

  useEffect(() => {
    if (canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, feedbackUrl, {
        width: 280,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#ffffff",
        },
      });
    }
  }, [feedbackUrl]);

  function handleDownload() {
    if (!canvasRef.current) return;

    const link = document.createElement("a");
    link.download = `${businessSlug}-qr-code.png`;
    link.href = canvasRef.current.toDataURL("image/png");
    link.click();
  }

  return (
    <div className="mt-6">
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <div className="flex flex-col items-center">
          <h2 className="mb-1 text-lg font-semibold text-gray-900">
            {businessName}
          </h2>
          <p className="mb-4 text-sm text-gray-500">
            Scan to leave feedback
          </p>

          <div className="rounded-lg border border-gray-100 bg-white p-4">
            <canvas ref={canvasRef} />
          </div>

          <p className="mt-4 break-all text-center text-xs text-gray-400">
            {feedbackUrl}
          </p>

          <button
            onClick={handleDownload}
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark"
          >
            <Download className="h-4 w-4" />
            Download PNG
          </button>
        </div>
      </div>
    </div>
  );
}
