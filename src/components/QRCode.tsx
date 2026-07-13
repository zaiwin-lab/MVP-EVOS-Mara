import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { Icon } from "./Icon";

interface QRCodeProps {
  value: string;
  label?: string;
  caption?: string;
  downloadName?: string;
  size?: number;
}

export function QRCodeCard({
  value,
  label,
  caption,
  downloadName = "attendify-qr.png",
  size = 220,
}: QRCodeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dataUrl, setDataUrl] = useState<string>("");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    QRCode.toCanvas(
      canvas,
      value,
      {
        width: size,
        margin: 2,
        color: { dark: "#0e1a34", light: "#ffffff" },
        errorCorrectionLevel: "H",
      },
      (err) => {
        if (err) console.error("QR render error", err);
        else setDataUrl(canvas.toDataURL("image/png"));
      }
    );
  }, [value, size]);

  const download = () => {
    // Render a high-resolution, print-ready PNG with a quiet border.
    QRCode.toDataURL(value, {
      width: 1024,
      margin: 4,
      color: { dark: "#0e1a34", light: "#ffffff" },
      errorCorrectionLevel: "H",
    }).then((url) => {
      const a = document.createElement("a");
      a.href = url;
      a.download = downloadName;
      a.click();
    });
  };

  return (
    <div className="card flex flex-col items-center p-5 text-center">
      {label && (
        <div className="mb-3 text-sm font-bold uppercase tracking-wide text-navy-700">
          {label}
        </div>
      )}
      <div className="rounded-2xl border border-navy-100 bg-white p-3 shadow-sm">
        <canvas ref={canvasRef} className="h-auto w-full max-w-[220px]" />
      </div>
      {caption && <p className="mt-3 text-xs text-navy-500">{caption}</p>}
      <button
        type="button"
        onClick={download}
        disabled={!dataUrl}
        className="btn-ghost mt-4 w-full text-sm"
      >
        <Icon name="download" className="h-4 w-4" />
        Download PNG
      </button>
    </div>
  );
}
