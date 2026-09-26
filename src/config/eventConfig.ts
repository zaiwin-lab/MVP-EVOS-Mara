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
/**
 * Cache-buster for files served out of `public/`.
 *
 * Netlify's SPA fallback answers a missing path with index.html and a 200,
 * and a 200 is cacheable. Any asset requested before it existed therefore
 * leaves an HTML entry in the edge cache under its own path, and that entry
 * outlives every later deploy that ships the real file — the deploy permalink
 * serves the image while the site's own hostname keeps serving the HTML.
 *
 * The query string is part of the cache key, so bumping it asks the edge for
 * a path it has never answered. Bump when an asset comes back as HTML.
 */
const ASSET_V = "2";
const asset = (path: string) => `${path}?v=${ASSET_V}`;

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
  /**
   * Palette this portal wears. Maps to a `:root[data-theme="…"]` block
   * that redefines the Tailwind colour tokens. Omit for the default.
   */
  theme?: string;
  certificate: CertificateConfig;
}

/** The real event. Anything else means this build is a rehearsal. */
export const LIVE_SLUG = "ceonita-strategik-2026";

export const eventConfig: EventConfig = {
  product: "CEOnita",
  module: "Strategik",
  tagline: "Transformasi Kepimpinan Wanita Dalam Ekosistem Ekonomi MADANI",
  eventName: "CEOnita Strategik",
  eventNameLocal: "Transformasi Kepimpinan Wanita Dalam Ekosistem Ekonomi MADANI",
  eventNameLocalized: {
    bm: "Transformasi Kepimpinan Wanita Dalam Ekosistem Ekonomi MADANI",
    en: "Women's Leadership Transformation in the MADANI Economy",
  },
  // Every Supabase query filters on this, so CEOnita shares the database
  // with the other portals but cannot see — or be seen by — their data.
  slug: (import.meta.env.VITE_EVENT_SLUG as string | undefined)?.trim() || LIVE_SLUG,
  theme: (import.meta.env.VITE_THEME as string | undefined)?.trim() || "ceonita",
  refPrefix: "CEO",
  dates: "28–29 September 2026",
  time: "2 hari · 28–29 September 2026",
  weekday: "Isnin & Selasa / Monday & Tuesday",
  venue: "Mines Beach Resort, Selangor",
  venueCity: "Seri Kembangan, Selangor",
  organiser: "CEOnita Strategik",
  collaborator: "KOBIS Berhad",
  collaboratorUrl: "https://www.kobisberhad.com",
  expectedParticipants: 30,
  maxPerCoop: 2,
  heroKicker: {
    bm: "Kepimpinan Wanita · 2026",
    en: "Women's Leadership · 2026",
  },
  heroLines: [
    { bm: "TRANSFORMASI", en: "TRANSFORMING" },
    { bm: "KEPIMPINAN WANITA", en: "WOMEN'S LEADERSHIP" },
    { bm: "EKONOMI MADANI", en: "IN THE MADANI ECONOMY" },
  ],
  heroSubline: {
    bm: "Daripada pengurus kepada pemimpin strategik bertaraf C-Suite.",
    en: "From manager to strategic, C-Suite-ready leader.",
  },
  motto: {
    bm: "Berani Bersinar. Bersedia Memimpin.",
    en: "Bold Enough to Shine. Ready to Lead.",
  },
  brandStrip: {
    bm: "Kepimpinan Strategik · Business Acumen · Digital & AI",
    en: "Strategic Leadership · Business Acumen · Digital & AI",
  },
  footer: "CEOnita Strategik — Transformasi Kepimpinan Wanita",
  footerSecondary: "Berani Bersinar. Bersedia Memimpin.",
  copyright: "© 2026 CEOnita Strategik. Hak cipta terpelihara.",
  hashtags: ["#CEOnitaStrategik", "#KepimpinanWanita", "#EkonomiMADANI", "#BeraniBersinar"],
  // No programme partners or sponsors have been supplied, and none are
  // invented here. Add them when the organiser confirms them.
  partners: [],
  roleOptions: [
    { value: "Usahawan / Pemilik Perniagaan", label: { bm: "Usahawan / Pemilik Perniagaan", en: "Entrepreneur / business owner" } },
    { value: "CEO / Pengarah Urusan", label: { bm: "CEO / Pengarah Urusan", en: "CEO / Managing Director" } },
    { value: "Ahli Lembaga Pengarah", label: { bm: "Ahli Lembaga Pengarah", en: "Board member" } },
    { value: "Pengurus Kanan", label: { bm: "Pengurus Kanan", en: "Senior manager" } },
    { value: "Pemimpin NGO Ekonomi", label: { bm: "Pemimpin NGO Ekonomi", en: "Economic NGO leader" } },
    { value: "Lain-lain", label: { bm: "Lain-lain", en: "Other" } },
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
      desc: { bm: "Koleksi prompt siap guna untuk perniagaan anda.", en: "A ready-made prompt collection for your business.", zh: "为合作社准备的现成提示集。", iban: "Kumpul prompt ti sedia dikena ke koperasi." },
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
  // Supplied by the organiser. "MODULE - BENGKEL AI" and "ALBUM - BENGKEL AI"
  // — identified by the folder names themselves rather than by the order the
  // two links arrived in, since swapping them would send participants looking
  // for slides into the photo album.
  // CEOnita's own folders. Both must be set to "Anyone with the link"
  // in Drive — created private, and a participant hitting a permission
  // wall mid-programme is worse than no button at all.
  moduleFolderUrl: "https://drive.google.com/drive/folders/1NtMg06KMYtRV0yuABVf2qzKcZcJc0XFB?usp=sharing",
  galleryUrl: "https://drive.google.com/drive/folders/1scZMEYJ3U86UtLRo0O6-t9-kXV2ScDf-?usp=sharing",
  galleryImages: [],
  resourcesDriveUrl: "",
  enableDigitalOfficer: false,
  intro:
    "CEOnita Strategik membina pemimpin wanita yang bersedia membuat keputusan bertaraf C-Suite — kepimpinan strategik, business acumen, Digital & AI, komunikasi dan rundingan. Daftar kehadiran, terokai 60 prompt AI untuk perniagaan anda, dan bina roadmap kepimpinan 90 hari anda.",
  introLocalized: {
    bm:
      "CEOnita Strategik membina pemimpin wanita yang bersedia membuat keputusan bertaraf C-Suite — kepimpinan strategik, business acumen, Digital & AI, komunikasi dan rundingan. Daftar kehadiran, terokai 60 prompt AI untuk perniagaan anda, dan bina roadmap kepimpinan 90 hari anda.",
    en:
      "CEOnita Strategik builds women leaders ready to make C-Suite-level decisions — strategic leadership, business acumen, Digital & AI, communication and negotiation. Check in, explore 60 AI prompts for your business, and build your 90-day leadership roadmap.",
  },
  attendanceSessions: [
    { id: "day1", label: "Hari 1", date: "28 September 2026", weekday: "Isnin / Monday" },
    { id: "day2", label: "Hari 2", date: "29 September 2026", weekday: "Selasa / Tuesday" },
  ],
  certificate: {
    // The organiser's artwork. Measured off the supplied file: the upper gold
    // rule sits at 44.45% of the height, the lower one at 52.65%, and both
    // run from 21.9% to 78.1% across. The two fields below rest on those.
    artworkUrl: asset("/sijil.jpg"),
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
