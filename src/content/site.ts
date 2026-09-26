// ─────────────────────────────────────────────────────────────
// SITE CONTENT — programme agenda, feature cards, quick access, FAQ.
//
// Every participant-facing string is a Localized object resolved through
// pick() from I18nContext, so the whole site follows the language toggle.
// BM is the source of truth; en/zh/iban are translations of it.
//
// ⚠️ IBAN NEEDS A NATIVE REVIEW before the programme runs. The Iban here
// follows the style of the strings the original build already shipped
// ("nuan", "enggau", "udah", "ngena", "peda"), but it has not been checked
// by a native speaker, and this site carries ANGKASA / KOBIS / SDEC
// branding. Where an entry is missing, pick() falls back to BM, which Iban
// speakers read — so deleting a doubtful line is always safe.
// ─────────────────────────────────────────────────────────────

import type { Localized } from "../context/I18nContext";

export interface NavItem {
  /** Fallback label (Malay) used if the key is missing from the dictionary. */
  label: string;
  to: string;
  /** Key into the i18n dictionary, so the header can be translated. */
  key: string;
}

// Main navigation.
//
// Four destinations, and the check-in CTA beside them in the header. The
// programme agenda and the FAQ moved onto the home page, and "Sumber" and the
// Google-folder card were the same idea twice, so they are now one item.
export const NAV: NavItem[] = [
  { label: "Prompt Hub", to: "/prompt-hub", key: "navPromptHub" },
  { label: "Galeri Foto", to: "/galeri", key: "navGallery" },
];

export interface Speaker {
  /** Always with the honorific, exactly as it should print. */
  name: string;
  /** Organisation or role, on the line beneath. */
  org?: string;
}

export interface AgendaItem {
  /** 1 or 2 — CEOnita runs over two days and the timeline groups by it. */
  day: 1 | 2;
  time: string;
  title: Localized;
  desc: Localized;
  /** In running order. Names are not translated. */
  speakers?: Speaker[];
  /** Optional heading above the names. No slot uses one at present. */
  speakerLabel?: Localized;
}

