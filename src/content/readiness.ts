// ─────────────────────────────────────────────────────────────
// AI READINESS SNAPSHOT  ·  Penilaian Kesiapsiagaan AI Ringkas
// Intentionally LIGHT (spec §7): five questions, one per area,
// a simple score /100, and ONE recommended starting work area.
// This is NOT a formal audit or certification.
//
// All participant-facing text is Localized and resolved via pick().
// ⚠️ Iban needs a native-speaker review — see the note in site.ts.
// ─────────────────────────────────────────────────────────────

import type { Localized } from "../context/I18nContext";

export interface ReadinessOption {
  label: Localized;
  desc: Localized;
  score: number; // 5 / 10 / 15 / 20
}

export interface ReadinessArea {
  id: string;
  title: Localized;
  radarLabel: Localized; // short label for the radar axis
  icon: string;
  question: Localized;
  options: ReadinessOption[];
  /** Work-area id recommended when THIS area is a participant's weakest. */
  recommendWorkArea: string;
}

// The four levels are the same in every area, so they are written once.
const LEVELS: Localized[] = [
  { bm: "Sangat terhad", en: "Very limited", zh: "非常有限", iban: "Chukup mimit" },
  { bm: "Asas", en: "Basic", zh: "基础", iban: "Asas" },
  { bm: "Sederhana", en: "Moderate", zh: "中等", iban: "Sederhana" },
  { bm: "Tinggi", en: "Advanced", zh: "先进", iban: "Tinggi" },
];

const OPTIONS = (
  aDesc: Localized,
  bDesc: Localized,
  cDesc: Localized,
  dDesc: Localized
): ReadinessOption[] => [
  { label: LEVELS[0], desc: aDesc, score: 5 },
  { label: LEVELS[1], desc: bDesc, score: 10 },
  { label: LEVELS[2], desc: cDesc, score: 15 },
  { label: LEVELS[3], desc: dDesc, score: 20 },
];

