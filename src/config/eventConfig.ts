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
  introLocalized: Record<string, string>;
  footer: string;
  footerSecondary: string;
  collaboratorUrl: string;
  resourcesDriveUrl: string;
  attendanceSessions: AttendanceSession[];
}

export interface AttendanceSession {
  id: string; // e.g. "day-1"
  label: string; // e.g. "Day 1"
  date: string; // e.g. "14 July 2026"
  weekday: string; // e.g. "Tuesday"
}

export const eventConfig: EventConfig = {
  product: "KBT EventOS",
  module: "Attendify™",
  tagline: "One Scan. One Journey.",
  eventName: "VDP Frontier MARA Miri",
  eventNameLocal: "Program Pembangunan Usahawan Kontraktor Bumiputera",
  slug: "vdp-frontier-miri",
  dates: "14–16 July 2026",
  venue: "Dynasty Hotel Miri",
  organiser: "Majlis Amanah Rakyat — MARA",
  collaborator: "KOBIS Berhad",
  theme: "navy-gold",
  assessmentTemplate: "contractor-readiness-v1",
  expectedParticipants: 20,
  intro:
    "Welcome to Attendify™, the digital participant experience supporting VDP Frontier MARA Miri. Check in, complete your contractor profile, discover your readiness level, access programme resources, and prepare your 90-day business action plan — all in one place.",
  introLocalized: {
    en: "Welcome to Attendify™, the digital participant experience supporting VDP Frontier MARA Miri. Check in, complete your contractor profile, discover your readiness level, access programme resources, and prepare your 90-day business action plan — all in one place.",
    bm: "Selamat datang ke Attendify™, pengalaman peserta digital yang menyokong VDP Frontier MARA Miri. Daftar kehadiran, lengkapkan profil kontraktor anda, ketahui tahap kesediaan anda, akses bahan program, dan sediakan pelan tindakan perniagaan 90 hari anda — semuanya di satu tempat.",
    zh: "欢迎使用 Attendify™——支持 VDP Frontier MARA Miri 的数字参与者体验。签到、完善您的承包商资料、了解您的准备度水平、获取课程资源，并制定您的 90 天商业行动计划，一切尽在一处。",
    iban: "Selamat datai ke Attendify™, pengalaman peserta digital ke nyukung VDP Frontier MARA Miri. Daftar kehadiran, ngaga profil kontraktor nuan, nemu tinggi kesediaan nuan, ngambi bahan program, lalu nyendia pelan tindakan bisnis 90 hari nuan — semua ba siti endur.",
  } as Record<string, string>,
  footer: "Powered by KBT EventOS — Attendify™ · An Innovation by KOBIS Berhad",
  footerSecondary: "Smart Digital Solutions. Sustainable Impact.",
  collaboratorUrl: "https://www.kobisberhad.com",
  resourcesDriveUrl:
    "https://drive.google.com/drive/folders/1qQHuowoSiAQVAFxDThQQZR_eVEWF5AYq?usp=sharing",
  // Attendance sessions — future-proof: add more entries for extra sessions.
  attendanceSessions: [
    { id: "day-1", label: "Day 1", date: "14 July 2026", weekday: "Tuesday" },
    { id: "day-2", label: "Day 2", date: "15 July 2026", weekday: "Wednesday" },
    { id: "day-3", label: "Day 3", date: "16 July 2026", weekday: "Thursday" },
  ],
};

// Route base for this event (keeps deep links / QR targets consistent)
export const eventBase = `/event/${eventConfig.slug}`;

// Admin gate — username + password (overridable via env for production).
export const ADMIN_USERNAME =
  (import.meta.env.VITE_ADMIN_USERNAME as string | undefined) || "admin";
export const ADMIN_PASSWORD =
  (import.meta.env.VITE_ADMIN_PASSWORD as string | undefined) || "123456";

// Public origin used when generating QR codes / share links.
export function publicOrigin(): string {
  const fromEnv = import.meta.env.VITE_PUBLIC_URL as string | undefined;
  if (fromEnv && fromEnv.trim()) return fromEnv.replace(/\/$/, "");
  if (typeof window !== "undefined") return window.location.origin;
  return "";
}
