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

export const PROGRAMME_DAYS: ProgrammeDay[] = [
  {
    day: 1,
    date: "14 July 2026",
    weekday: "Tuesday",
    timeRange: "2:00 PM – 10:00 PM",
    journeyWord: "BUILD",
    trainer: "Ts. Nizam Dato Khalid",
    title: "Building Strong Business Foundations",
    titleI18n: {
      en: "Building Strong Business Foundations",
      bm: "Membina Asas Perniagaan Yang Kukuh",
      zh: "打造稳固的业务基础",
      iban: "Ngaga Dasar Bisnis Ke Kering",
    },
    theme: "Foundations",
    topics: [
      "Contractor mindset",
      "Industry expectations",
      "Corporate profile",
      "Capability statement",
      "Business credibility",
    ],
    schedule: [
      { time: "2:00 PM", activity: "Registration & Welcome Refreshments", kind: "admin" },
      { time: "2:30 PM", activity: "Opening & Programme Overview", trainer: "Ts. Nizam Dato Khalid" },
      { time: "3:00 PM", activity: "The Contractor Mindset — Thinking Like a Business Owner", trainer: "Ts. Nizam Dato Khalid" },
      { time: "4:15 PM", activity: "Understanding Industry Expectations & Standards", trainer: "Ts. Nizam Dato Khalid" },
      { time: "5:00 PM", activity: "Refreshment Break", kind: "break" },
      { time: "5:30 PM", activity: "Building a Professional Corporate Profile", trainer: "Ts. Nizam Dato Khalid" },
      { time: "6:45 PM", activity: "Break & Maghrib", kind: "break" },
      { time: "8:00 PM", activity: "Dinner", kind: "meal" },
      { time: "8:45 PM", activity: "Crafting a Strong Capability Statement", trainer: "Ts. Nizam Dato Khalid" },
      { time: "9:30 PM", activity: "Building Business Credibility & Reputation", trainer: "Ts. Nizam Dato Khalid" },
      { time: "9:50 PM", activity: "Day 1 Reflection & Wrap-Up", kind: "session" },
      { time: "10:00 PM", activity: "End of Day 1", kind: "admin" },
    ],
  },
  {
    day: 2,
    date: "15 July 2026",
    weekday: "Wednesday",
    timeRange: "8:00 AM – 10:30 PM",
    journeyWord: "COMPETE",
    trainer: "Ts. Nizam Dato Khalid",
    title: "Winning Business Opportunities",
    titleI18n: {
      en: "Winning Business Opportunities",
      bm: "Memenangi Peluang Perniagaan",
      zh: "赢得商业机会",
      iban: "Menang Peluang Bisnis",
    },
    theme: "Opportunities",
    topics: [
      "Project management",
      "Tender readiness",
      "Proposal excellence",
      "Client engagement",
      "Business presentation",
    ],
    schedule: [
      { time: "8:00 AM", activity: "Morning Check-In & Day 1 Recap", kind: "admin" },
      { time: "8:30 AM", activity: "Project Management Essentials for Contractors", trainer: "Ts. Nizam Dato Khalid" },
      { time: "10:00 AM", activity: "Refreshment Break", kind: "break" },
      { time: "10:30 AM", activity: "Tender Readiness — Qualifying & Preparing to Bid", trainer: "Ts. Nizam Dato Khalid" },
      { time: "12:30 PM", activity: "Lunch & Zohor Break", kind: "meal" },
      { time: "2:00 PM", activity: "Proposal Excellence — Writing Winning Submissions", trainer: "Ts. Nizam Dato Khalid" },
      { time: "3:30 PM", activity: "Refreshment Break", kind: "break" },
      { time: "4:00 PM", activity: "Client Engagement & Relationship Building", trainer: "Ts. Nizam Dato Khalid" },
      { time: "5:30 PM", activity: "Break & Maghrib", kind: "break" },
      { time: "8:00 PM", activity: "Dinner", kind: "meal" },
      { time: "8:45 PM", activity: "Business Presentation Skills Workshop", trainer: "Ts. Nizam Dato Khalid" },
      { time: "9:45 PM", activity: "Group Practice & Trainer Feedback", kind: "session" },
      { time: "10:15 PM", activity: "Day 2 Reflection & Wrap-Up", kind: "session" },
      { time: "10:30 PM", activity: "End of Day 2", kind: "admin" },
    ],
  },
  {
    day: 3,
    date: "16 July 2026",
    weekday: "Thursday",
    timeRange: "8:00 AM – 12:00 PM",
    journeyWord: "GROW",
    trainer: "Zaiwin Kassim",
    title: "Digital Transformation and AI",
    titleI18n: {
      en: "Digital Transformation and AI",
      bm: "Transformasi Digital dan AI",
      zh: "数字化转型与人工智能",
      iban: "Transformasi Digital enggau AI",
    },
    theme: "Digital & AI",
    topics: [
      "AI for contractors",
      "Business automation",
      "AI proposal writing",
      "Digital marketing",
      "90-day business action plan",
    ],
    schedule: [
      { time: "8:00 AM", activity: "Morning Check-In", kind: "admin" },
      { time: "8:15 AM", activity: "AI for Contractors — Practical Foundations", trainer: "Zaiwin Kassim" },
      { time: "9:15 AM", activity: "Business Automation & Productivity Tools", trainer: "Zaiwin Kassim" },
      { time: "10:00 AM", activity: "Refreshment Break", kind: "break" },
      { time: "10:15 AM", activity: "AI-Assisted Proposal Writing (Hands-On)", trainer: "Zaiwin Kassim" },
      { time: "10:45 AM", activity: "Digital Marketing for Contractors", trainer: "Zaiwin Kassim" },
      { time: "11:15 AM", activity: "Building Your 90-Day Business Action Plan", trainer: "Zaiwin Kassim" },
      { time: "11:45 AM", activity: "Closing, Certificates & Group Photo", kind: "admin" },
      { time: "12:00 PM", activity: "End of Programme", kind: "admin" },
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