export const READINESS_AREAS: ReadinessArea[] = [
  {
    id: "organisation",
    icon: "building",
    recommendWorkArea: "governance",
    title: { bm: "Organisasi & Hala Tuju", en: "Organisation & Direction", zh: "组织与方向", iban: "Organisasi enggau Tuju" },
    radarLabel: { bm: "Organisasi", en: "Organisation", zh: "组织", iban: "Organisasi" },
    question: {
      bm: "Sejauh mana koperasi anda mempunyai hala tuju dan kepimpinan yang jelas untuk menerap teknologi & AI?",
      en: "How clear is your co-op's direction and leadership for adopting technology & AI?",
      zh: "贵合作社在采用科技与 AI 方面，方向与领导有多明确？",
      iban: "Berapa terang tuju enggau pemesai koperasi nuan kena ngena teknologi enggau AI?",
    },
    options: OPTIONS(
      { bm: "Belum ada hala tuju atau sokongan kepimpinan.", en: "No direction or leadership support yet.", zh: "尚无方向或领导层支持。", iban: "Apin bisi tuju tauka sukung ari pemesai." },
      { bm: "Ada minat, tetapi belum dirancang secara jelas.", en: "There is interest, but no clear plan yet.", zh: "有兴趣，但尚未明确规划。", iban: "Bisi ati, tang apin dirancang enggau terang." },
      { bm: "Kepimpinan menyokong dan ada beberapa langkah awal.", en: "Leadership is supportive and some first steps are underway.", zh: "领导层支持，并已有初步行动。", iban: "Pemesai nyukung lalu bisi sekeda langkah keterubah." },
      { bm: "Hala tuju jelas dan kepimpinan memacu perubahan.", en: "The direction is clear and leadership drives the change.", zh: "方向明确，领导层主动推动变革。", iban: "Tuju terang lalu pemesai mai penguba." }
    ),
  },
  {
    id: "data",
    icon: "document",
    recommendWorkArea: "finance",
    title: { bm: "Data & Maklumat", en: "Data & Information", zh: "数据与资讯", iban: "Data enggau Maklumat" },
    radarLabel: { bm: "Data & Maklumat", en: "Data", zh: "数据", iban: "Data" },
    question: {
      bm: "Sejauh mana maklumat koperasi (anggota, kewangan, operasi) tersusun dan mudah dicapai?",
      en: "How organised and accessible is your co-op's information (members, finance, operations)?",
      zh: "贵合作社的资料（会员、财务、营运）有多整齐且易于取用？",
      iban: "Berapa tusun sereta mudah diambi maklumat koperasi (anggota, duit, pengawa)?",
    },
    options: OPTIONS(
      { bm: "Kebanyakan rekod manual dan bertaburan.", en: "Most records are manual and scattered.", zh: "大部分记录为人手处理且分散。", iban: "Mayuh rekod digaga ngena jari lalu betaburan." },
      { bm: "Sebahagian rekod dalam fail/Excel yang berasingan.", en: "Some records sit in separate files or spreadsheets.", zh: "部分记录存放于各自的档案或试算表。", iban: "Sekeda rekod ba fail tauka Excel ti bepisah." },
      { bm: "Rekod utama tersusun dan boleh dicapai.", en: "Key records are organised and accessible.", zh: "主要记录已整理且可取用。", iban: "Rekod utama udah tusun sereta ulih diambi." },
      { bm: "Data tersusun kemas, dikemas kini dan mudah dikongsi.", en: "Data is tidy, kept current and easy to share.", zh: "数据整齐、持续更新且易于共享。", iban: "Data tusun manah, dikemas kini sereta mudah dikunsi." }
    ),
  },
  {
    id: "people",
    icon: "team",
    recommendWorkArea: "membership",
    title: { bm: "Pekerja & Kemahiran", en: "People & Skills", zh: "人员与技能", iban: "Pengawa enggau Penemu" },
    radarLabel: { bm: "Pekerja", en: "People", zh: "人员", iban: "Pengawa" },
    question: {
      bm: "Apakah tahap pengetahuan dan kemahiran kakitangan anda dalam menggunakan teknologi digital dan AI?",
      en: "What is the level of your staff's knowledge and skills in using digital technology and AI?",
      zh: "贵合作社员工在使用数字科技与 AI 方面的知识与技能处于什么水平？",
      iban: "Berapa tinggi penemu enggau pengelandik pengawa nuan ngena teknologi digital enggau AI?",
    },
    options: OPTIONS(
      { bm: "Kebanyakan kakitangan tidak biasa dengan AI atau alat digital.", en: "Most staff are unfamiliar with AI or digital tools.", zh: "大部分员工不熟悉 AI 或数码工具。", iban: "Mayuh pengawa apin biasa enggau AI tauka alat digital." },
      { bm: "Hanya beberapa kakitangan mempunyai pengetahuan asas.", en: "Only a few staff have basic knowledge.", zh: "仅少数员工具备基础知识。", iban: "Semina sekeda pengawa bisi penemu asas." },
      { bm: "Kebanyakan boleh guna alat digital asas dan berminat belajar AI.", en: "Most can use basic digital tools and are keen to learn AI.", zh: "大部分能使用基本数码工具，并有兴趣学习 AI。", iban: "Mayuh ulih ngena alat digital asas lalu bisi ati belajar AI." },
      { bm: "Kakitangan berpengalaman dan bersedia meneroka penyelesaian AI.", en: "Staff are experienced and ready to explore AI solutions.", zh: "员工经验丰富，已准备探索 AI 解决方案。", iban: "Pengawa udah bepengalaman sereta sedia nguji penyelesai AI." }
    ),
  },
  {
    id: "process",
    icon: "clipboard",
    recommendWorkArea: "operations",
    title: { bm: "Proses & Operasi", en: "Process & Operations", zh: "流程与营运", iban: "Proses enggau Pengawa" },
    radarLabel: { bm: "Proses", en: "Process", zh: "流程", iban: "Proses" },
    question: {
      bm: "Sejauh mana proses kerja harian koperasi anda cekap dan boleh dipermudah dengan alat digital/AI?",
      en: "How efficient are your daily processes, and how ready are they for digital/AI tools?",
      zh: "贵合作社的日常流程效率如何？是否适合导入数码／AI 工具？",
      iban: "Berapa lancar pengawa tiap hari koperasi nuan, lalu kati ulih dipemudah ngena alat digital tauka AI?",
    },
    options: OPTIONS(
      { bm: "Banyak kerja berulang dan manual.", en: "A lot of repetitive, manual work.", zh: "大量重复性的人手作业。", iban: "Mayuh pengawa ti diulang sereta digaga ngena jari." },
      { bm: "Ada beberapa alat digital tetapi tidak konsisten.", en: "Some digital tools are used, but not consistently.", zh: "有使用部分数码工具，但不一致。", iban: "Bisi sekeda alat digital tang enda konsisten." },
      { bm: "Proses utama agak kemas dan mula digunakan alat digital.", en: "Key processes are fairly tidy and digital tools are starting to be used.", zh: "主要流程尚算整齐，并开始使用数码工具。", iban: "Proses utama lumayan tusun lalu alat digital berengkah dikena." },
      { bm: "Proses cekap dan sedia untuk automasi/AI.", en: "Processes are efficient and ready for automation or AI.", zh: "流程高效，已可导入自动化或 AI。", iban: "Proses lancar sereta sedia ke automasi tauka AI." }
    ),
  },
  {
    id: "future",
    icon: "target",
    recommendWorkArea: "business",
    title: { bm: "Matlamat & Masa Depan", en: "Goals & Future Readiness", zh: "目标与未来准备", iban: "Tuju enggau Jemah Ila" },
    radarLabel: { bm: "Matlamat", en: "Goals", zh: "目标", iban: "Tuju" },
    question: {
      bm: "Sejauh mana koperasi anda merancang pertumbuhan, hasil baharu dan inovasi untuk masa depan?",
      en: "How actively does your co-op plan for growth, new revenue and innovation?",
      zh: "贵合作社在成长、新收入与创新方面的规划有多积极？",
      iban: "Berapa giga koperasi nuan ngatur pemansang, hasil baru enggau inovasi ke jemah ila?",
    },
    options: OPTIONS(
      { bm: "Belum ada rancangan pertumbuhan yang jelas.", en: "No clear growth plan yet.", zh: "尚无明确的成长计划。", iban: "Apin bisi rancang pemansang ti terang." },
      { bm: "Ada idea, tetapi belum dirangka.", en: "There are ideas, but nothing mapped out.", zh: "有构想，但尚未成形。", iban: "Bisi runding, tang apin digaga." },
      { bm: "Ada matlamat dan beberapa inisiatif pertumbuhan.", en: "There are goals and some growth initiatives.", zh: "已有目标与若干成长举措。", iban: "Bisi tuju enggau sekeda pengawa pemansang." },
      { bm: "Rancangan pertumbuhan jelas dan inovasi aktif diterokai.", en: "Growth plans are clear and innovation is actively explored.", zh: "成长计划明确，并积极探索创新。", iban: "Rancang pemansang terang lalu inovasi giga diuji." }
    ),
  },
];

