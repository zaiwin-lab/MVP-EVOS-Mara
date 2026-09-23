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
  { label: "Utama", to: "/", key: "home" },
  { label: "Prompt Hub", to: "/prompt-hub", key: "navPromptHub" },
  { label: "Modul & Sumber", to: "/sumber", key: "navModules" },
  { label: "Galeri Foto", to: "/galeri", key: "navGallery" },
];

export interface AgendaItem {
  time: string;
  title: Localized;
  desc: Localized;
}

// Single-day agenda (tentative). Keep it light — this is ProgramOS Lite.
export const AGENDA: AgendaItem[] = [
  {
    time: "8:30 – 9:00",
    title: {
      bm: "Pendaftaran & QR Check-In",
      en: "Registration & QR Check-In",
      zh: "报到与 QR 签到",
      iban: "Pendaftaran enggau QR Check-In",
    },
    desc: {
      bm: "Daftar masuk peserta menggunakan kod QR.",
      en: "Participants check in using the QR code.",
      zh: "参加者使用 QR 码签到。",
      iban: "Peserta daftar masuk ngena kod QR.",
    },
  },
  {
    time: "9:00 – 9:30",
    title: {
      bm: "Pembukaan & Hala Tuju",
      en: "Opening & Direction",
      zh: "开幕与方向",
      iban: "Pemuka enggau Tuju",
    },
    desc: {
      bm: "Ucapan ANGKASA, KOBIS & SDEC — mengapa AI untuk koperasi.",
      en: "Addresses from ANGKASA, KOBIS and SDEC — why AI for cooperatives.",
      zh: "ANGKASA、KOBIS 与 SDEC 致辞——合作社为何需要 AI。",
      iban: "Jaku ari ANGKASA, KOBIS enggau SDEC — nama kebuah AI kena koperasi.",
    },
  },
  {
    time: "9:30 – 10:30",
    title: {
      bm: "Penilaian Kesiapsiagaan AI",
      en: "AI Readiness Assessment",
      zh: "AI 准备度评估",
      iban: "Penilaian Kesediaan AI",
    },
    desc: {
      bm: "Jawab 5 soalan ringkas dan dapat cadangan bidang untuk bermula.",
      en: "Answer five quick questions and get a suggested area to start with.",
      zh: "回答五个简短问题，获得建议的起步领域。",
      iban: "Saut lima tanya ti pandak lalu bulih cadangan bidang kena berengkah.",
    },
  },
  {
    time: "10:30 – 12:30",
    title: {
      bm: "6 Bidang Utama Koperasi",
      en: "6 Key Cooperative Areas",
      zh: "合作社六大领域",
      iban: "6 Bidang Utama Koperasi",
    },
    desc: {
      bm: "Terokai bagaimana AI membantu setiap bidang operasi koperasi.",
      en: "Explore how AI helps each area of cooperative operations.",
      zh: "探索 AI 如何协助合作社各个营运领域。",
      iban: "Peda baka ni AI nulung tiap bidang pengawa koperasi.",
    },
  },
  {
    time: "12:30 – 2:00",
    title: {
      bm: "Rehat & Makan Tengah Hari",
      en: "Break & Lunch",
      zh: "休息与午餐",
      iban: "Belelak enggau Makai Tengah Hari",
    },
    desc: {
      bm: "Networking sesama peserta koperasi.",
      en: "Networking among cooperative participants.",
      zh: "合作社参加者之间的交流。",
      iban: "Betemu enggau peserta koperasi bukai.",
    },
  },
  {
    time: "2:00 – 3:30",
    title: {
      bm: "AI Prompt Hub — Hands-on",
      en: "AI Prompt Hub — Hands-on",
      zh: "AI 提示中心——实作",
      iban: "AI Prompt Hub — Dikereja Empu",
    },
    desc: {
      bm: "Bina prompt sebenar menggunakan Prompt Builder dan cuba dalam AI pilihan anda.",
      en: "Build real prompts with the Prompt Builder and try them in the AI of your choice.",
      zh: "使用 Prompt Builder 建立真实提示，并在您选用的 AI 中试用。",
      iban: "Ngaga prompt amat ngena Prompt Builder lalu nguji ba AI pilih nuan.",
    },
  },
  {
    time: "3:30 – 4:30",
    title: {
      bm: "Perjalanan 90 Hari",
      en: "The 90-Day Journey",
      zh: "90 天旅程",
      iban: "Perjalai 90 Hari",
    },
    desc: {
      bm: "Rangka langkah kecil untuk terus menggunakan AI selepas program.",
      en: "Map small steps to keep using AI after the programme.",
      zh: "规划小步骤，让您在课程后持续使用 AI。",
      iban: "Ngaga langkah mit kena terus ngena AI udah program.",
    },
  },
  {
    time: "4:30 – 5:00",
    title: {
      bm: "Refleksi & Penutup",
      en: "Reflection & Closing",
      zh: "反思与闭幕",
      iban: "Refleksi enggau Penutup",
    },
    desc: {
      bm: "Kongsi pembelajaran dan langkah seterusnya.",
      en: "Share what you learned and what comes next.",
      zh: "分享学习心得与下一步。",
      iban: "Berandau pasal utai ti dipelajar enggau langkah ti datai.",
    },
  },
];

export interface Faq {
  q: Localized;
  a: Localized;
  /** Shown in the short FAQ on the home page. There is no FAQ page any more,
   *  so anything without this flag is kept for reference but not displayed. */
  home?: boolean;
}

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
    title: {
      bm: "Koperasi Lebih Kukuh",
      en: "Stronger Cooperatives",
      zh: "更强大的合作社",
      iban: "Koperasi Agi Kering",
    },
    desc: {
      bm: "Melalui ilmu, teknologi dan kolaborasi.",
      en: "Through knowledge, technology and collaboration.",
      zh: "透过知识、科技与协作。",
      iban: "Ngena penemu, teknologi enggau kaul.",
    },
  },
  {
    title: {
      bm: "Masa Depan Lebih Bijak",
      en: "A Smarter Future",
      zh: "更智慧的未来",
      iban: "Jemah Ila Agi Pintar",
    },
    desc: {
      bm: "Bersama AI untuk impak sebenar.",
      en: "With AI, for real impact.",
      zh: "与 AI 同行，创造真实影响。",
      iban: "Enggau AI kena impak amat.",
    },
  },
  {
    title: {
      bm: "Masyarakat Lebih Sejahtera",
      en: "A More Prosperous Society",
      zh: "更繁荣的社会",
      iban: "Raban Bansa Agi Likun",
    },
    desc: {
      bm: "Koperasi memacu kemajuan bersama.",
      en: "Cooperatives driving progress together.",
      zh: "合作社共同推动进步。",
      iban: "Koperasi mai pemansang enggau pangan diri.",
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
