// Lightweight inline icon set (stroke-based, currentColor).
// Keeps the bundle tiny and avoids an icon dependency.

type IconProps = { className?: string };

const base = "h-5 w-5";

function S({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className ?? base}
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

export const Icons = {
  building: (p: IconProps) => (
    <S className={p.className}>
      <path d="M3 21h18M6 21V5a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v16M14 9h3a1 1 0 0 1 1 1v11M9 8h.01M9 12h.01M9 16h.01" />
    </S>
  ),
  document: (p: IconProps) => (
    <S className={p.className}>
      <path d="M14 3v4a1 1 0 0 0 1 1h4" />
      <path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2Z" />
      <path d="M9 13h6M9 17h6" />
    </S>
  ),
  team: (p: IconProps) => (
    <S className={p.className}>
      <path d="M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM3 20a6 6 0 0 1 12 0M16 5.2a3 3 0 0 1 0 5.6M21 20a6 6 0 0 0-3.6-5.5" />
    </S>
  ),
  chart: (p: IconProps) => (
    <S className={p.className}>
      <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />
    </S>
  ),
  spark: (p: IconProps) => (
    <S className={p.className}>
      <path d="M12 3v3M12 18v3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M3 12h3M18 12h3M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" />
      <circle cx="12" cy="12" r="3" />
    </S>
  ),
  check: (p: IconProps) => (
    <S className={p.className}>
      <path d="m5 13 4 4L19 7" />
    </S>
  ),
  checkCircle: (p: IconProps) => (
    <S className={p.className}>
      <circle cx="12" cy="12" r="9" />
      <path d="m8.5 12 2.5 2.5 4.5-5" />
    </S>
  ),
  qr: (p: IconProps) => (
    <S className={p.className}>
      <path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h2v2h-2zM18 14h2v2h-2zM14 18h2v2h-2zM18 18h2v2h-2z" />
    </S>
  ),
  arrowRight: (p: IconProps) => (
    <S className={p.className}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </S>
  ),
  arrowLeft: (p: IconProps) => (
    <S className={p.className}>
      <path d="M19 12H5M11 6l-6 6 6 6" />
    </S>
  ),
  target: (p: IconProps) => (
    <S className={p.className}>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1" />
    </S>
  ),
  calendar: (p: IconProps) => (
    <S className={p.className}>
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </S>
  ),
  book: (p: IconProps) => (
    <S className={p.className}>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5v14ZM4 19.5A2.5 2.5 0 0 0 6.5 22H20" />
    </S>
  ),
  doc: (p: IconProps) => (
    <S className={p.className}>
      <path d="M14 3v4a1 1 0 0 0 1 1h4M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2Z" />
    </S>
  ),
  template: (p: IconProps) => (
    <S className={p.className}>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 9h18M9 21V9" />
    </S>
  ),
  slides: (p: IconProps) => (
    <S className={p.className}>
      <rect x="3" y="4" width="18" height="12" rx="1" />
      <path d="M12 16v4M8 20h8" />
    </S>
  ),
  search: (p: IconProps) => (
    <S className={p.className}>
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </S>
  ),
  download: (p: IconProps) => (
    <S className={p.className}>
      <path d="M12 3v12M7 10l5 5 5-5M5 21h14" />
    </S>
  ),
  users: (p: IconProps) => (
    <S className={p.className}>
      <circle cx="9" cy="8" r="3" />
      <path d="M3 20a6 6 0 0 1 12 0M17 20a6 6 0 0 0-4-5.7M15 5.2a3 3 0 0 1 0 5.6" />
    </S>
  ),
  clipboard: (p: IconProps) => (
    <S className={p.className}>
      <rect x="6" y="4" width="12" height="17" rx="2" />
      <path d="M9 4V3h6v1M9 11h6M9 15h4" />
    </S>
  ),
  lock: (p: IconProps) => (
    <S className={p.className}>
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </S>
  ),
  location: (p: IconProps) => (
    <S className={p.className}>
      <path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.5" />
    </S>
  ),
  clock: (p: IconProps) => (
    <S className={p.className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </S>
  ),
};

export type IconName = keyof typeof Icons;

export function Icon({ name, className }: { name: string; className?: string }) {
  const Cmp = (Icons as Record<string, (p: IconProps) => JSX.Element>)[name];
  return Cmp ? Cmp({ className }) : null;
}
