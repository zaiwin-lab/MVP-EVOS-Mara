// ─────────────────────────────────────────────────────────────
// PROGRAMME CONTENT — VDP Frontier MARA Miri
// Sourced from the official programme brochure. Editable in one place.
// ─────────────────────────────────────────────────────────────

import type { Localized } from "../context/I18nContext";

export interface ScheduleItem {
  time: string; // e.g. "2:00 PM"
  activity: string;
  trainer?: string;
  kind?: "session" | "break" | "meal" | "admin"; // affects styling
}

export interface ProgrammeDay {
  day: number;
  date: string;
  weekday: string;
  timeRange: string;
  journeyWord: string; // BUILD / COMPETE / GROW
  trainer: string;
  title: string;
  titleI18n?: Localized;
  theme: string;
  topics: string[];
  /** Detailed session-by-session schedule. Populate from the official
   *  Tentatif Program; falls back to `topics` in the UI when empty. */
  schedule: ScheduleItem[];
}

export interface Trainer {
  name: string;
  role: string;
  roleI18n?: Localized;
  title: string;
  focusAreas: string[];
  initials: string;
}

export interface ResourceItem {
  id: string;
  title: string;
  titleI18n?: Localized;
  description: string;
  url?: string; // when set, the card links out; otherwise "Coming During the Programme"
  icon: string;
}

// Verbatim from the official "Tentatif Program — VDP Frontier MARA Miri".
// Activity names, times and trainer titles must match the source document.
export const PROGRAMME_DAYS: ProgrammeDay[] = [
  {
    day: 1,
    date: "14 July 2026",
    weekday: "Tuesday",
    timeRange: "2:00 PM – 10:00 PM",
    journeyWord: "BUILD",
    trainer: "Ts. Nizam Dato Khalid — Pengerusi DUBS Cawangan Kuching",
    title: "Membina Asas Perniagaan",
    titleI18n: {
      en: "Building Business Foundations",
      bm: "Membina Asas Perniagaan",
      zh: "打造业务基础",
      iban: "Ngaga Dasar Bisnis",
    },
    theme: "Foundations",
    topics: [
      "Minda Usahawan Kontraktor",
      "Profil Syarikat",
      "Capability Statement",
      "Perkongsian Industri",
    ],
    schedule: [
      { time: "2.00–2.30", activity: "Pendaftaran Peserta", kind: "admin" },
      { time: "2.30–3.00", activity: "Ucapan Aluan & Taklimat" },
      { time: "3.00–3.30", activity: "Ice Breaking" },
      { time: "3.30–3.45", activity: "Minum Petang", kind: "break" },
      { time: "3.45–5.30", activity: "Modul 1: Minda Usahawan Kontraktor" },
      { time: "5.30–7.00", activity: "Rehat / Solat / Makan", kind: "meal" },
      { time: "7.00–8.30", activity: "Modul 2: Profil Syarikat & Capability Statement" },
      { time: "8.30–9.45", activity: "Perkongsian Industri" },
      { time: "9.45–10.00", activity: "Rumusan" },
    ],
  },
  {
    day: 2,
    date: "15 July 2026",
    weekday: "Wednesday",
    timeRange: "8:00 AM – 10:30 PM",
    journeyWord: "COMPETE",
    trainer: "Ts. Nizam Dato Khalid — Pengerusi DUBS Cawangan Kuching",
    title: "Memperkukuh Daya Saing",
    titleI18n: {
      en: "Strengthening Competitiveness",
      bm: "Memperkukuh Daya Saing",
      zh: "增强竞争力",
      iban: "Ngeringka Daya Saing",
    },
    theme: "Opportunities",
    topics: [
      "Keupayaan Teknikal",
      "Pengurusan Projek",
      "Pembangunan Vendor",
      "Tender & Proposal",
      "Pitching",
    ],
    schedule: [
      { time: "8.00–8.30", activity: "Sarapan", kind: "meal" },
      { time: "8.30–10.30", activity: "Modul 3: Keupayaan Teknikal & Pengurusan Projek" },
      { time: "10.30–10.45", activity: "Minum Pagi", kind: "break" },
      { time: "10.45–12.30", activity: "Modul 4: Pembangunan Vendor" },
      { time: "12.30–2.00", activity: "Rehat / Solat / Makan", kind: "meal" },
      { time: "2.00–4.00", activity: "Modul 5: Tender & Proposal" },
      { time: "4.00–4.15", activity: "Minum Petang", kind: "break" },
      { time: "4.15–6.00", activity: "Bengkel Proposal" },
      { time: "6.00–7.30", activity: "Rehat / Solat / Makan", kind: "meal" },
      { time: "7.30–9.30", activity: "Pitching & Strategic Coaching" },
      { time: "9.30–10.30", activity: "Refleksi" },
    ],
  },
  {
    day: 3,
    date: "16 July 2026",
    weekday: "Thursday",
    timeRange: "8:00 AM – 12:00 PM",
    journeyWord: "GROW",
    trainer:
      "Zaiwin Kassim — Chairman, Koperasi Pro Belia Inovatif Sarawak Berhad (KOBIS Berhad)",
    title: "Transformasi Digital & AI",
    titleI18n: {
      en: "Digital Transformation & AI",
      bm: "Transformasi Digital & AI",
      zh: "数字化转型与人工智能",
      iban: "Transformasi Digital & AI",
    },
    theme: "Digital & AI",
    topics: [
      "AI & Transformasi Digital",
      "AI Productivity",
      "Pelan 90 Hari",
    ],
    schedule: [
      { time: "8.00–8.30", activity: "Sarapan", kind: "meal" },
      { time: "8.30–10.00", activity: "Modul 6: AI & Transformasi Digital" },
      { time: "10.00–10.15", activity: "Minum Pagi", kind: "break" },
      { time: "10.15–11.15", activity: "Modul 7: AI Productivity & Pelan 90 Hari" },
      { time: "11.15–11.45", activity: "Rumusan & Penilaian" },
      { time: "11.45–12.00", activity: "Majlis Penutup & Penyampaian Sijil", kind: "admin" },
    ],
  },
];