// The official CEOnita Strategik programme, 28–29 September 2026 at Mines
// Beach Resort, Selangor. Taken from the organiser's ATURCARA PROGRAM.
//
// No trainer is named against a session: the running order supplied does not
// assign them, and guessing would put the wrong name in front of a room.
//
// Descriptions are one line. This is a timeline read on a phone between
// sessions, not a brochure.
export const AGENDA: AgendaItem[] = [
  {
    day: 1,
    time: "08:00 – 09:00",
    title: { bm: "Pendaftaran & Minum Pagi", en: "Registration & Morning Refreshments" },
    desc: { bm: "", en: "" },
  },
  {
    day: 1,
    time: "09:00 – 09:30",
    title: { bm: "Sesi Suai Kenal & Strategic Networking", en: "Icebreaker & Strategic Networking" },
    desc: { bm: "", en: "" },
  },
  {
    day: 1,
    time: "09:30 – 10:30",
    title: { bm: "MODUL 1: Minda CEO & Leadership Gap Assessment", en: "MODULE 1: CEO Mindset & Leadership Gap Assessment" },
    desc: { bm: "Pemikiran C-Suite, analisis jurang kepimpinan dan kedudukan kepimpinan peribadi.", en: "C-Suite thinking, leadership gap analysis and personal leadership positioning." },
  },
  {
    day: 1,
    time: "10:30 – 10:45",
    title: { bm: "Minum Pagi", en: "Morning Break" },
    desc: { bm: "", en: "" },
  },
  {
    day: 1,
    time: "10:45 – 12:30",
    title: { bm: "MODUL 2: Transformasi Digital & AI", en: "MODULE 2: Digital & AI Transformation" },
    desc: { bm: "Menjadi CEO digital yang progresif — penggunaan praktikal Digital & AI dalam kepimpinan perniagaan.", en: "Becoming a progressive digital CEO — practical use of Digital & AI in business leadership." },
  },
  {
    day: 1,
    time: "12:30 – 14:00",
    title: { bm: "Makan Tengah Hari, Solat & Daftar Masuk Hotel", en: "Lunch, Prayers & Hotel Check-In" },
    desc: { bm: "", en: "" },
  },
  {
    day: 1,
    time: "14:00 – 15:45",
    title: { bm: "MODUL 3: Automasi Perniagaan & Produktiviti dengan Teknologi", en: "MODULE 3: Business Automation & Productivity Through Technology" },
    desc: { bm: "Strategic business mapping, penambahbaikan proses dan peluang automasi.", en: "Strategic business mapping, process improvement and automation opportunities." },
  },
  {
    day: 1,
    time: "15:45 – 16:00",
    title: { bm: "Minum Petang", en: "Afternoon Break" },
    desc: { bm: "", en: "" },
  },
  {
    day: 1,
    time: "16:00 – 17:00",
    title: { bm: "Strategic SWOT & Decision Making — ERIC Theory", en: "Strategic SWOT & Decision Making — ERIC Theory" },
    desc: { bm: "Analisis SWOT strategik dan keputusan perniagaan menggunakan ERIC Theory.", en: "Strategic SWOT analysis and business decision-making using ERIC Theory." },
  },
  {
    day: 1,
    time: "17:00 – 20:00",
    title: { bm: "Refleksi, Networking & Rehat", en: "Reflection, Networking & Rest" },
    desc: { bm: "", en: "" },
  },
  {
    day: 1,
    time: "20:00 – 22:00",
    title: { bm: "Analisis Makro & Business Acumen dalam Ekosistem Ekonomi MADANI", en: "Macro Analysis & Business Acumen in the MADANI Economy" },
    desc: { bm: "Analisa makro, peluang dan risiko, serta business acumen untuk pemimpin wanita.", en: "Macro analysis, opportunities and risks, and business acumen for women leaders." },
  },
  {
    day: 1,
    time: "22:00",
    title: { bm: "Tamat Hari Pertama", en: "End of Day One" },
    desc: { bm: "", en: "" },
  },
  {
    day: 2,
    time: "07:30 – 08:30",
    title: { bm: "Sarapan & Networking", en: "Breakfast & Networking" },
    desc: { bm: "", en: "" },
  },
  {
    day: 2,
    time: "08:30 – 09:00",
    title: { bm: "Morning Reflection & Leadership Activation", en: "Morning Reflection & Leadership Activation" },
    desc: { bm: "", en: "" },
  },
  {
    day: 2,
    time: "09:00 – 10:30",
    title: { bm: "Komunikasi Strategik & High-Level Negotiation", en: "Strategic Communication & High-Level Negotiation" },
    desc: { bm: "Komunikasi strategik dan kemahiran rundingan.", en: "Strategic communication and negotiation skills." },
  },
  {
    day: 2,
    time: "10:30 – 10:45",
    title: { bm: "Minum Pagi", en: "Morning Break" },
    desc: { bm: "", en: "" },
  },
  {
    day: 2,
    time: "10:45 – 12:30",
    title: { bm: "Komunikasi Strategik & High-Level Negotiation — Sambungan", en: "Strategic Communication & High-Level Negotiation — Continued" },
    desc: { bm: "High-impact presentation, pitching dan simulasi rundingan.", en: "High-impact presentation, pitching and negotiation simulation." },
  },
  {
    day: 2,
    time: "12:30 – 14:00",
    title: { bm: "Networking Lunch & Rehat", en: "Networking Lunch & Rest" },
    desc: { bm: "", en: "" },
  },
  {
    day: 2,
    time: "14:00 – 15:45",
    title: { bm: "Simulasi Boardroom & High-Stakes Decision Making", en: "Boardroom Simulation & High-Stakes Decision Making" },
    desc: { bm: "Kepimpinan boardroom, pengurusan krisis dan risiko — kajian kes dan main peranan.", en: "Boardroom leadership, crisis and risk management — case study and role play." },
  },
  {
    day: 2,
    time: "15:45 – 16:00",
    title: { bm: "Minum Petang", en: "Afternoon Break" },
    desc: { bm: "", en: "" },
  },
  {
    day: 2,
    time: "16:00 – 16:30",
    title: { bm: "Executive Action Plan", en: "Executive Action Plan" },
    desc: { bm: "Pelan tindakan kepimpinan peribadi dan roadmap strategik 90 hari.", en: "Personal leadership action plan and the 90-day strategic roadmap." },
  },
  {
    day: 2,
    time: "16:30 – 17:00",
    title: { bm: "Penyelarasan & Penutup", en: "Wrap-Up & Closing" },
    desc: { bm: "Rumusan program, refleksi peserta, survey, sesi bergambar dan penutup.", en: "Programme summary, participant reflection, survey, group photo and closing." },
  },
];

