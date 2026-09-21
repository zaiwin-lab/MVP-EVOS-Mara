import { useCallback, useEffect, useRef, useState } from "react";
import { Icon } from "./Icon";
import { useI18n } from "../context/I18nContext";

type Failure = "denied" | "nocamera" | "insecure" | "unsupported" | "error";

/** Chromium exposes a native decoder; everywhere else falls back to jsQR. */
interface BarcodeDetectorLike {
  detect(source: CanvasImageSource): Promise<{ rawValue: string }[]>;
}
declare global {
  interface Window {
    BarcodeDetector?: {
      new (options?: { formats?: string[] }): BarcodeDetectorLike;
      getSupportedFormats?: () => Promise<string[]>;
    };
  }
}

/** Longest edge the frame is scaled to before decoding. Full-resolution
 *  frames decode no better and cost a lot of battery on a phone. */
const SAMPLE = 480;

/**
 * Opens the device camera inside the page and reports the first QR code it
 * reads. The camera is released the moment this unmounts — a scanner that
 * leaves the lens active is the kind of bug people notice by the light on
 * their phone.
 */
export function QrScanner({
  onResult,
  onClose,
}: {
  onResult: (text: string) => void;
  onClose: () => void;
}) {
  const { t } = useI18n();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number | null>(null);
  const doneRef = useRef(false);

  const [failure, setFailure] = useState<Failure | null>(null);
  const [ready, setReady] = useState(false);

  /** Release the camera. Safe to call more than once. */
  const stop = useCallback(() => {
    if (rafRef.current != null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function start() {
      // getUserMedia is only exposed on a secure origin. Netlify serves the
      // live site over HTTPS; this is what catches someone testing over plain
      // http on a laptop, where the API is simply absent.
      if (!window.isSecureContext) return setFailure("insecure");
      if (!navigator.mediaDevices?.getUserMedia) return setFailure("unsupported");

      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: "environment" } },
          audio: false,
        });
      } catch (e) {
        const name = (e as DOMException)?.name;
        if (name === "NotAllowedError" || name === "SecurityError") return setFailure("denied");
        if (name === "NotFoundError" || name === "OverconstrainedError") return setFailure("nocamera");
        console.error(e);
        return setFailure("error");
      }

      if (cancelled) {
        stream.getTracks().forEach((track) => track.stop());
        return;
      }

      streamRef.current = stream;
      const video = videoRef.current;
      if (!video) return;
      video.srcObject = stream;
      // iOS refuses to play inline without both of these set on the element.
      video.setAttribute("playsinline", "true");
      video.muted = true;
      try {
        await video.play();
      } catch (e) {
        console.error(e);
        return setFailure("error");
      }
      if (cancelled) return;
      setReady(true);

      // Native decoder where there is one, jsQR everywhere else. jsQR is
      // pulled in on demand so it stays out of the main bundle.
      let detector: BarcodeDetectorLike | null = null;
      if (window.BarcodeDetector) {
        try {
          detector = new window.BarcodeDetector({ formats: ["qr_code"] });
        } catch {
          detector = null;
        }
      }
      const jsQR = detector ? null : (await import("jsqr")).default;
      if (cancelled) return;

      const canvas = (canvasRef.current ??= document.createElement("canvas"));
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) return setFailure("error");

      const tick = async () => {
        rafRef.current = requestAnimationFrame(() => void tick());
        if (doneRef.current || video.readyState < video.HAVE_CURRENT_DATA) return;

        const scale = Math.min(1, SAMPLE / Math.max(video.videoWidth, video.videoHeight));
        canvas.width = Math.round(video.videoWidth * scale);
        canvas.height = Math.round(video.videoHeight * scale);
        if (!canvas.width || !canvas.height) return;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        let text: string | null = null;
        if (detector) {
          try {
            const hits = await detector.detect(canvas);
            text = hits[0]?.rawValue ?? null;
          } catch {
            text = null;
          }
        } else if (jsQR) {
          const frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
          text = jsQR(frame.data, frame.width, frame.height, { inversionAttempts: "dontInvert" })?.data ?? null;
        }

        if (text && !doneRef.current) {
          doneRef.current = true;
          stop();
          onResult(text);
        }
      };
      void tick();
    }

    void start();
    return () => {
      cancelled = true;
      stop();
    };
  }, [onResult, stop]);

  const message: Record<Failure, string> = {
    denied: t("scanDenied"),
    nocamera: t("scanNoCamera"),
    insecure: t("scanInsecure"),
    unsupported: t("scanUnsupported"),
    error: t("commonError"),
  };

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-navy-950/95 backdrop-blur"
      role="dialog"
      aria-modal="true"
      aria-label={t("scanTitle")}
    >
      <div className="flex items-center justify-between gap-3 px-5 pt-[calc(env(safe-area-inset-top,0px)+14px)] pb-3">
        <span className="text-[13px] font-bold text-white">{t("scanTitle")}</span>
        <button
          type="button"
          onClick={() => {
            stop();
            onClose();
          }}
          className="flex h-9 w-9 items-center justify-center rounded-full text-white/80 hover:bg-white/10 hover:text-white"
          aria-label={t("scanClose")}
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      </div>

      <div className="relative flex-1 overflow-hidden">
        <video
          ref={videoRef}
          className="h-full w-full object-cover"
          playsInline
          muted
          autoPlay
        />

        {/* Aiming frame */}
        {ready && !failure && (
          <div className="pointer-events-none absolute inset-0 grid place-items-center">
            <div className="relative h-[62vw] max-h-72 w-[62vw] max-w-72">
              <span className="absolute left-0 top-0 h-10 w-10 rounded-tl-2xl border-l-4 border-t-4 border-gold-400" />
              <span className="absolute right-0 top-0 h-10 w-10 rounded-tr-2xl border-r-4 border-t-4 border-gold-400" />
              <span className="absolute bottom-0 left-0 h-10 w-10 rounded-bl-2xl border-b-4 border-l-4 border-gold-400" />
              <span className="absolute bottom-0 right-0 h-10 w-10 rounded-br-2xl border-b-4 border-r-4 border-gold-400" />
            </div>
          </div>
        )}

        {!ready && !failure && (
          <div className="absolute inset-0 grid place-items-center text-sm text-white/70">
            {t("scanStarting")}
          </div>
        )}

        {failure && (
          <div className="absolute inset-0 grid place-items-center px-8">
            <div className="max-w-sm text-center">
              <span className="icon-tile mx-auto h-14 w-14 bg-white/10 text-gold-300">
                <Icon name="lock" className="h-7 w-7" />
              </span>
              <p className="mt-4 text-[15px] font-bold text-white">{message[failure]}</p>
              <p className="mt-2 text-[13px] leading-relaxed text-white/55">{t("scanFallbackHint")}</p>
              <button
                type="button"
                onClick={() => {
                  stop();
                  onClose();
                }}
                className="btn-on-dark mt-5"
              >
                {t("scanClose")}
              </button>
            </div>
          </div>
        )}
      </div>

      {ready && !failure && (
        <p className="px-8 pb-[calc(env(safe-area-inset-bottom,0px)+20px)] pt-4 text-center text-[13px] text-white/60">
          {t("scanHint")}
        </p>
      )}
    </div>
  );
}