export const TRAINERS: Trainer[] = [
  {
    name: "Ts. Nizam Dato Khalid",
    role: "Lead Trainer — Day 1 & Day 2",
    roleI18n: {
      en: "Lead Trainer — Day 1 & Day 2",
      bm: "Jurulatih Utama — Hari 1 & Hari 2",
      zh: "主讲导师 — 第 1 天与第 2 天",
      iban: "Pengajar Tuai — Hari 1 & Hari 2",
    },
    title: "Pengerusi Dewan Usahawan Bumiputera Sarawak Cawangan Kuching",
    initials: "NK",
    focusAreas: [
      "Contractor development",
      "Project management",
      "Tender & proposal excellence",
      "Business strategy",
      "Industry best practices",
    ],
  },
  {
    name: "Zaiwin Kassim",
    role: "Lead Trainer — Day 3",
    roleI18n: {
      en: "Lead Trainer — Day 3",
      bm: "Jurulatih Utama — Hari 3",
      zh: "主讲导师 — 第 3 天",
      iban: "Pengajar Tuai — Hari 3",
    },
    title: "Chairman, Koperasi Pro Belia Inovatif Sarawak Berhad",
    initials: "ZK",
    focusAreas: [
      "Artificial intelligence",
      "Digital transformation",
      "Business automation",
      "AI productivity",
      "Digital marketing",
      "Business innovation",
    ],
  },
];

// Resource links are configurable here (or via admin/config later).
// Leave `url` empty to show "Coming During the Programme".
export const RESOURCES: ResourceItem[] = [
  {
    id: "brochure",
    title: "Programme Brochure",
    titleI18n: { en: "Programme Brochure", bm: "Brosur Program", zh: "课程手册" },
    description: "Official VDP Frontier MARA Miri brochure.",
    icon: "doc",
  },
  {
    id: "schedule",
    title: "Programme Schedule",
    titleI18n: { en: "Programme Schedule", bm: "Jadual Program", zh: "课程日程" },
    description: "Full three-day agenda and session timings.",
    icon: "calendar",
  },
  {
    id: "handbook",
    title: "Participant Handbook",
    titleI18n: { en: "Participant Handbook", bm: "Buku Panduan Peserta", zh: "参与者手册" },
    description: "Your guide to getting the most from the programme.",
    icon: "book",
  },
  {
    id: "company-profile-template",
    title: "Company Profile Template",
    titleI18n: { en: "Company Profile Template", bm: "Templat Profil Syarikat", zh: "公司简介模板" },
    description: "A professional starting point for your corporate profile.",
    icon: "template",
  },
  {
    id: "capability-statement-template",
    title: "Capability Statement Template",
    titleI18n: { en: "Capability Statement Template", bm: "Templat Penyata Keupayaan", zh: "能力说明书模板" },
    description: "Present your strengths to clients and evaluators.",
    icon: "template",
  },
  {
    id: "tender-checklist",
    title: "Tender Checklist",
    titleI18n: { en: "Tender Checklist", bm: "Senarai Semak Tender", zh: "投标清单" },
    description: "Everything to prepare before submitting a tender.",
    icon: "check",
  },
  {
    id: "ai-prompt-pack",
    title: "AI Prompt Starter Pack",
    titleI18n: { en: "AI Prompt Starter Pack", bm: "Pek Permulaan Prom AI", zh: "AI 提示词入门包" },
    description: "Ready-to-use AI prompts for proposals and marketing.",
    icon: "spark",
  },
  {
    id: "action-plan",
    title: "90-Day Action Plan",
    titleI18n: { en: "90-Day Action Plan", bm: "Pelan Tindakan 90 Hari", zh: "90天行动计划" },
    description: "Build and track your personal business action plan.",
    icon: "target",
  },
  {
    id: "slides",
    title: "Presentation Slides",
    titleI18n: { en: "Presentation Slides", bm: "Slaid Pembentangan", zh: "演示幻灯片" },
    description: "Session slide decks shared by the trainers.",
    icon: "slides",
  },
];
