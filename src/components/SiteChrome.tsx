import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { eventConfig } from "../config/eventConfig";
import { NAV, PILLARS } from "../content/site";
import { useI18n } from "../context/I18nContext";
import { useParticipant } from "../context/ParticipantContext";
import { LangToggle } from "./LangToggle";
import { LogoMark } from "./Brand";
import { Icon } from "./Icon";

const WRAP = "mx-auto w-full max-w-6xl px-5 sm:px-8";

/** ProgramOS Lite wordmark (text — we never redraw official partner logos). */
export function ProgramWordmark({ inverted = false }: { inverted?: boolean }) {
  const { t } = useI18n();
  return (
    <Link to="/" className="flex shrink-0 items-center gap-2.5" aria-label={t("homeAria")}>
      <LogoMark className="h-8 w-8 shrink-0 sm:h-9 sm:w-9" />
      <span className="leading-none">
        <span className={`block font-display text-[15px] font-extrabold tracking-[-0.01em] sm:text-[16px] ${inverted ? "text-white" : "text-navy-950"}`}>
          ProgramOS <span className="text-gold-400">Lite</span>
        </span>
        <span
          className={`mt-1 hidden text-[9.5px] font-bold uppercase tracking-[0.14em] sm:block ${
            inverted ? "text-white/45" : "text-slate2-dim"
          }`}
        >
          {t("wordmarkSub")}
        </span>
      </span>
    </Link>
  );
}

