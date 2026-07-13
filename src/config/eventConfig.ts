// ─────────────────────────────────────────────────────────────
// CENTRAL EVENT CONFIGURATION
// Everything event-specific lives here. To run Attendify for a new
// programme, copy this object and change the values — the UI reads
// from it rather than hard-coding names, dates, or branding.
// ─────────────────────────────────────────────────────────────

export interface EventConfig {
  product: string;
  module: string;
  tagline: string;
  eventName: string;
  eventNameLocal: string;
  slug: string;
  dates: string;
  venue: string;
  organiser: string;
  collaborator: string;
  theme: string;
  assessmentTemplate: string;
  expectedParticipants: number;
  intro: string;
  footer: string;
  footerSecondary: string;
}

export const eventConfig: EventConfig = {
  product: "KBT EventOS",
  module: "Attendify™",
  tagline: "One Scan. One Journey.",
  eventName: "VDP Frontier MARA Miri",
  eventNameLocal: "Program Pembangunan Usahawan Kontraktor Bumiputera",
  slug: "vdp-frontier-miri",
  dates: "14–16 July 2026",
  venue: "MARA Miri",
  organiser: "Majlis Amanah Rakyat — MARA",
  collaborator: "KOBIS Berhad",
  theme: "navy-gold",
  assessmentTemplate: "contractor-readiness-v1",
  expectedParticipants: 20,
  intro:
    "Welcome to Attendify™, the digital participant experience supporting VDP Frontier MARA Miri. Check in, complete your contractor profile, discover your readiness level, access programme resources, and prepare your 90-day business action plan — all in one place.",
  footer: "Powered by KBT EventOS — Attendify™ · An Innovation by KOBIS Berhad",
  footerSecondary: "Smart Digital Solutions. Sustainable Impact.",
};

// Route base for this event (keeps deep links / QR targets consistent)
export const eventBase = `/event/${eventConfig.slug}`;

// Admin gate — password may be overridden via VITE_ADMIN_PASSWORD.
export const ADMIN_PASSWORD =
  (import.meta.env.VITE_ADMIN_PASSWORD as string | undefined) || "attendify2026";

// Public origin used when generating QR codes / share links.
export function publicOrigin(): string {
  const fromEnv = import.meta.env.VITE_PUBLIC_URL as string | undefined;
  if (fromEnv && fromEnv.trim()) return fromEnv.replace(/\/$/, "");
  if (typeof window !== "undefined") return window.location.origin;
  return "";
}
