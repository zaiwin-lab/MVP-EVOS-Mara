import { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { eventConfig } from "../config/eventConfig";
import { NAV, PILLARS } from "../content/site";
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

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

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
              {n.label}
            </NavLink>
          ))}
        </nav>
        <Link
          to="/check-in"
          className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-gold-400 px-4 py-2 text-sm font-bold text-navy-900 shadow-gold hover:bg-gold-300 lg:ml-2"
        >
          <Icon name="qr" className="h-4 w-4" />
          <span className="hidden sm:inline">Log Masuk / Check-In</span>
          <span className="sm:hidden">Check-In</span>
        </Link>
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
                {n.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
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