/** Small text chips for the three partners (no invented logos). */
export function PartnerStrip({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-wrap items-center gap-x-3 gap-y-1 ${className}`}>
      {eventConfig.partners.map((p) => (
        <span key={p.name} className="text-[11px] font-bold uppercase tracking-wide">
          {p.name}
        </span>
      ))}
    </div>
  );
}

function initials(name = ""): string {
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((w) => w[0] ?? "").join("").toUpperCase() || "?";
}

/**
 * Signed-in state in the global header: who you are, a way to your profile,
 * and a way out — on every page. Without this the header looked identical
 * whether or not you were logged in, which read as "it logged me out".
 */
export function AccountMenu() {
  const { record, signOut } = useParticipant();
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  // Close on outside click and on Escape, like a native menu.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Navigating away should close the menu.
  useEffect(() => setOpen(false), [pathname]);

  const p = record?.participant;

  // Signed out — the existing check-in call to action stands in. On the
  // check-in page itself it would point at the current page, so it is
  // suppressed there rather than sitting in the way.
  if (!p) {
    if (pathname === "/check-in" || pathname === "/register") return null;
    return (
      <Link
        to="/check-in"
        className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 py-2 text-[13px] font-bold text-navy-950 shadow-gold transition hover:brightness-[1.06] sm:px-4"
        style={{ backgroundImage: "var(--grad-btn)" }}
      >
        <Icon name="qr" className="h-4 w-4 shrink-0" />
        <span className="hidden 2xl:inline">{t("headerCta")}</span>
        <span className="2xl:hidden">{t("headerCtaShort")}</span>
      </Link>
    );
  }

  return (
    <div ref={boxRef} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="flex items-center gap-2 rounded-full border border-white/15 bg-white/10 py-1 pl-1 pr-2.5 transition hover:bg-white/20"
      >
        <span
          className="grid h-7 w-7 place-items-center rounded-full bg-gold-400 text-[11px] font-extrabold text-navy-900"
          aria-hidden="true"
        >
          {initials(p.fullName)}
        </span>
        <span className="hidden max-w-[92px] truncate text-[13px] font-bold text-white sm:block">
          {p.fullName.split(" ")[0]}
        </span>
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-white/50" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
          <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 z-50 mt-2 w-60 overflow-hidden rounded-2xl border border-slate2-line bg-white shadow-pop"
        >
          <div className="border-b border-slate2-line bg-sand-50 px-4 py-3">
            <p className="truncate text-sm font-bold text-navy-900">{p.fullName}</p>
            <p className="truncate text-xs text-navy-500">{p.coopName || p.companyName || p.email}</p>
            {p.ref && (
              <span className="mt-1.5 inline-block rounded bg-white px-1.5 py-0.5 font-mono text-[10px] font-bold text-navy-600">
                {p.ref}
              </span>
            )}
          </div>
          <Link to="/my" role="menuitem" className="block px-4 py-2.5 text-sm font-semibold text-navy-800 hover:bg-navy-50">
            {t("myProfile")}
          </Link>
          <Link to="/my#prompts" role="menuitem" className="block px-4 py-2.5 text-sm font-semibold text-navy-800 hover:bg-navy-50">
            {t("myPrompts")}
          </Link>
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setOpen(false);
              signOut();
              navigate("/");
            }}
            className="block w-full border-t border-navy-100 px-4 py-2.5 text-left text-sm font-semibold text-navy-500 hover:bg-navy-50"
          >
            {t("logOut")}
          </button>
        </div>
      )}
    </div>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const { t } = useI18n();

  // Pill nav: the active route is a filled pill, everything else is quiet.
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `whitespace-nowrap rounded-full px-2.5 py-1.5 text-[13px] font-bold transition ${
      isActive
        ? "bg-white text-navy-950 shadow-sm"
        : "text-white/65 hover:bg-white/10 hover:text-white"
    }`;

  return (
    <header className="sticky top-0 z-40 bg-navy-950 shadow-[0_1px_0_rgba(255,255,255,0.06)]">
      <div className={`${WRAP} flex items-center gap-3 py-2.5`}>
        <ProgramWordmark inverted />

        <nav className="ml-3 hidden min-w-0 items-center gap-0.5 xl:flex">
          {NAV.map((n) => (
            <NavLink key={n.label} to={n.to} end={n.to === "/"} className={linkClass}>
              {t(n.key) || n.label}
            </NavLink>
          ))}
        </nav>

        {/* The four-language bar is 143px wide, which does not fit beside the
            wordmark, the check-in CTA and the menu button on a 390px phone —
            so below `sm` it moves into the mobile menu instead. */}
        {/* The nav ends flush against the language pills without this; the
            hairline gives the two clusters somewhere to separate. */}
        <div className="ml-auto flex shrink-0 items-center gap-2 xl:border-l xl:border-white/10 xl:pl-4">
          <div className="hidden sm:block">
            <LangToggle tone="dark" />
          </div>
          <AccountMenu />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="flex h-9 w-9 items-center justify-center rounded-full text-white/80 hover:bg-white/10 hover:text-white xl:hidden"
            aria-label="Menu"
            aria-expanded={open}
          >
            <svg viewBox="0 0 24 24" className="h-5.5 w-5.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <nav className="border-t border-white/10 bg-navy-950 xl:hidden">
          {/* Language first — it changes everything below it. */}
          <div className={`${WRAP} flex items-center justify-between gap-3 border-b border-white/10 py-3 sm:hidden`}>
            <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-white/45">{t("language")}</span>
            <LangToggle tone="dark" />
          </div>
          <div className={`${WRAP} grid grid-cols-2 gap-1.5 py-3`}>
            {NAV.map((n) => (
              <Link
                key={n.label}
                to={n.to}
                onClick={() => setOpen(false)}
                className={`rounded-xl px-3 py-2.5 text-sm font-bold ${
                  pathname === n.to ? "bg-white text-navy-950" : "bg-white/8 text-white/75 hover:bg-white/15"
                }`}
              >
                {t(n.key) || n.label}
              </Link>
            ))}
          </div>
          <MobileAccountLinks onNavigate={() => setOpen(false)} />
        </nav>
      )}
    </header>
  );
}

/** Profile + log out inside the mobile menu, where the account chip is cramped. */
function MobileAccountLinks({ onNavigate }: { onNavigate: () => void }) {
  const { record, signOut } = useParticipant();
  const { t } = useI18n();
  const navigate = useNavigate();
  if (!record?.participant) return null;

  return (
    <div className={`${WRAP} grid grid-cols-2 gap-1 border-t border-navy-100 pb-3`}>
      <Link
        to="/my"
        onClick={onNavigate}
        className="mt-3 rounded-xl bg-gold-400 px-3 py-2.5 text-center text-sm font-bold text-navy-900"
      >
        {t("myProfile")}
      </Link>
      <button
        type="button"
        onClick={() => {
          onNavigate();
          signOut();
          navigate("/");
        }}
        className="mt-3 rounded-xl bg-navy-50 px-3 py-2.5 text-sm font-semibold text-navy-600"
      >
        {t("logOut")}
      </button>
    </div>
  );
}

export function SiteFooter() {
  const { t, pick } = useI18n();
  return (
    <footer className="mt-auto bg-navy-950 text-white">
      {/* Pillars band */}
      <div className="border-b border-white/10">
        <div className={`${WRAP} grid gap-5 py-8 sm:grid-cols-3`}>
          {PILLARS.map((p) => (
            <div key={pick(p.title)} className="flex items-start gap-3">
              <span className="icon-tile mt-0.5 h-9 w-9 shrink-0 bg-gold-400/15 text-gold-300">
                <Icon name="checkCircle" className="h-4 w-4" />
              </span>
              <div>
                <div className="text-sm font-bold text-white">{pick(p.title)}</div>
                <div className="text-xs leading-relaxed text-white/50">{pick(p.desc)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={`${WRAP} py-9`}>
        <div className="rounded-2xl border border-gold-400/20 bg-gold-400/[0.08] px-5 py-4 text-center">
          <p className="font-display text-sm font-bold text-gold-200">{t("footerTagline")}</p>
        </div>

        {/* Brand block beside link columns — the Sales Portal footer shape. */}
        <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr]">
          <div>
            <ProgramWordmark inverted />
            <p className="mt-3 max-w-sm text-[13px] leading-relaxed text-white/55">
              {pick(eventConfig.motto)}
            </p>
            <PartnerStrip className="mt-4 text-white/40" />
          </div>

          <FooterColumn title={t("navProgramme")} links={NAV.slice(0, 3).map((n) => ({ to: n.to, label: t(n.key) || n.label }))} />
          <FooterColumn title={t("resources")} links={NAV.slice(3).map((n) => ({ to: n.to, label: t(n.key) || n.label }))} />
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[11px] text-white/45">{eventConfig.footerSecondary}</p>
            <p className="text-[11px] text-white/30">{eventConfig.copyright}</p>
          </div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            {eventConfig.hashtags.map((h) => (
              <span key={h} className="text-[10px] font-semibold text-white/30">{h}</span>
            ))}
            {/* Organiser entry point. Kept quiet rather than hidden — the gate
                is a convenience, not access control, so obscurity buys nothing. */}
            <Link
              to="/admin"
              className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-white/40 underline-offset-4 hover:text-gold-300 hover:underline"
            >
              <Icon name="lock" className="h-3 w-3" />
              {t("admin")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: { to: string; label: string }[] }) {
  return (
    <div>
      <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/35">{title}</div>
      <ul className="mt-3 space-y-2">
        {links.map((l) => (
          <li key={l.to}>
            <Link to={l.to} className="text-[13.5px] font-medium text-white/65 transition hover:text-gold-300">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * The navy masthead every sub-page opens with: eyebrow, title, lede, and
 * whatever that page needs underneath. Keeping it in one place is what makes
 * the pages look like one site rather than twelve variations.
 */
export function PageHero({
  eyebrow,
  title,
  lede,
  children,
  above,
  size = "md",
}: {
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  lede?: React.ReactNode;
  /** Extra content below the lede — chips, progress, a CTA. */
  children?: React.ReactNode;
  /** Slot above the eyebrow, for a back link. */
  above?: React.ReactNode;
  /** "sm" for pages people arrive at mid-task, where the form matters more. */
  size?: "sm" | "md";
}) {
  return (
    <section className="hero-glow relative overflow-hidden bg-navy-950 text-white">
      <div className="hero-grid pointer-events-none absolute inset-0" />
      <div className={`relative ${WRAP} ${size === "sm" ? "py-7 sm:py-10" : "py-10 sm:py-14"}`}>
        {above}
        {eyebrow && (
          <span className="inline-flex items-center rounded-full border border-gold-400/25 bg-gold-400/10 px-3 py-1 text-[10.5px] font-extrabold uppercase tracking-[0.15em] text-gold-300">
            {eyebrow}
          </span>
        )}
        <h1
          className={`h-display mt-4 ${
            size === "sm" ? "text-[26px] sm:text-[34px]" : "text-[30px] sm:text-[42px]"
          }`}
        >
          {title}
        </h1>
        {lede && <p className="mt-3 max-w-2xl text-[14.5px] leading-relaxed text-white/60 sm:text-base">{lede}</p>}
        {children}
      </div>
    </section>
  );
}

/** Centred eyebrow + heading + lede that opens a light section. */
export function SectionHead({
  eyebrow,
  title,
  lede,
  align = "center",
}: {
  eyebrow?: string;
  title: React.ReactNode;
  lede?: React.ReactNode;
  align?: "center" | "left";
}) {
  return (
    <div className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      {eyebrow && <span className="section-eyebrow">{eyebrow}</span>}
      <h2 className="h-section mt-4">{title}</h2>
      {lede && <p className={`lede mt-3 ${align === "center" ? "mx-auto max-w-xl" : ""}`}>{lede}</p>}
    </div>
  );
}

/** Full-page wrapper for public marketing pages. */
export function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col bg-[--page]">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}

export const SITE_WRAP = WRAP;
