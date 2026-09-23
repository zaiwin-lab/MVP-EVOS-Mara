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

import type { Localized } from "../context/I18nContext";

export interface AttendanceSession {
  id: string;
  label: string;
  date: string;
  weekday: string;
}

/** A collaborating organisation shown in the brand strip / footer. */
export interface Partner {
  name: string;
  role: Localized; // short descriptor, e.g. "Penganjur"
  url?: string;
  /** Optional logo image path (public/…). When absent a text chip is shown
   *  — we never invent or redraw an official logo. */
  logo?: string;
  /**
   * Optical size correction for the certificate's logo row. Logos are set to a
   * common height, which makes a wide wordmark dominate a squarer emblem even
   * though both are "the same size". Tune per logo until the row looks even.
   */
  logoScale?: number;
}

/** A resource / Google Folder button. Empty url → "coming soon". */
export interface ResourceLink {
  id: string;
  title: Localized;
  desc: Localized;
  icon: string;
  url: string; // "" means coming soon
}

/** A role a participant can pick at check-in. `value` is what gets STORED
 *  (always Bahasa Melayu, so the admin export stays consistent); `label` is
 *  only what the visitor sees. */
export interface RoleOption {
  value: string;
  label: Localized;
}

/**
 * Certificate artwork. Leave `artworkUrl` blank and the site draws its own
 * certificate. Set it to an image in /public (A4 landscape, 297×210mm — 3508×2480px
 * at 300dpi prints cleanly) and that image becomes the certificate: the site
 * then overlays only the parts it has to fill in.
 */
/**
 * One line the site fills in on the printed artwork.
 *
 * Both measurements are percentages of the certificate itself rather than
 * pixels, so the same numbers hold on a phone preview, a desktop preview and
 * an A4 sheet. `bottomPct` is where the bottom of the line sits, measured
 * down from the top edge — anchoring to the bottom is what keeps the text
 * resting on the artwork's ruled line instead of drifting above it as the
 * type size changes.
 */
export interface CertificateField {
  /** Bottom of the line, as a percentage of the height. */
  bottomPct: number;
  /** Type size, as a percentage of the width (CSS `cqw`). */
  sizePct: number;
  color: string;
  weight: number;
}

export interface CertificateConfig {
  /**
   * The organiser's own artwork. When this is set the site prints nothing of
   * its own except the participant's name and organisation; everything else,
   * including the signature, is part of the image. Empty falls back to the
   * layout the site draws itself.
   */
  artworkUrl: string;
  /** Left and right edge of the ruled fields, as a percentage of the width. */
  fieldInsetPct: number;
  /** The participant's name, on the upper rule. */
  name: CertificateField;
  /** Their co-operative or organisation, on the rule below "of". */
  organisation: CertificateField;
  /** Print the serial and issue date along the bottom edge. */
  showSerial: boolean;
  /**
   * Which date the sheet carries.
   *
   * "programme" — the programme date, so every certificate for this event
   *   reads the same. This is what the printed reference shows.
   * "attendance" — the moment that participant's attendance was recorded.
   *   Truthful per person, but someone marked present a day late by the
   *   organiser would carry a different date to everyone else.
   */
  issuedDate: "programme" | "attendance";
}

export interface EventConfig {
  product: string;
  module: string;
  tagline: string;
  eventName: string;
  eventNameLocal: string;
  /** The programme name as it should read on the certificate, per language. */
  eventNameLocalized: Localized;
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
  heroKicker: Localized;
  heroLines: Localized[];
  heroSubline: Localized;
  motto: Localized;
  brandStrip: Localized;
  footer: string;
  footerSecondary: string;
  copyright: string;
  hashtags: string[];
  partners: Partner[];
  /** Role options for the check-in form (Peranan). */
  roleOptions: RoleOption[];
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
  certificate: CertificateConfig;
}

/** The real event. Anything else means this build is a rehearsal. */
export const LIVE_SLUG = "angkasa-ai-coop-2026";

