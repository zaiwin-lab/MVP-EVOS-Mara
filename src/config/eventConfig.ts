// ─────────────────────────────────────────────────────────────
// CENTRAL EVENT CONFIGURATION — ANGKASA × KOBIS ProgramOS Lite
// Everything programme-specific lives here. The UI reads from this
// object rather than hard-coding names, dates, links, or branding,
// so another KOBIS programme can reuse this build by editing config.
//
// IMPORTANT: this deployment uses event slug `angkasa-ai-coop-2026`,
// which keeps its data completely separate from the MARA deployment
// (slug `vdp-frontier-miri`). See src/data/store.ts.
// ─────────────────────────────────────────────────────────────

export interface AttendanceSession {
  id: string;
  label: string;
  date: string;
  weekday: string;
}

/** A collaborating organisation shown in the brand strip / footer. */
export interface Partner {
  name: string;
  role: string; // short descriptor, e.g. "Penganjur"
  url?: string;
  /** Optional logo image path (public/…). When absent a text chip is shown
   *  — we never invent or redraw an official logo. */
  logo?: string;
}

/** A resource / Google Folder button. Empty url → "Akan Dikemaskini". */
export interface ResourceLink {
  id: string;
  title: string;
  titleEn: string;
  desc: string;
  icon: string;
  url: string; // "" means coming soon
}

export interface EventConfig {
  product: string;
  module: string;
  tagline: string;
  eventName: string;
  eventNameLocal: string;
  slug: string;
  refPrefix: string;
  dates: string;
  time: string;
  weekday: string;
  venue: string;
  venueCity: string;
  organiser: string;
  collaborator: string;
  collaboratorUrl: string;
  expectedParticipants: number;
  maxPerCoop: number;
  heroKicker: string;
  heroLines: string[];
  heroSubline: string;
  motto: string;
  brandStrip: string;
  footer: string;
  footerSecondary: string;
  copyright: string;
  hashtags: string[];
  partners: Partner[];
  /** Role options for the check-in form (Peranan). */
  roleOptions: string[];
  /** Google Folder / resource buttons (spec §12). */
  resources: ResourceLink[];
  /** Single "open everything" module folder (nav: Modul Google Folder). */
  moduleFolderUrl: string;
  /** Photo gallery: config-driven external album OR local image URLs. */
  galleryUrl: string;
  galleryImages: string[];
  resourcesDriveUrl: string;
  /** ProgramOS Lite uses NO paid AI API — the floating AI officer is off. */
  enableDigitalOfficer: boolean;
  intro: string;
  introLocalized: Record<string, string>;
  attendanceSessions: AttendanceSession[];
}

export const eventConfig: EventConfig = {
  product: "ProgramOS",
  module: "Lite",
  tagline: "Transformasi Digital & AI untuk Koperasi",
  eventName: "Transformasi Digital & AI untuk Koperasi",
  eventNameLocal: "Digital & AI Transformation for Co-operatives",
  slug: "angkasa-ai-coop-2026",
  refPrefix: "POS",
  dates: "24 September 2026",
  time: "8:30 AM – 5:00 PM",
  weekday: "Khamis / Thursday",
  venue: "Hotel Serapi, Kuching",
  venueCity: "Kuching, Sarawak",
  organiser: "ANGKASA Sarawak",
  collaborator: "KOBIS Berhad",
  collaboratorUrl: "https://www.kobisberhad.com",
  expectedParticipants: 30,
  maxPerCoop: 2,
  heroKicker: "Program Pembangunan",
  heroLines: ["TRANSFORMASI", "DIGITAL & AI", "UNTUK KOPERASI"],
  heroSubline: "Operasi Lebih Cekap · Pemasaran Lebih Hebat · Hasil Lebih Baik",
  motto: "Ilmu Digital. Koperasi Berdaya. Masa Depan Bersama.",
  brandStrip: "AI untuk Koperasi · Mudah · Praktikal · Impak Sebenar",
  footer: "ProgramOS Lite — Inisiatif bersama ANGKASA, KOBIS Berhad & SDEC",
  footerSecondary: "Smart Digital Solutions. Sustainable Impact.",
  copyright: "© 2026 ProgramOS Lite. Inisiatif bersama ANGKASA × KOBIS Berhad × SDEC.",
  hashtags: ["#AIuntukKoperasi", "#ProgramOSLite", "#BersamaKoperasi", "#MasaDepanBersama"],
  partners: [
    { name: "ANGKASA", role: "Penganjur", url: "https://www.angkasa.coop" },
    { name: "KOBIS Berhad", role: "Kolaborator & Pemilik Produk", url: "https://www.kobisberhad.com" },
    { name: "SDEC", role: "Sokongan Digital Sarawak", url: "https://sdec.com.my" },
  ],
  roleOptions: [
    "Anggota Koperasi",
    "Anggota Lembaga (ALK)",
    "Pengurus / Kakitangan",
    "Setiausaha",
    "Bendahari",
    "Pengerusi",
    "Lain-lain",
  ],
  resources: [
    { id: "slides", title: "Slide Pembentangan", titleEn: "Presentation Slides", desc: "Bahan pembentangan rasmi sesi program.", icon: "slides", url: "" },
    { id: "toolkit", title: "Toolkit & Panduan", titleEn: "Toolkit & Guides", desc: "Toolkit praktikal, panduan langkah demi langkah.", icon: "template", url: "" },
    { id: "templates", title: "Template & Contoh", titleEn: "Templates & Examples", desc: "Template siap guna untuk promosi, laporan dan lain-lain.", icon: "doc", url: "" },
    { id: "prompts", title: "Pakej Prompt AI", titleEn: "AI Prompt Pack", desc: "Koleksi prompt siap guna untuk koperasi.", icon: "spark", url: "" },
    { id: "videos", title: "Video Ringkas", titleEn: "Short Videos", desc: "Rakaman sesi, video tutorial dan klip pembelajaran.", icon: "book", url: "" },
    { id: "docs", title: "SOP & Dokumen Sokongan", titleEn: "SOP & Support Docs", desc: "SOP, nota, rujukan dan dokumen tambahan.", icon: "document", url: "" },
  ],
  moduleFolderUrl: "",
  galleryUrl: "",
  galleryImages: [],
  resourcesDriveUrl: "",
  enableDigitalOfficer: false,
  intro:
    "ProgramOS Lite membantu koperasi menerap AI dalam operasi harian — mudah, praktikal dan berimpak. Daftar kehadiran, nilai kesiapsiagaan AI koperasi anda, terokai 60 prompt praktikal merentas 6 bidang utama, dan rancang perjalanan 90 hari anda.",
  introLocalized: {
    bm:
      "ProgramOS Lite membantu koperasi menerap AI dalam operasi harian — mudah, praktikal dan berimpak. Daftar kehadiran, nilai kesiapsiagaan AI koperasi anda, terokai 60 prompt praktikal merentas 6 bidang utama, dan rancang perjalanan 90 hari anda.",
    en:
      "ProgramOS Lite helps co-operatives adopt AI in daily operations — simple, practical and impactful. Check in, assess your co-op's AI readiness, explore 60 practical prompts across 6 key work areas, and plan your 90-day journey.",
  },
  attendanceSessions: [
    { id: "main", label: "Sesi Program", date: "24 September 2026", weekday: "Khamis / Thursday" },
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
