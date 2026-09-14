// ─────────────────────────────────────────────────────────────
// AI READINESS SNAPSHOT  ·  Penilaian Kesiapsiagaan AI Ringkas
// Intentionally LIGHT (spec §7): five questions, one per area,
// a simple score /100, and ONE recommended starting work area.
// This is NOT a formal audit or certification.
// ─────────────────────────────────────────────────────────────

export interface ReadinessOption {
  label: string; // BM
  labelEn: string;
  desc: string; // BM helper
  score: number; // 5 / 10 / 15 / 20
}

export interface ReadinessArea {
  id: string;
  title: string; // BM
  titleEn: string;
  radarLabel: string; // short label for the radar axis
  icon: string;
  question: string; // BM
  questionEn: string;
  options: ReadinessOption[];
  /** Work-area id recommended when THIS area is a participant's weakest. */
  recommendWorkArea: string;
}

const OPTIONS = (
  a: string, aEn: string, aDesc: string,
  b: string, bEn: string, bDesc: string,
  c: string, cEn: string, cDesc: string,
  d: string, dEn: string, dDesc: string
): ReadinessOption[] => [
  { label: a, labelEn: aEn, desc: aDesc, score: 5 },
  { label: b, labelEn: bEn, desc: bDesc, score: 10 },
  { label: c, labelEn: cEn, desc: cDesc, score: 15 },
  { label: d, labelEn: dEn, desc: dDesc, score: 20 },
];

export const READINESS_AREAS: ReadinessArea[] = [
  {
    id: "organisation",
    title: "Organisasi & Hala Tuju",
    titleEn: "Organisation & Direction",
    radarLabel: "Organisasi",
    icon: "building",
    question: "Sejauh mana koperasi anda mempunyai hala tuju dan kepimpinan yang jelas untuk menerap teknologi & AI?",
    questionEn: "How clear is your co-op's direction and leadership for adopting technology & AI?",
    options: OPTIONS(
      "Sangat terhad", "Very limited", "Belum ada hala tuju atau sokongan kepimpinan.",
      "Asas", "Basic", "Ada minat, tetapi belum dirancang secara jelas.",
      "Sederhana", "Moderate", "Kepimpinan menyokong dan ada beberapa langkah awal.",
      "Tinggi", "Advanced", "Hala tuju jelas dan kepimpinan memacu perubahan."
    ),
    recommendWorkArea: "governance",
  },
  {
    id: "data",
    title: "Data & Maklumat",
    titleEn: "Data & Information",
    radarLabel: "Data & Maklumat",
    icon: "document",
    question: "Sejauh mana maklumat koperasi (anggota, kewangan, operasi) tersusun dan mudah dicapai?",
    questionEn: "How organised and accessible is your co-op's information (members, finance, operations)?",
    options: OPTIONS(
      "Sangat terhad", "Very limited", "Kebanyakan rekod manual dan bertaburan.",
      "Asas", "Basic", "Sebahagian rekod dalam fail/Excel yang berasingan.",
      "Sederhana", "Moderate", "Rekod utama tersusun dan boleh dicapai.",
      "Tinggi", "Advanced", "Data tersusun kemas, dikemas kini dan mudah dikongsi."
    ),
    recommendWorkArea: "finance",
  },
  {
    id: "people",
    title: "Pekerja & Kemahiran",
    titleEn: "People & Skills",
    radarLabel: "Pekerja & Kemahiran",
    icon: "team",
    question: "Apakah tahap pengetahuan dan kemahiran kakitangan anda dalam menggunakan teknologi digital dan AI?",
    questionEn: "What is the level of your staff's knowledge and skills in using digital technology and AI?",
    options: OPTIONS(
      "Sangat terhad", "Very limited", "Kebanyakan kakitangan tidak biasa dengan AI atau alat digital.",
      "Asas", "Basic", "Hanya beberapa kakitangan mempunyai pengetahuan asas.",
      "Sederhana", "Moderate", "Kebanyakan boleh guna alat digital asas dan berminat belajar AI.",
      "Tinggi", "Advanced", "Kakitangan berpengalaman dan bersedia meneroka penyelesaian AI."
    ),
    recommendWorkArea: "membership",
  },
  {
    id: "process",
    title: "Proses & Operasi",
    titleEn: "Process & Operations",
    radarLabel: "Proses & Operasi",
    icon: "clipboard",
    question: "Sejauh mana proses kerja harian koperasi anda cekap dan boleh dipermudah dengan alat digital/AI?",
    questionEn: "How efficient are your daily processes, and how ready are they for digital/AI tools?",
    options: OPTIONS(
      "Sangat terhad", "Very limited", "Banyak kerja berulang dan manual.",
      "Asas", "Basic", "Ada beberapa alat digital tetapi tidak konsisten.",
      "Sederhana", "Moderate", "Proses utama agak kemas dan mula digunakan alat digital.",
      "Tinggi", "Advanced", "Proses cekap dan sedia untuk automasi/AI."
    ),
    recommendWorkArea: "operations",
  },
  {
    id: "future",
    title: "Matlamat & Masa Depan",
    titleEn: "Goals & Future Readiness",
    radarLabel: "Matlamat & Masa Depan",
    icon: "target",
    question: "Sejauh mana koperasi anda merancang pertumbuhan, hasil baharu dan inovasi untuk masa depan?",
    questionEn: "How actively does your co-op plan for growth, new revenue and innovation?",
    options: OPTIONS(
      "Sangat terhad", "Very limited", "Belum ada rancangan pertumbuhan yang jelas.",
      "Asas", "Basic", "Ada idea, tetapi belum dirangka.",
      "Sederhana", "Moderate", "Ada matlamat dan beberapa inisiatif pertumbuhan.",
      "Tinggi", "Advanced", "Rancangan pertumbuhan jelas dan inovasi aktif diterokai."
    ),
    recommendWorkArea: "business",
  },
];

export interface ReadinessBand {
  min: number;
  max: number;
  label: string; // BM
  labelEn: string;
  message: string; // BM
  tone: "veryEarly" | "basic" | "moderate" | "ready" | "veryReady";
}

export const READINESS_BANDS: ReadinessBand[] = [
  { min: 0, max: 39, label: "Sangat Awal", labelEn: "Very Early", tone: "veryEarly",
    message: "Koperasi anda baru bermula. Mulakan dengan satu langkah kecil — pilih satu bidang dan cuba satu prompt." },
  { min: 40, max: 54, label: "Asas", labelEn: "Basic", tone: "basic",
    message: "Anda sudah ada asas. Fokus pada satu bidang utama untuk membina keyakinan menggunakan AI." },
  { min: 55, max: 69, label: "Sederhana", labelEn: "Moderate", tone: "moderate",
    message: "Koperasi anda bersedia untuk bermula! Teruskan menerap AI dalam tugasan harian." },
  { min: 70, max: 84, label: "Bersedia", labelEn: "Ready", tone: "ready",
    message: "Anda berada pada kedudukan yang baik. Kembangkan penggunaan AI merentas beberapa bidang." },
  { min: 85, max: 100, label: "Sangat Bersedia", labelEn: "Very Ready", tone: "veryReady",
    message: "Koperasi anda sangat bersedia. Terokai prompt strategik dan jadikan AI sebahagian budaya kerja." },
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