export interface ReadinessBand {
  min: number;
  max: number;
  label: Localized;
  message: Localized;
  tone: "veryEarly" | "basic" | "moderate" | "ready" | "veryReady";
}

export const READINESS_BANDS: ReadinessBand[] = [
  {
    min: 0, max: 39, tone: "veryEarly",
    label: { bm: "Sangat Awal", en: "Very Early", zh: "非常初期", iban: "Chukup Baru" },
    message: {
      bm: "Koperasi anda baru bermula. Mulakan dengan satu langkah kecil — pilih satu bidang dan cuba satu prompt.",
      en: "Your cooperative is just starting. Begin with one small step — pick one area and try a single prompt.",
      zh: "贵合作社刚起步。从一小步开始——选一个领域，试一个提示。",
      iban: "Koperasi nuan baru berengkah. Berengkah enggau siti langkah mit — pilih siti bidang lalu uji siti prompt.",
    },
  },
  {
    min: 40, max: 54, tone: "basic",
    label: { bm: "Asas", en: "Basic", zh: "基础", iban: "Asas" },
    message: {
      bm: "Anda sudah ada asas. Fokus pada satu bidang utama untuk membina keyakinan menggunakan AI.",
      en: "You have the basics. Focus on one key area to build confidence using AI.",
      zh: "您已具备基础。专注一个主要领域，建立使用 AI 的信心。",
      iban: "Nuan udah bisi asas. Fokus ba siti bidang utama kena ngaga pengerami ngena AI.",
    },
  },
  {
    min: 55, max: 69, tone: "moderate",
    label: { bm: "Sederhana", en: "Moderate", zh: "中等", iban: "Sederhana" },
    message: {
      bm: "Koperasi anda bersedia untuk bermula! Teruskan menerap AI dalam tugasan harian.",
      en: "Your cooperative is ready to begin. Keep applying AI to everyday tasks.",
      zh: "贵合作社已准备开始！持续将 AI 应用于日常工作。",
      iban: "Koperasi nuan udah sedia berengkah! Terus ngena AI ba pengawa tiap hari.",
    },
  },
  {
    min: 70, max: 84, tone: "ready",
    label: { bm: "Bersedia", en: "Ready", zh: "已准备", iban: "Sedia" },
    message: {
      bm: "Anda berada pada kedudukan yang baik. Kembangkan penggunaan AI merentas beberapa bidang.",
      en: "You are in a good position. Extend your use of AI across several areas.",
      zh: "您的状态良好。将 AI 的应用扩展到更多领域。",
      iban: "Nuan bisi ba penatai ti manah. Kembang ngena AI merentas sekeda bidang.",
    },
  },
  {
    min: 85, max: 100, tone: "veryReady",
    label: { bm: "Sangat Bersedia", en: "Very Ready", zh: "非常就绪", iban: "Chukup Sedia" },
    message: {
      bm: "Koperasi anda sangat bersedia. Terokai prompt strategik dan jadikan AI sebahagian budaya kerja.",
      en: "Your cooperative is very ready. Explore strategic prompts and make AI part of how you work.",
      zh: "贵合作社已非常就绪。探索策略性提示，让 AI 成为工作文化的一部分。",
      iban: "Koperasi nuan chukup sedia. Uji prompt strategik lalu ngaga AI nyadi bagi ari adat pengawa.",
    },
  },
];

