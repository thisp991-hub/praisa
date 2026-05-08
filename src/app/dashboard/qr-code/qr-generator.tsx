"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import QRCode from "qrcode";
import { Download, Copy, Check } from "lucide-react";

const subscribe = () => () => {};
const getOrigin = () => window.location.origin;
const getServerOrigin = () => "";

interface QRCodeGeneratorProps {
  businessSlug: string;
  businessName: string;
}

export function QRCodeGenerator({
  businessSlug,
  businessName,
}: QRCodeGeneratorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [copied, setCopied] = useState(false);
  const origin = useSyncExternalStore(subscribe, getOrigin, getServerOrigin);
  const feedbackUrl = origin
    ? `${origin}/feedback/${businessSlug}`
    : `/feedback/${businessSlug}`;

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

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(feedbackUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard not available */
    }
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

          <div className="mt-4 flex gap-3">
            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark"
            >
              <Download className="h-4 w-4" />
              Download PNG
            </button>
            <button
              onClick={handleCopyLink}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 text-green-600" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Copy Feedback Link
                </>
              )}
            </button>
          </div>

          <p className="mt-6 max-w-sm text-center text-sm text-gray-500">
            Print this QR code and place it at your counter, receipt, or waiting
            area.
          </p>
        </div>
      </div>
    </div>
  );
}
