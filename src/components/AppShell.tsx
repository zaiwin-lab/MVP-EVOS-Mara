import { Link, useNavigate } from "react-router-dom";
import { Wordmark } from "./Brand";
import { Icon } from "./Icon";
import { LangToggle } from "./LangToggle";

interface AppShellProps {
  children: React.ReactNode;
  /** Show a top bar with back button + optional title. */
  header?: boolean;
  title?: string;
  onBack?: () => void;
  /** Sticky footer action area (e.g. primary CTA). */
  footer?: React.ReactNode;
  className?: string;
}

// Content column width — comfortable on desktop, full-bleed on phones.
const COL = "mx-auto w-full max-w-3xl";

export function AppShell({
  children,
  header = false,
  title,
  onBack,
  footer,
  className = "",
}: AppShellProps) {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-dvh flex-col bg-white">
      {header && (
        <header className="sticky top-0 z-30 border-b border-navy-100 bg-white/95 backdrop-blur">
          <div className={`${COL} flex items-center gap-3 px-4 py-3 sm:px-6`}>
            <button
              type="button"
              onClick={onBack ?? (() => navigate(-1))}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-navy-700 hover:bg-navy-50"
              aria-label="Back"
            >
              <Icon name="arrowLeft" />
            </button>

            {/* Brand doubles as a Home link (always available) */}
            <Link to="/" aria-label="Home" className="hidden shrink-0 sm:block">
              <Wordmark />
            </Link>

            {title ? (
              <h1 className="flex-1 truncate text-center text-sm font-bold text-navy-900">
                {title}
              </h1>
            ) : (
              <div className="flex-1" />
            )}

            <div className="flex shrink-0 items-center gap-2">
              <LangToggle tone="light" />
              <Link
                to="/"
                aria-label="Home"
                title="Home"
                className="flex h-9 w-9 items-center justify-center rounded-full text-navy-600 hover:bg-navy-50 sm:hidden"
              >
                <HomeGlyph />
              </Link>
            </div>
          </div>
        </header>
      )}

      <main className="flex flex-1 flex-col">
        <div className={`${COL} flex flex-1 flex-col ${footer ? "pb-24" : ""} ${className}`}>
          {children}
        </div>
      </main>

      {footer && (
        <div className="sticky bottom-0 z-30 border-t border-navy-100 bg-white/95 backdrop-blur [padding-bottom:calc(0.75rem+env(safe-area-inset-bottom))]">
          <div className={`${COL} px-4 py-3 sm:px-6`}>{footer}</div>
        </div>
      )}
    </div>
  );
}

function HomeGlyph({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M3 11.5 12 4l9 7.5M5.5 10v9.5h13V10"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function TopWordmarkBar() {
  return (
    <div className="flex items-center justify-between px-5 py-4">
      <Wordmark />
    </div>
  );
}