export interface Faq {
  q: Localized;
  a: Localized;
  /** Was used to pick the three shown on the home page. */
  home?: boolean;
}

// NOT CURRENTLY DISPLAYED. The FAQ page was folded into the home page, and the
// home page's short FAQ was then removed too. The answers are kept because
// they are worth keeping — put them back by rendering FAQS somewhere.

export const FAQS: Faq[] = [
  {
    home: true,
    q: {
      bm: "Di mana saya boleh dapat modul?",
      en: "Where do I get the modules?",
      zh: "我在哪里取得课程模块？",
      iban: "Dini aku ulih ngambi modul?",
    },
    a: {
      bm: "Semua slide, template dan bahan rujukan ada di halaman Modul & Sumber. Anda boleh buka dan muat turun bila-bila masa, termasuk selepas program.",
      en: "All the slides, templates and reference material are on the Modules & Resources page. You can open and download them any time, including after the programme.",
      zh: "所有简报、模板与参考资料都在「模块与资源」页面，随时可以开启与下载，课程结束后也一样。",
      iban: "Semua slide, template enggau bahan rujukan bisi ba laman Modul & Sumber. Nuan ulih muka enggau ngundoh iya kemaya-maya, termasuk udah program.",
    },
  },
  {
    q: {
      bm: "Apakah itu ProgramOS Lite?",
      en: "What is ProgramOS Lite?",
      zh: "什么是 ProgramOS Lite？",
      iban: "Nama utai ProgramOS Lite nya?",
    },
    a: {
      bm: "ProgramOS Lite ialah program pembangunan Transformasi Digital & AI untuk Koperasi — inisiatif bersama ANGKASA, KOBIS Berhad dan SDEC. Ia membantu koperasi menerap AI dalam operasi harian secara mudah dan praktikal.",
      en: "ProgramOS Lite is a Digital & AI Transformation development programme for cooperatives — a joint initiative of ANGKASA, KOBIS Berhad and SDEC. It helps cooperatives adopt AI in day-to-day operations, simply and practically.",
      zh: "ProgramOS Lite 是为合作社而设的数字与人工智能转型发展课程，由 ANGKASA、KOBIS Berhad 与 SDEC 联合推动，协助合作社以简单实用的方式在日常营运中应用 AI。",
      iban: "ProgramOS Lite nya program pemansang Transformasi Digital enggau AI ke koperasi — pengawa ti digaga enggau ANGKASA, KOBIS Berhad enggau SDEC. Iya nulung koperasi ngena AI ba pengawa tiap hari ngena chara ti mudah sereta praktikal.",
    },
  },
  {
    q: {
      bm: "Siapa yang boleh menyertai?",
      en: "Who can take part?",
      zh: "谁可以参加？",
      iban: "Sapa ulih enggau?",
    },
    a: {
      bm: "Program ini terbuka kepada koperasi terpilih. Maksimum 2 wakil setiap koperasi, dengan 30 tempat sahaja.",
      en: "The programme is open to selected cooperatives. A maximum of 2 representatives per cooperative, with only 30 places.",
      zh: "本课程开放予受邀的合作社，每家合作社最多 2 位代表，名额仅 30 位。",
      iban: "Program tu dibuka ke koperasi ti dipilih. Semampai 2 wakil tiap koperasi, enggau 30 tempat aja.",
    },
  },
  {
    home: true,
    q: {
      bm: "Adakah saya perlu mahir teknologi?",
      en: "Do I need to be tech-savvy?",
      zh: "我需要懂科技吗？",
      iban: "Kati aku enda tau pasal teknologi?",
    },
    a: {
      bm: "Tidak. Program direka untuk semua tahap. Anda hanya perlu bawa telefon pintar dan kesediaan untuk belajar.",
      en: "No. The programme is designed for all levels. Just bring a smartphone and a willingness to learn.",
      zh: "不需要。课程适合各种程度，只需带上智能手机与学习的意愿。",
      iban: "Enda. Program tu digaga ke semua tinggi. Nuan semina ngambi telefon pintar enggau ati ti deka belajar.",
    },
  },
  {
    q: {
      bm: "Adakah program ini menggunakan AI berbayar?",
      en: "Does this programme require paid AI?",
      zh: "这个课程需要付费的 AI 吗？",
      iban: "Kati program tu ngena AI ti dibayar?",
    },
    a: {
      bm: "Tidak. Sistem ini membantu anda MEMBINA prompt berkualiti. Anda kemudian salin dan gunakan dalam ChatGPT, Claude atau Gemini secara percuma.",
      en: "No. This system helps you BUILD quality prompts. You then copy them and use them in ChatGPT, Claude or Gemini for free.",
      zh: "不需要。本系统协助您「建立」高质量的提示，您再复制到 ChatGPT、Claude 或 Gemini 免费使用。",
      iban: "Enda. Sistem tu nulung nuan NGAGA prompt ti bagus. Udah nya nuan nyalin lalu ngena iya ba ChatGPT, Claude tauka Gemini enggau percuma.",
    },
  },
  {
    q: {
      bm: "Bagaimana saya daftar kehadiran?",
      en: "How do I check in?",
      zh: "我要如何签到？",
      iban: "Baka ni aku daftar kehadiran?",
    },
    a: {
      bm: "Imbas kod QR yang dipaparkan di lokasi program menggunakan telefon anda, isi maklumat ringkas, dan anda telah didaftarkan.",
      en: "Scan the QR code displayed at the venue with your phone, fill in a few short details, and you're registered.",
      zh: "用手机扫描现场展示的 QR 码，填写简短资料即可完成登记。",
      iban: "Imbas kod QR ti dipandang ba endur program ngena telefon nuan, isi maklumat ti pandak, lalu nuan udah tedaftar.",
    },
  },
  {
    q: {
      bm: "Adakah data koperasi saya selamat?",
      en: "Is my cooperative's data safe?",
      zh: "我的合作社资料安全吗？",
      iban: "Kati data koperasi aku aman?",
    },
    a: {
      bm: "Ya. Maklumat digunakan hanya untuk rekod kehadiran dan aktiviti program. Data program ini berasingan sepenuhnya daripada program lain.",
      en: "Yes. The information is used only for attendance and programme activity records. This programme's data is kept entirely separate from other programmes.",
      zh: "安全。资料仅用于出席与课程活动记录，本课程的数据与其他课程完全分开存放。",
      iban: "Aok. Maklumat semina dikena ke rekod kehadiran enggau pengawa program. Data program tu dipisah bulat ari program bukai.",
    },
  },
  {
    q: {
      bm: "Apakah AI Readiness Snapshot?",
      en: "What is the AI Readiness Snapshot?",
      zh: "什么是 AI 准备度快照？",
      iban: "Nama utai AI Readiness Snapshot nya?",
    },
    a: {
      bm: "Penilaian ringkas 5 soalan untuk menganggar tahap kesiapsiagaan AI koperasi anda. Ia panduan, bukan audit atau pensijilan formal.",
      en: "A short 5-question assessment that estimates your cooperative's AI readiness. It is a guide, not an audit or a formal certification.",
      zh: "一项 5 道题的简短评估，用以估算贵合作社的 AI 准备程度。它是指引，并非审计或正式认证。",
      iban: "Penilaian pandak 5 tanya kena ngira tinggi kesediaan AI koperasi nuan. Iya nya panduan, ukai audit tauka pensijilan formal.",
    },
  },
  {
    home: true,
    q: {
      bm: "Apa yang berlaku selepas program?",
      en: "What happens after the programme?",
      zh: "课程结束后会怎样？",
      iban: "Nama ti nyadi udah program?",
    },
    a: {
      bm: "Anda boleh terus menggunakan 60 prompt dan mengikut Perjalanan 90 Hari mengikut rentak anda sendiri — tiada KPI wajib.",
      en: "You can keep using the 60 prompts and follow the 90-Day Journey at your own pace — there is no compulsory KPI.",
      zh: "您可以继续使用这 60 个提示，并按自己的步调完成 90 天旅程——没有强制的 KPI。",
      iban: "Nuan ulih terus ngena 60 prompt nya lalu nitihka Perjalai 90 Hari nitih chara nuan empu — nadai KPI ti wajib.",
    },
  },
];

