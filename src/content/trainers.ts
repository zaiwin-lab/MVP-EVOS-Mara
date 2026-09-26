// ─────────────────────────────────────────────────────────────
// PROGRAMME FACULTY — CEOnita Strategik
//
// A trainer introduction, not a résumé. Each card carries a name, what they
// lead on this programme, their designation and the areas they cover.
//
// Nothing here goes beyond what the supplied profiles support. No portraits
// were provided, so the cards use initials rather than an invented likeness.
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
    id: "roszie",
    name: "Coach Hjh Roszie Amir",
    role: {
      bm: "Jurulatih Utama · Strategi Perniagaan & Kepimpinan",
      en: "Lead Trainer · Business Strategy & Leadership",
    },
    designation: [
      "Hajah Roszilalita binti Abdul Rahim",
      "Pakar Strategi Perniagaan · Jurulatih Industri · Mentor Usahawan",
    ],
    profile: {
      bm: "Lebih 20,000 usahawan dilatih dan lebih 2,000 pemilik perniagaan dibimbing secara rapat, dengan lebih RM15 juta pembiayaan startup dan PKS berjaya difasilitasi. National Productivity Champion Leader (Malaysia Productivity Corporation), Adjunct Associate Professor, perunding berdaftar MARA dan jurulatih bertauliah HRD Corp.",
      en: "More than 20,000 entrepreneurs trained and over 2,000 business owners closely mentored, having helped facilitate more than RM15 million in startup and SME funding. National Productivity Champion Leader (Malaysia Productivity Corporation), Adjunct Associate Professor, registered MARA consultant and HRD Corp certified trainer.",
    },
    focusAreas: [
      { bm: "Strategi Perniagaan", en: "Business Strategy" },
      { bm: "Kepimpinan", en: "Leadership" },
      { bm: "Business Model Canvas", en: "Business Model Canvas" },
      { bm: "Business Forensics", en: "Business Forensics" },
      { bm: "Penjenamaan & Pemasaran", en: "Branding & Marketing" },
      { bm: "Transformasi Digital & AI", en: "Digital Transformation & AI" },
      { bm: "Costing & Pricing", en: "Costing & Pricing" },
      { bm: "Finance for Non-Finance", en: "Finance for Non-Finance" },
      { bm: "Business Pitching & Growth", en: "Business Pitching & Growth" },
    ],
    photo: "",
    initials: "RA",
  },
  {
    id: "zuraidah",
    name: "Dato' Zuraidah Atan",
    role: {
      bm: "Tokoh Wanita · Penasihat Strategik Peringkat Lembaga",
      en: "Woman Leader · Board-Level Strategic Advisor",
    },
    designation: [
      "Corporate Leader · Board-Level Strategic Advisor",
    ],
    profile: {
      bm: "Pemimpin korporat dengan pengalaman lembaga pengarah merentas institusi utama Malaysia, termasuk Universiti Utara Malaysia, NCB Holdings Berhad, Northport Malaysia Berhad dan Kenanga Islamic Investors Berhad, serta pengalaman lembaga terdahulu bersama Bursa Malaysia, Bank Rakyat, MBSB dan Petron Malaysia. Turut dikenali atas sumbangan kepada kepimpinan sosial dan kepimpinan wanita.",
      en: "A corporate leader with board experience across major Malaysian institutions, including Universiti Utara Malaysia, NCB Holdings Berhad, Northport Malaysia Berhad and Kenanga Islamic Investors Berhad, with former board experience at Bursa Malaysia, Bank Rakyat, MBSB and Petron Malaysia. Also recognised for her contribution to social leadership and women's leadership.",
    },
    focusAreas: [
      { bm: "Sesi Bersama Tokoh", en: "Session With a Leader" },
      { bm: "Refleksi Kepimpinan", en: "Leadership Reflection" },
      { bm: "Interaksi Mentor–Mentee", en: "Mentor–Mentee Interaction" },
      { bm: "Pendedahan Kepimpinan Korporat", en: "Corporate Leadership Exposure" },
    ],
    photo: "",
    initials: "ZA",
  },
];
