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
  return (
    <Link to="/" className="flex items-center gap-2.5" aria-label="ProgramOS Lite — Utama">
      <LogoMark className="h-9 w-9" />
      <span className="leading-none">
        <span className={`font-display text-[17px] font-extrabold tracking-tight ${inverted ? "text-white" : "text-navy-900"}`}>
          ProgramOS <span className="text-gold-500">Lite</span>
        </span>
        <span className={`mt-0.5 block text-[10px] font-semibold ${inverted ? "text-navy-200" : "text-navy-400"}`}>
          AI untuk Koperasi
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
        className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full bg-gold-400 px-3.5 py-2 text-[13px] font-bold text-navy-900 shadow-gold hover:bg-gold-300 sm:px-4 sm:text-sm"
      >
        <Icon name="qr" className="h-4 w-4 shrink-0" />
        <span className="hidden lg:inline">Log Masuk / Check-In</span>
        <span className="lg:hidden">Check-In</span>
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
        className="flex items-center gap-2 rounded-full border border-navy-100 bg-navy-50 py-1 pl-1 pr-3 hover:bg-navy-100"
      >
        <span
          className="grid h-7 w-7 place-items-center rounded-full bg-gold-400 text-[11px] font-extrabold text-navy-900"
          aria-hidden="true"
        >
          {initials(p.fullName)}
        </span>
        <span className="max-w-[92px] truncate text-sm font-bold text-navy-800">
          {p.fullName.split(" ")[0]}
        </span>
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-navy-400" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
          <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-xl"
        >
          <div className="border-b border-navy-100 bg-navy-50 px-4 py-3">
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

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `rounded-full px-3 py-1.5 text-sm font-semibold transition ${
      isActive
        ? "bg-navy-900 text-white"
        : "text-navy-600 hover:bg-navy-50 hover:text-navy-900"
    }`;

  return (
    <header className="sticky top-0 z-40 border-b border-navy-100 bg-white/95 backdrop-blur">
      {/* Partner strip */}
      <div className="bg-navy-950 text-white">
        <div className={`${WRAP} flex items-center justify-between gap-3 py-1.5`}>
          <PartnerStrip className="text-gold-300" />
          <span className="hidden text-[11px] text-navy-200 sm:block">{eventConfig.brandStrip}</span>
        </div>
      </div>

      {/* Main bar */}
      <div className={`${WRAP} flex items-center gap-3 py-3`}>
        <ProgramWordmark />
        <nav className="ml-auto hidden items-center gap-1 lg:flex">
          {NAV.map((n) => (
            <NavLink key={n.label} to={n.to} end={n.to === "/"} className={linkClass}>
              {t(n.key) || n.label}
            </NavLink>
          ))}
        </nav>
        {/* The four-language system existed but nothing ever rendered its
            toggle, so participants had no way to switch. The full four-button
            bar is 143px wide, which does not fit beside the wordmark, the
            check-in CTA and the menu button on a 390px phone — so below `sm`
            it moves into the mobile menu instead of pushing them off-screen. */}
        <div className="ml-auto flex shrink-0 items-center gap-2 lg:ml-2">
          <div className="hidden sm:block">
            <LangToggle tone="light" />
          </div>
          <AccountMenu />
        </div>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-full text-navy-700 hover:bg-navy-50 lg:hidden"
          aria-label="Menu"
          aria-expanded={open}
        >
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <nav className="border-t border-navy-100 bg-white lg:hidden">
          {/* Language first — it changes everything below it. */}
          <div className={`${WRAP} flex items-center justify-between gap-3 border-b border-navy-50 py-3 sm:hidden`}>
            <span className="text-xs font-bold uppercase tracking-wide text-navy-400">{t("language")}</span>
            <LangToggle tone="light" />
          </div>
          <div className={`${WRAP} grid grid-cols-2 gap-1 py-3`}>
            {NAV.map((n) => (
              <Link
                key={n.label}
                to={n.to}
                onClick={() => setOpen(false)}
                className={`rounded-xl px-3 py-2.5 text-sm font-semibold ${
                  pathname === n.to ? "bg-navy-900 text-white" : "bg-navy-50 text-navy-700"
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
  return (
    <footer className="mt-auto bg-navy-950 text-white">
      {/* Pillars band */}
      <div className="border-b border-white/10">
        <div className={`${WRAP} grid gap-5 py-8 sm:grid-cols-3`}>
          {PILLARS.map((p) => (
            <div key={p.title} className="flex items-start gap-3">
              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gold-400/15 text-gold-300">
                <Icon name="checkCircle" className="h-4 w-4" />
              </span>
              <div>
                <div className="text-sm font-bold text-white">{p.title}</div>
                <div className="text-xs text-navy-200">{p.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={`${WRAP} py-8`}>
        <div className="rounded-2xl border border-gold-400/20 bg-gold-400/10 px-5 py-4 text-center">
          <p className="font-display text-sm font-bold text-gold-200">
            AI Bukan Menggantikan Manusia, Tetapi Memperkasa Koperasi.
          </p>
        </div>

        <div className="mt-6 flex flex-col items-center gap-2 text-center">
          <ProgramWordmark inverted />
          <p className="mt-1 text-xs font-semibold tracking-wide text-gold-300">{eventConfig.motto}</p>
          <PartnerStrip className="mt-2 justify-center text-navy-200" />
          <p className="mt-2 text-[11px] text-navy-300">{eventConfig.footerSecondary}</p>
          <p className="text-[11px] text-navy-400">{eventConfig.copyright}</p>
          <div className="mt-2 flex flex-wrap justify-center gap-x-3 gap-y-1 text-[10px] font-semibold text-navy-300">
            {eventConfig.hashtags.map((h) => (
              <span key={h}>{h}</span>
            ))}
          </div>

          {/* Organiser entry point. Kept quiet rather than hidden — the gate is
              a convenience, not access control, so obscurity buys nothing. */}
          <Link
            to="/admin"
            className="mt-4 inline-flex items-center gap-1.5 text-[11px] font-semibold text-navy-400 underline-offset-4 hover:text-gold-300 hover:underline"
          >
            <Icon name="lock" className="h-3 w-3" />
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}

/** Full-page wrapper for public marketing pages. */
export function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col bg-white">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}

export const SITE_WRAP = WRAP;