export interface Pillar {
  title: Localized;
  desc: Localized;
}

// Three institutional pillars in the footer band.
export const PILLARS: Pillar[] = [
  {
    title: { bm: "Pemimpin Lebih Yakin", en: "More Confident Leaders" },
    desc: {
      bm: "Minda CEO, kedudukan kepimpinan dan keyakinan boardroom.",
      en: "CEO mindset, leadership positioning and boardroom confidence.",
    },
  },
  {
    title: { bm: "Perniagaan Lebih Kukuh", en: "Stronger Businesses" },
    desc: {
      bm: "Business acumen, keputusan strategik dan pertumbuhan.",
      en: "Business acumen, strategic decisions and growth.",
    },
  },
  {
    title: { bm: "Ekonomi MADANI Lebih Inklusif", en: "A More Inclusive MADANI Economy" },
    desc: {
      bm: "Penyertaan wanita bernilai tinggi dan mampan.",
      en: "High-value, sustainable participation by women.",
    },
  },
];


export interface AfterMonth {
  n: number;
  /** Which of the area's ten prompts this month suggests. */
  range: string;
  title: Localized;
  focus: Localized;
}

/**
 * "Teruskan Selepas Program" — shown at the bottom of every work area.
 *
 * This is what remains of the 90-day journey page. The useful part was always
 * the pacing suggestion, not the tracking around it: no KPI, no monitoring, no
 * evidence to upload, nothing to complete.
 */