export const eventConfig: EventConfig = {
  product: "ProgramOS",
  module: "Lite",
  tagline: "Transformasi Digital & AI untuk Koperasi",
  eventName: "Transformasi Digital & AI untuk Koperasi",
  eventNameLocal: "Digital & AI Transformation for Co-operatives",
  eventNameLocalized: {
    bm: "Transformasi Digital & AI untuk Koperasi",
    en: "Digital & AI Transformation for Co-operatives",
    zh: "合作社数字与 AI 转型课程",
    iban: "Transformasi Digital & AI ke Koperasi",
  },
  // Every Supabase query filters on this, so a build with a different slug
  // shares the database but cannot see — or be seen by — the real event's
  // data. That is what VITE_EVENT_SLUG is for: rehearsing the whole flow on a
  // throwaway deployment without touching live registrations.
  slug: (import.meta.env.VITE_EVENT_SLUG as string | undefined)?.trim() || LIVE_SLUG,
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
  heroKicker: {
    bm: "Program Pembangunan", en: "Development Programme",
    zh: "发展课程", iban: "Program Pemansang",
  },
  heroLines: [
    { bm: "TRANSFORMASI", en: "DIGITAL & AI", zh: "数字与 AI", iban: "TRANSFORMASI" },
    { bm: "DIGITAL & AI", en: "TRANSFORMATION", zh: "转型", iban: "DIGITAL & AI" },
    { bm: "UNTUK KOPERASI", en: "FOR CO-OPERATIVES", zh: "赋能合作社", iban: "KE KOPERASI" },
  ],
  heroSubline: {
    bm: "Operasi Lebih Cekap · Pemasaran Lebih Hebat · Hasil Lebih Baik",
    en: "Leaner Operations · Stronger Marketing · Better Results",
    zh: "营运更高效 · 营销更有力 · 成果更出色",
    iban: "Pengawa Lancar Agi · Pemasaran Kuat Agi · Hasil Manah Agi",
  },
  motto: {
    bm: "Ilmu Digital. Koperasi Berdaya. Masa Depan Bersama.",
    en: "Digital Know-How. Empowered Co-operatives. A Shared Future.",
    zh: "数字素养。赋能合作社。共享未来。",
    iban: "Penemu Digital. Koperasi Bekuasa. Jemah Ila Sama.",
  },
  brandStrip: {
    bm: "AI untuk Koperasi · Mudah · Praktikal · Impak Sebenar",
    en: "AI for Co-operatives · Simple · Practical · Real Impact",
    zh: "合作社的 AI · 简单 · 实用 · 真实影响",
    iban: "AI ke Koperasi · Mudah · Praktikal · Impak Amat",
  },
  footer: "ProgramOS Lite — Inisiatif bersama ANGKASA, KOBIS Berhad & SDEC",
  footerSecondary: "Smart Digital Solutions. Sustainable Impact.",
  copyright: "© 2026 ProgramOS Lite. Inisiatif bersama ANGKASA × KOBIS Berhad × SDEC.",
  hashtags: ["#AIuntukKoperasi", "#ProgramOSLite", "#BersamaKoperasi", "#MasaDepanBersama"],
  partners: [
    {
      name: "ANGKASA", url: "https://www.angkasa.coop", logo: "/logos/angkasa.png", logoScale: 2.45,
      role: { bm: "Penganjur", en: "Organiser", zh: "主办单位", iban: "Penganjur" },
    },
    {
      name: "KOBIS Berhad", url: "https://www.kobisberhad.com", logo: "/logos/kobis.png", logoScale: 1.4,
      role: { bm: "Kolaborator Strategik", en: "Strategic Collaborator", zh: "战略协作伙伴", iban: "Kolaborator Strategik" },
    },
    {
      name: "SDEC", url: "https://sdec.com.my", logo: "/logos/sdec.png", logoScale: 1.7,
      role: { bm: "Rakan Pendigitalan", en: "Digitalisation Partner", zh: "数码化伙伴", iban: "Rakan Pendigitalan" },
    },
  ],
  roleOptions: [
    { value: "Anggota Koperasi", label: { bm: "Anggota Koperasi", en: "Co-op member", zh: "合作社会员", iban: "Anggota Koperasi" } },
    { value: "Anggota Lembaga (ALK)", label: { bm: "Anggota Lembaga (ALK)", en: "Board member (ALK)", zh: "董事会成员（ALK）", iban: "Anggota Lembaga (ALK)" } },
    { value: "Pengurus / Kakitangan", label: { bm: "Pengurus / Kakitangan", en: "Manager / staff", zh: "经理／职员", iban: "Pengurus / Pengawa" } },
    { value: "Setiausaha", label: { bm: "Setiausaha", en: "Secretary", zh: "秘书", iban: "Setiausaha" } },
    { value: "Bendahari", label: { bm: "Bendahari", en: "Treasurer", zh: "财政", iban: "Bendahari" } },
    { value: "Pengerusi", label: { bm: "Pengerusi", en: "Chairperson", zh: "主席", iban: "Pengerusi" } },
    { value: "Lain-lain", label: { bm: "Lain-lain", en: "Other", zh: "其他", iban: "Bukai" } },
  ],
  resources: [
    {
      id: "slides", icon: "slides", url: "",
      title: { bm: "Slide Pembentangan", en: "Presentation Slides", zh: "演示幻灯片", iban: "Slide Pembentang" },
      desc: { bm: "Bahan pembentangan rasmi sesi program.", en: "The official session slide decks.", zh: "课程环节的官方演示材料。", iban: "Bahan pembentang resmi sesi program." },
    },
    {
      id: "toolkit", icon: "template", url: "",
      title: { bm: "Toolkit & Panduan", en: "Toolkit & Guides", zh: "工具包与指南", iban: "Toolkit & Panduan" },
      desc: { bm: "Toolkit praktikal, panduan langkah demi langkah.", en: "Practical toolkits and step-by-step guides.", zh: "实用工具包与逐步指南。", iban: "Toolkit praktikal, panduan selangkah-selangkah." },
    },
    {
      id: "templates", icon: "doc", url: "",
      title: { bm: "Template & Contoh", en: "Templates & Examples", zh: "模板与范例", iban: "Template & Chunto" },
      desc: { bm: "Template siap guna untuk promosi, laporan dan lain-lain.", en: "Ready-to-use templates for promotion, reporting and more.", zh: "可直接使用的推广、报告等模板。", iban: "Template ti sedia dikena ke promosi, laporan enggau bukai." },
    },
    {
      id: "prompts", icon: "spark", url: "",
      title: { bm: "Pakej Prompt AI", en: "AI Prompt Pack", zh: "AI 提示包", iban: "Pakej Prompt AI" },
      desc: { bm: "Koleksi prompt siap guna untuk koperasi.", en: "A ready-made prompt collection for co-operatives.", zh: "为合作社准备的现成提示集。", iban: "Kumpul prompt ti sedia dikena ke koperasi." },
    },
    {
      id: "videos", icon: "book", url: "",
      title: { bm: "Video Ringkas", en: "Short Videos", zh: "短视频", iban: "Video Pandak" },
      desc: { bm: "Rakaman sesi, video tutorial dan klip pembelajaran.", en: "Session recordings, tutorials and learning clips.", zh: "课程录像、教学视频与学习短片。", iban: "Rakam sesi, video tutorial enggau klip belajar." },
    },
    {
      id: "docs", icon: "document", url: "",
      title: { bm: "SOP & Dokumen Sokongan", en: "SOP & Support Docs", zh: "标准程序与支援文件", iban: "SOP & Dokumen Sukung" },
      desc: { bm: "SOP, nota, rujukan dan dokumen tambahan.", en: "SOPs, notes, references and supporting documents.", zh: "标准作业程序、笔记、参考与补充文件。", iban: "SOP, nota, rujukan enggau dokumen tambah." },
    },
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
  certificate: {
    // The organiser's artwork. Measured off the supplied file: the upper gold
    // rule sits at 44.45% of the height, the lower one at 52.65%, and both
    // run from 21.9% to 78.1% across. The two fields below rest on those.
    artworkUrl: "/sijil.jpg",
    fieldInsetPct: 22,
    // Both lines share one ink and one weight so they read as a pair. The
    // colour is the artwork's own: sampling the core of the strokes in "This
    // is to certify that" and "of" — the printed lines these two sit between
    // — gives #151751.
    name: { bottomPct: 43.4, sizePct: 3.6, color: "#151751", weight: 700 },
    organisation: { bottomPct: 51.9, sizePct: 2.4, color: "#151751", weight: 700 },
    // The artwork already carries the date, the venue and the signature, and
    // leaves no clear margin for a serial without sitting on the border.
    showSerial: false,
    issuedDate: "programme",
  },
};

/**
 * True when this build points at a scratch dataset rather than the live event.
 * The UI says so loudly — a rehearsal build reaching production by accident
 * would otherwise look identical while quietly collecting nothing real.
 */
export const IS_REHEARSAL = eventConfig.slug !== LIVE_SLUG;

// Route base for this event (keeps deep links / QR targets consistent)
export const eventBase = `/event/${eventConfig.slug}`;

// Admin gate — username + passcode, supplied at build time.
//
// IMPORTANT, and deliberately not a default: whatever is set here is compiled
// into the public JavaScript bundle, so anyone can read it. This gate keeps
// the dashboard out of the way of casual visitors; it is NOT access control.
// The participant tables are readable with the anon key regardless, so real
// protection means Supabase Auth plus RLS — see IMPROVEMENTS.md P0.
//
// There is no fallback value on purpose. A missing VITE_ADMIN_PASSWORD
// disables the gate's submit button rather than silently shipping a guessable
// default (it used to fall back to "123456").
export const ADMIN_USERNAME =
  (import.meta.env.VITE_ADMIN_USERNAME as string | undefined) || "admin";
export const ADMIN_PASSWORD =
  (import.meta.env.VITE_ADMIN_PASSWORD as string | undefined) ?? "";
export const ADMIN_PASSWORD_SET = ADMIN_PASSWORD.trim().length > 0;

// Public origin used when generating QR codes / share links.
export function publicOrigin(): string {
  const fromEnv = import.meta.env.VITE_PUBLIC_URL as string | undefined;
  if (fromEnv && fromEnv.trim()) return fromEnv.replace(/\/$/, "");
  if (typeof window !== "undefined") return window.location.origin;
  return "";
}
