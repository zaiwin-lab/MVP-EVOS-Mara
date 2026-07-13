import { useNavigate } from "react-router-dom";
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
    <div className="app-shell flex flex-col">
      {header && (
        <header className="sticky top-0 z-20 flex items-center justify-between gap-2 border-b border-navy-100 bg-white/95 px-4 py-3 backdrop-blur">
          <button
            type="button"
            onClick={onBack ?? (() => navigate(-1))}
            className="flex h-9 w-9 items-center justify-center rounded-full text-navy-700 hover:bg-navy-50"
            aria-label="Back"
          >
            <Icon name="arrowLeft" />
          </button>
          {title ? (
            <h1 className="flex-1 truncate text-center text-sm font-bold text-navy-900">
              {title}
            </h1>
          ) : (
            <div className="flex-1" />
          )}
          <LangToggle tone="light" />
        </header>
      )}

      <main className={`flex flex-1 flex-col ${footer ? "pb-24" : ""} ${className}`}>
        {children}
      </main>

      {footer && (
        <div className="sticky bottom-0 z-20 border-t border-navy-100 bg-white/95 px-4 py-3 backdrop-blur [padding-bottom:calc(0.75rem+env(safe-area-inset-bottom))]">
          {footer}
        </div>
      )}
    </div>
  );
}

export function TopWordmarkBar() {
  return (
    <div className="flex items-center justify-between px-5 py-4">
      <Wordmark />
    </div>
  );
}
