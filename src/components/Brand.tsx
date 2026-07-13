import { eventConfig } from "../config/eventConfig";

export function LogoMark({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <rect width="64" height="64" rx="14" className="fill-navy-900" />
      <path
        d="M32 14 L46 48 H38.5 L35.7 40.5 H28.3 L25.5 48 H18 Z M30.4 34 H33.6 L32 29 Z"
        className="fill-gold-400"
      />
      <circle cx="32" cy="52" r="2.4" className="fill-gold-400" />
    </svg>
  );
}

export function Wordmark({ inverted = false }: { inverted?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <LogoMark />
      <div className="leading-tight">
        <div
          className={`text-[13px] font-bold tracking-tight ${
            inverted ? "text-white" : "text-navy-900"
          }`}
        >
          {eventConfig.product}
        </div>
        <div className="text-[11px] font-semibold text-gold-500">
          {eventConfig.module}
        </div>
      </div>
    </div>
  );
}

export function BrandFooter() {
  return (
    <footer className="mt-auto border-t border-navy-100 bg-navy-950 px-5 py-8 text-center">
      <div className="flex items-center justify-center gap-2">
        <LogoMark className="h-7 w-7" />
        <span className="text-sm font-bold text-white">
          {eventConfig.product} — {eventConfig.module}
        </span>
      </div>
      <p className="mt-3 text-xs leading-relaxed text-navy-200">
        Powered by {eventConfig.product} — {eventConfig.module} · An Innovation by{" "}
        <a
          href={eventConfig.collaboratorUrl}
          target="_blank"
          rel="noreferrer"
          className="font-semibold text-gold-400 underline decoration-gold-400/40 underline-offset-2 hover:text-gold-300"
        >
          KOBIS Berhad
        </a>
      </p>
      <p className="mt-1 text-[11px] font-medium tracking-wide text-gold-400">
        {eventConfig.footerSecondary}
      </p>
      <p className="mt-4 text-[10px] text-navy-400">
        Attendify™ has been configured to support the {eventConfig.eventName}{" "}
        participant journey.
      </p>
    </footer>
  );
}