export const AFTER_MONTHS: AfterMonth[] = [
  {
    n: 1,
    range: "Prompt 1–3",
    title: { bm: "Bulan 1 — Explore", en: "Month 1 — Explore", zh: "第 1 个月 — 探索", iban: "Bulan 1 — Explore" },
    focus: {
      bm: "Kenali AI dan cuba yang asas.",
      en: "Get to know AI and try the basics.",
      zh: "认识 AI，先试试基础功能。",
      iban: "Nemu pasal AI lalu nguji utai ti asas.",
    },
  },
  {
    n: 2,
    range: "Prompt 4–7",
    title: { bm: "Bulan 2 — Apply", en: "Month 2 — Apply", zh: "第 2 个月 — 应用", iban: "Bulan 2 — Apply" },
    focus: {
      bm: "Cuba dalam tugasan harian.",
      en: "Put it to work in everyday tasks.",
      zh: "把它用在日常工作里。",
      iban: "Kena iya ba pengawa tiap hari.",
    },
  },
  {
    n: 3,
    range: "Prompt 8–10",
    title: { bm: "Bulan 3 — Improve", en: "Month 3 — Improve", zh: "第 3 个月 — 精进", iban: "Bulan 3 — Improve" },
    focus: {
      bm: "Kukuhkan kemahiran dan teroka lebih jauh.",
      en: "Strengthen your skills and go further.",
      zh: "巩固技能，走得更远。",
      iban: "Ngeringka pengelandik lalu nguji utai ti jauh agi.",
    },
  },
];
