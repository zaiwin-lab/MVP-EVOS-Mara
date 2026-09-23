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

export interface AgendaItem {
  time: string;
  title: Localized;
  desc: Localized;
  /** Who delivers it. Plain text — names are not translated. */
  speaker?: string;
}

// The official programme for 24 September 2026, 8:30am – 5:00pm at Hotel
// Serapi, Kuching. Descriptions are kept to one line: this is a timeline read
// on a phone between sessions, not a brochure.
export const AGENDA: AgendaItem[] = [
  {
    time: "08:30 – 09:00",
    title: {
      bm: "Pendaftaran & Ketibaan Peserta",
      en: "Registration & QR Check-In",
      zh: "报到与 QR 签到",
      iban: "Pendaftaran enggau QR Check-In",
    },
    desc: {
      bm: "Peserta tiba, mendaftar dan membuat QR Check-In.",
      en: "Participants arrive, register and complete QR Check-In.",
      zh: "参加者抵达、报到并完成 QR 签到。",
      iban: "Peserta datai, daftar lalu ngaga QR Check-In.",
    },
  },
  {
    time: "09:00 – 09:20",
    title: {
      bm: "Ucapan Aluan",
      en: "Opening Remarks",
      zh: "开幕致辞",
      iban: "Jaku Pemuka",
    },
    speaker: "Encik Wan Azizan bin Wan Zainal Abidin",
    desc: {
      bm: "Pengerusi ANGKASA Negeri Sarawak.",
      en: "Chairman, ANGKASA Sarawak.",
      zh: "ANGKASA 砂拉越主席。",
      iban: "Pengerusi ANGKASA Menua Sarawak.",
    },
  },
  {
    time: "09:20 – 10:30",
    title: {
      bm: "Sesi 1 — Koperasi Bersedia Menghadapi Masa Hadapan",
      en: "Session 1 — Future-Ready Co-operatives",
      zh: "第一节 — 面向未来的合作社",
      iban: "Sesi 1 — Koperasi Sedia Ngadap Maya Ila",
    },
    speaker: "Encik Ahmad Zaiwin bin Mohd Kassim",
    desc: {
      bm: "Pendigitalan, AI dan peluang dalam ekonomi digital Sarawak — dan mengapa transformasi boleh bermula dengan satu bahagian dahulu.",
      en: "Digitalisation, AI and opportunities in Sarawak's digital economy — and why transformation can begin with one practical area first.",
      zh: "数字化、AI 与砂拉越数字经济的机会——以及为何转型可以先从一个实际领域开始。",
      iban: "Pendigitalan, AI enggau peluang ba ekonomi digital Sarawak — enggau kebuah transformasi ulih berengkah ari siti bagi dulu.",
    },
  },
  {
    time: "10:30 – 10:45",
    title: { bm: "Minum Pagi", en: "Morning Break", zh: "上午茶点", iban: "Ngirup Pagi" },
    desc: { bm: "", en: "", zh: "", iban: "" },
  },
  {
    time: "10:45 – 12:15",
    title: {
      bm: "Sesi 2 — Aplikasi AI Praktikal untuk Koperasi",
      en: "Session 2 — Practical AI for Co-operatives",
      zh: "第二节 — 合作社的实用 AI",
      iban: "Sesi 2 — Aplikasi AI Praktikal ke Koperasi",
    },
    speaker: "Encik Azizul Azni",
    desc: {
      bm: "Automasi operasi, peralatan pemasaran digital dan aplikasi AI yang membantu menjana hasil — termasuk demonstrasi secara langsung.",
      en: "Practical AI tools for operations, digital marketing and revenue opportunities, including live demonstrations.",
      zh: "用于营运、数字营销与增收的实用 AI 工具，包含现场示范。",
      iban: "Automasi pengawa, peralatan pemasaran digital enggau aplikasi AI ti nulung ngasilka untung — enggau demonstrasi tekala nya.",
    },
  },
  {
    time: "12:15 – 13:15",
    title: { bm: "Makan Tengah Hari", en: "Lunch Break", zh: "午餐", iban: "Makai Tengah Hari" },
    desc: { bm: "", en: "", zh: "", iban: "" },
  },
  {
    time: "13:15 – 14:45",
    title: {
      bm: "Bengkel A — Pemilihan Satu Bahagian untuk Transformasi Digital",
      en: "Workshop A — Choose One Area for Digital Transformation",
      zh: "工作坊 A — 选定一个数字转型领域",
      iban: "Bengkel A — Milih Siti Bagi ke Transformasi Digital",
    },
    speaker: "Encik Ahmad Zaiwin bin Mohd Kassim & Encik Azizul Azni",
    desc: {
      bm: "Pemetaan proses kerja, mengenal pasti permasalahan utama dan memadankan peralatan AI dengan fungsi sebenar koperasi — keahlian, operasi, pemasaran, kewangan dan perniagaan.",
      en: "Process mapping, identifying key problems and matching suitable AI and digital tools to real co-operative work.",
      zh: "流程梳理、找出核心问题，并把合适的 AI 与数字工具对接到合作社的实际工作。",
      iban: "Memetaka proses pengawa, ngelala penanggul ti besai lalu nyamaka peralatan AI enggau pengawa koperasi ti amat.",
    },
  },
  {
    time: "14:45 – 15:00",
    title: { bm: "Minum Petang", en: "Afternoon Break", zh: "下午茶点", iban: "Ngirup Lemai" },
    desc: { bm: "", en: "", zh: "", iban: "" },
  },
  {
    time: "15:00 – 16:20",
    title: {
      bm: "Bengkel B — Klinik Pelan Tindakan AI & Portal",
      en: "Workshop B — AI Action Plan Clinic & Portal",
      zh: "工作坊 B — AI 行动方案诊所与门户",
      iban: "Bengkel B — Klinik Pelan Pengawa AI & Portal",
    },
    speaker: "Encik Azizul Azni",
    desc: {
      bm: "Peserta meneroka Prompt Hub, memilih prompt yang berkaitan dengan tugas masing-masing dan menggunakan portal sebagai toolkit praktikal.",
      en: "Participants explore the Prompt Hub, pick prompts relevant to their own work and use the portal as a practical toolkit.",
      zh: "参加者探索提示中心，挑选与自己工作相关的提示，把门户当作实用工具箱。",
      iban: "Peserta nguji Prompt Hub, milih prompt ti ngena enggau pengawa sida lalu ngena portal nya nyadi toolkit praktikal.",
    },
  },
  {
    time: "16:20 – 16:45",
    title: {
      bm: "Taklimat Hala Tuju Selepas Program",
      en: "Next-Step Briefing",
      zh: "后续方向简报",
      iban: "Taklimat Jalai Udah Program",
    },
    speaker: "Encik Ahmad Zaiwin bin Mohd Kassim",
    desc: {
      bm: "Panduan ringkas untuk terus menggunakan prompt, modul dan sumber AI selepas program, mengikut keperluan koperasi masing-masing.",
      en: "A short guide to carrying on with the prompts, modules and AI resources after the programme, as each co-operative needs.",
      zh: "课程之后如何依合作社需要继续使用提示、模块与 AI 资源的简短指引。",
      iban: "Panduan ti pandak kena terus ngena prompt, modul enggau bahan AI udah program, nitihka pengingin koperasi.",
    },
  },
  {
    time: "16:45 – 17:00",
    title: {
      bm: "Penyampaian Sijil & Penutup",
      en: "Certificate Presentation & Closing",
      zh: "颁发证书与闭幕",
      iban: "Nyerahka Sijil & Nutup",
    },
    desc: {
      bm: "Penyampaian sijil penyertaan dan penutup program.",
      en: "Presentation of participation certificates and closing.",
      zh: "颁发出席证书并为课程闭幕。",
      iban: "Nyerahka sijil penyerta lalu nutup program.",
    },
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
