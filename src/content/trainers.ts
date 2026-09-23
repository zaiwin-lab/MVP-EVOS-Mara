// ─────────────────────────────────────────────────────────────
// PROGRAMME FACULTY
//
// A trainer introduction, not a résumé. Each card carries a name, what they
// lead on this programme, their designation and the areas they cover — enough
// for a participant to know who is in front of them and why.
//
// Nothing here goes beyond what the supplied profiles support. No portraits
// were provided, so both cards use initials rather than an invented likeness.
// ─────────────────────────────────────────────────────────────

import type { Localized } from "../context/I18nContext";

export interface Trainer {
  /** Stable key for React and for a photo filename, should one arrive. */
  id: string;
  name: string;
  /** Shown in the identity header, under the name. */
  role: Localized;
  /** Two or three lines: title, then organisation. */
  designation: string[];
  profile: Localized;
  focusAreas: Localized[];
  /** Path under public/ once an approved portrait exists. Empty = initials. */
  photo: string;
  /** Fallback monogram. */
  initials: string;
}

export const TRAINERS: Trainer[] = [
  {
    id: "zaiwin",
    name: "Ahmad Zaiwin bin Mohd Kassim",
    role: {
      bm: "Jurulatih Utama · Transformasi Digital & AI",
      en: "Lead Trainer · Digital & AI Transformation",
      zh: "首席讲师 · 数字与 AI 转型",
      iban: "Pengajar Utama · Transformasi Digital & AI",
    },
    designation: ["Chairman, KOBIS Berhad", "Koperasi Pro Belia Inovatif Sarawak Berhad"],
    profile: {
      bm: "Membawa rangka strategik program ini — transformasi digital, penerapan AI secara praktikal, dan bagaimana koperasi boleh bermula dengan satu bidang kerja yang relevan sebelum berkembang lebih jauh.",
      en: "Leads the programme's strategic framing on digital transformation, practical AI adoption and how co-operatives can begin with one relevant work area before expanding further.",
      zh: "负责本课程的策略框架：数字转型、务实的 AI 导入，以及合作社如何先从一个相关的工作领域起步，再逐步扩展。",
      iban: "Mai rangka strategik program tu — transformasi digital, ngena AI enggau chara praktikal, enggau baka ni koperasi ulih berengkah ari siti bidang pengawa ti ngena sebedau nambah agi.",
    },
    focusAreas: [
      { bm: "Transformasi Digital & AI", en: "Digital & AI Transformation", zh: "数字与 AI 转型", iban: "Transformasi Digital & AI" },
      { bm: "AI Praktikal untuk Koperasi", en: "Practical AI for Co-operatives", zh: "合作社的实用 AI", iban: "AI Praktikal ke Koperasi" },
      { bm: "Produktiviti AI & Prompting", en: "AI Productivity & Prompting", zh: "AI 生产力与提示撰写", iban: "Produktiviti AI & Prompting" },
      { bm: "Inovasi Perniagaan & Proses", en: "Business & Process Innovation", zh: "业务与流程创新", iban: "Inovasi Pengawa & Proses" },
      { bm: "Strategi Digital", en: "Digital Strategy", zh: "数字策略", iban: "Strategi Digital" },
      { bm: "Transformasi Koperasi", en: "Co-operative Transformation", zh: "合作社转型", iban: "Transformasi Koperasi" },
    ],
    photo: "",
    initials: "AZ",
  },
  {
    id: "rosyairi",
    name: "Mohd Rosyairi bin Haji Abu Bakar",
    role: {
      bm: "Jurulatih · AI untuk Pemasaran & Penjenamaan Digital",
      en: "Trainer · AI Marketing & Digital Branding",
      zh: "讲师 · AI 营销与数字品牌",
      iban: "Pengajar · AI ke Pemasaran & Penjenamaan Digital",
    },
    designation: [
      "Digital Strategy, Marketing & Communications Practitioner",
      "Board Member & Digital Director, KOBIS Berhad",
    ],
    profile: {
      bm: "Berpengalaman dalam strategi digital, penjenamaan, perhubungan awam dan komunikasi program, dengan pengalaman langsung membangunkan inisiatif pemasaran, jangkauan dan perniagaan digital merentas program komuniti, institusi dan keusahawanan.",
      en: "Experienced in digital strategy, branding, public relations and programme communications, with hands-on experience developing marketing, outreach and digital business initiatives across community, institutional and entrepreneurial programmes.",
      zh: "在数字策略、品牌、公共关系与项目传播方面经验丰富，并实际参与社区、机构与创业项目中的营销、推广及数字业务举措。",
      iban: "Bisi pengalaman ba strategi digital, penjenamaan, perhubungan mensia mayuh enggau komunikasi program, enggau pengalaman ngaga pengawa pemasaran, jangkauan enggau bisnes digital ba program komuniti, institusi enggau keusahawanan.",
    },
    focusAreas: [
      { bm: "AI untuk Pemasaran & Kandungan", en: "AI for Marketing & Content", zh: "AI 营销与内容", iban: "AI ke Pemasaran & Kandungan" },
      { bm: "Strategi Pemasaran Digital", en: "Digital Marketing Strategy", zh: "数字营销策略", iban: "Strategi Pemasaran Digital" },
      { bm: "Penjenamaan & Komunikasi", en: "Branding & Communications", zh: "品牌与传播", iban: "Penjenamaan & Komunikasi" },
      { bm: "Media Sosial & Kandungan Kreatif", en: "Social Media & Creative Content", zh: "社交媒体与创意内容", iban: "Media Sosial & Kandungan Kreatif" },
      { bm: "Penglibatan & Jangkauan Pelanggan", en: "Customer Engagement & Outreach", zh: "客户互动与推广", iban: "Penglibatan & Jangkauan Pelanggan" },
      { bm: "Pertumbuhan & Pengkomersialan", en: "Business Growth & Commercialisation", zh: "业务增长与商业化", iban: "Pemansang & Pengkomersialan" },
    ],
    photo: "",
    initials: "MR",
  },
];