export const READINESS_MAX = READINESS_AREAS.length * 20; // 100

export interface ReadinessOutcome {
  score: number; // /100
  band: ReadinessBand;
  perArea: Record<string, number>; // areaId -> 0..20
  weakestAreaId: string;
  recommendWorkArea: string;
}

/** answers: areaId -> chosen option score (5/10/15/20). */
export function computeReadiness(answers: Record<string, number>): ReadinessOutcome {
  const perArea: Record<string, number> = {};
  let total = 0;
  for (const area of READINESS_AREAS) {
    const v = answers[area.id] ?? 0;
    perArea[area.id] = v;
    total += v;
  }
  // Normalise to /100 (max is already 100 with 5×20, but stay safe).
  const score = Math.round((total / READINESS_MAX) * 100);
  const band =
    READINESS_BANDS.find((b) => score >= b.min && score <= b.max) ??
    READINESS_BANDS[0];

  // Weakest area drives the single recommended starting work area.
  let weakest = READINESS_AREAS[0];
  for (const area of READINESS_AREAS) {
    if ((perArea[area.id] ?? 0) < (perArea[weakest.id] ?? 0)) weakest = area;
  }
  return {
    score,
    band,
    perArea,
    weakestAreaId: weakest.id,
    recommendWorkArea: weakest.recommendWorkArea,
  };
}
