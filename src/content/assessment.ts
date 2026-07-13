// ─────────────────────────────────────────────────────────────
// KBT READINESS INDEX  (internal reusable engine)
// Public label for this deployment: "Contractor Readiness Assessment"
// Template id: contractor-readiness-v1
//
// The engine is data-driven so the same components can later render
// SME / Cooperative / Digital / ESG / Startup / Vendor readiness
// templates without code changes — swap this config object.
// ─────────────────────────────────────────────────────────────

export interface AnswerOption {
  value: number; // 1–5
  label: string;
  labelLocal?: string; // Bahasa Malaysia
}

export interface Question {
  id: string;
  text: string;
  textLocal?: string;
}

export interface Indicator {
  id: string;
  index: number;
  title: string;
  titleShort: string;
  radarLabel: string; // very short label for tight radar-chart axes
  purpose: string;
  icon: string; // simple key for the icon component
  questions: Question[];
  /** Rule-based improvement actions, surfaced when this indicator is weak. */
  actions: string[];
  /** One-line strength phrase used in the personalised summary. */
  strengthPhrase: string;
  /** One-line improvement phrase used in the personalised summary. */
  improvePhrase: string;
}

export interface ResultCategory {
  min: number;
  max: number;
  label: string;
  message: string;
  tone: "foundation" | "developing" | "ready" | "competitive" | "future";
}

// Shared, consistent 5-point maturity scale (spec §10).
export const ANSWER_SCALE: AnswerOption[] = [
  { value: 1, label: "Not available", labelLocal: "Tiada lagi" },
  { value: 2, label: "Early stage", labelLocal: "Peringkat awal" },
  { value: 3, label: "Partially established", labelLocal: "Sebahagian sedia" },
  { value: 4, label: "Established", labelLocal: "Telah tersedia" },
  {
    value: 5,
    label: "Strong & consistently practised",
    labelLocal: "Kukuh & konsisten",
  },
];

export const ASSESSMENT = {
  id: "contractor-readiness-v1",
  publicLabel: "Contractor Readiness Assessment",
  engineName: "KBT Readiness Index",
  maxPerIndicator: 20,
  maxTotal: 100,
};

export const INDICATORS: Indicator[] = [
  {
    id: "foundation",
    index: 1,
    title: "Business Foundation",
    titleShort: "Business Foundation",
    radarLabel: "Foundation",
    icon: "building",
    purpose:
      "Determine whether the company has a credible and professional business foundation.",
    strengthPhrase: "a credible, well-documented business foundation",
    improvePhrase: "strengthening your core business documents and company profile",
    actions: [
      "Update your professional company profile so it clearly explains services, experience and completed projects.",
      "Organise your registration and compliance documents (SSM, CIDB, licences) in one accessible folder.",
      "Write a short, clear statement of what your company does and who it serves.",
    ],
    questions: [
      {
        id: "foundation_q1",
        text: "Is your company properly registered and compliant with the required licences and certifications (e.g. SSM, CIDB)?",
        textLocal:
          "Adakah syarikat anda berdaftar dan mematuhi lesen serta pensijilan yang diperlukan (cth. SSM, CIDB)?",
      },
      {
        id: "foundation_q2",
        text: "Does your company have a clear organisational structure that shows roles and responsibilities?",
        textLocal:
          "Adakah syarikat anda mempunyai struktur organisasi yang jelas menunjukkan peranan dan tanggungjawab?",
      },
      {
        id: "foundation_q3",
        text: "Does your company have an updated professional company profile that clearly explains your services, capabilities, experience and completed projects?",
        textLocal:
          "Adakah syarikat anda mempunyai profil syarikat profesional yang dikemas kini menerangkan perkhidmatan, keupayaan, pengalaman dan projek?",
      },
      {
        id: "foundation_q4",
        text: "Are your key business documents (profile, certificates, registration) well organised and easy to share when needed?",
        textLocal:
          "Adakah dokumen perniagaan utama anda tersusun dan mudah dikongsi apabila diperlukan?",
      },
    ],
  },
  {
    id: "tender",
    index: 2,
    title: "Tender & Commercial Readiness",
    titleShort: "Tender Readiness",
    radarLabel: "Tender",
    icon: "document",
    purpose:
      "Determine whether the company is ready to compete professionally for opportunities.",
    strengthPhrase: "strong readiness to compete for opportunities professionally",
    improvePhrase: "building your tendering, proposal and costing discipline",
    actions: [
      "Prepare a standard capability statement you can attach to any tender or quotation.",
      "Create a reusable proposal and quotation template with clear costing.",
      "Practise presenting your company's strengths in a short, confident pitch.",
    ],
    questions: [
      {
        id: "tender_q1",
        text: "Do you understand the typical requirements and documents needed to submit a tender?",
        textLocal:
          "Adakah anda memahami keperluan dan dokumen biasa yang diperlukan untuk menyertai tender?",
      },
      {
        id: "tender_q2",
        text: "Does your company have a ready capability statement that presents your strengths to clients?",
        textLocal:
          "Adakah syarikat anda mempunyai penyata keupayaan yang menyampaikan kekuatan anda kepada pelanggan?",
      },
      {
        id: "tender_q3",
        text: "Are you confident in preparing a clear, well-structured proposal and quotation?",
        textLocal:
          "Adakah anda yakin menyediakan cadangan dan sebut harga yang jelas dan tersusun?",
      },
      {
        id: "tender_q4",
        text: "Do you have a consistent way to cost and price your work so your quotations are reliable?",
        textLocal:
          "Adakah anda mempunyai cara konsisten untuk mengira kos dan harga kerja supaya sebut harga anda tepat?",
      },
    ],
  },
  {
    id: "capability",
    index: 3,
    title: "Project & People Capability",
    titleShort: "Project & People",
    radarLabel: "Project",
    icon: "team",
    purpose:
      "Assess whether the company possesses sufficient people, systems and operational capability.",
    strengthPhrase: "solid project delivery and team capability",
    improvePhrase: "growing your team competency, planning and delivery systems",
    actions: [
      "Document your team structure and the key competencies of your workforce.",
      "Adopt a simple project planning and safety/quality checklist for every job.",
      "Invest in training so your team can take on larger or more technical projects.",
    ],
    questions: [
      {
        id: "capability_q1",
        text: "Does your company have relevant project experience that demonstrates your delivery track record?",
        textLocal:
          "Adakah syarikat anda mempunyai pengalaman projek relevan yang membuktikan rekod penyampaian anda?",
      },
      {
        id: "capability_q2",
        text: "Do you have a capable technical workforce and a clear team structure with the right competencies?",
        textLocal:
          "Adakah anda mempunyai tenaga kerja teknikal yang berkebolehan dan struktur pasukan yang jelas dengan kompetensi yang betul?",
      },
      {
        id: "capability_q3",
        text: "Do you plan your projects properly and invest in training so your team can deliver reliably?",
        textLocal:
          "Adakah anda merancang projek dengan baik dan melabur dalam latihan supaya pasukan anda dapat menyampaikan dengan boleh dipercayai?",
      },
      {
        id: "capability_q4",
        text: "Does your company follow safety and quality practices on your projects?",
        textLocal:
          "Adakah syarikat anda mengamalkan amalan keselamatan dan kualiti dalam projek anda?",
      },
    ],
  },
  {
    id: "financial",
    index: 4,
    title: "Financial & Management Readiness",
    titleShort: "Financial & Mgmt",
    radarLabel: "Financial",
    icon: "chart",
    purpose:
      "Assess whether the company manages its resources professionally and sustainably.",
    strengthPhrase: "professional financial and management discipline",
    improvePhrase: "tightening your financial records, cash-flow and project costing",
    actions: [
      "Keep basic, up-to-date financial records for income, expenses and each project.",
      "Track cash-flow monthly so you always know your position before taking on work.",
      "Set a simple budget per project and monitor it against actual spending.",
    ],
    questions: [
      {
        id: "financial_q1",
        text: "Does your company keep basic financial records that are up to date and reliable?",
        textLocal:
          "Adakah syarikat anda menyimpan rekod kewangan asas yang dikemas kini dan boleh dipercayai?",
      },
      {
        id: "financial_q2",
        text: "Are you aware of your company's cash-flow and able to plan for upcoming commitments?",
        textLocal:
          "Adakah anda sedar tentang aliran tunai syarikat dan mampu merancang untuk komitmen akan datang?",
      },
      {
        id: "financial_q3",
        text: "Do you cost and budget each project, then monitor spending as the work progresses?",
        textLocal:
          "Adakah anda mengira kos dan belanjawan setiap projek, kemudian memantau perbelanjaan semasa kerja berjalan?",
      },
      {
        id: "financial_q4",
        text: "Do you have management processes that help you deliver project commitments on time?",
        textLocal:
          "Adakah anda mempunyai proses pengurusan yang membantu anda menyampaikan komitmen projek tepat pada masa?",
      },
    ],
  },
  {
    id: "digital",
    index: 5,
    title: "Digital Growth & Future Readiness",
    titleShort: "Digital & Future",
    radarLabel: "Digital",
    icon: "spark",
    purpose:
      "Assess how prepared the company is to compete in a more digital and technology-enabled industry.",
    strengthPhrase: "a forward-looking, digitally capable growth mindset",
    improvePhrase:
      "strengthening your digital presence and adopting cloud & AI-assisted tools",
    actions: [
      "Build a basic online presence — a simple website or an active Google Business profile.",
      "Move your documents to cloud storage so they are safe and easy to share.",
      "Start using AI-assisted tools to help draft proposals and business communication.",
    ],
    questions: [
      {
        id: "digital_q1",
        text: "Does your company have a website or an active digital presence (e.g. Google Business, social media)?",
        textLocal:
          "Adakah syarikat anda mempunyai laman web atau kehadiran digital yang aktif (cth. Google Business, media sosial)?",
      },
      {
        id: "digital_q2",
        text: "Do you use cloud tools and digital communication to run your business day to day?",
        textLocal:
          "Adakah anda menggunakan alat awan dan komunikasi digital untuk menjalankan perniagaan setiap hari?",
      },
      {
        id: "digital_q3",
        text: "Are you aware of, and beginning to use, AI tools to improve productivity (e.g. proposals, marketing)?",
        textLocal:
          "Adakah anda sedar dan mula menggunakan alat AI untuk meningkatkan produktiviti (cth. cadangan, pemasaran)?",
      },
      {
        id: "digital_q4",
        text: "Does your company actively plan for growth, innovation and business improvement?",
        textLocal:
          "Adakah syarikat anda merancang secara aktif untuk pertumbuhan, inovasi dan penambahbaikan perniagaan?",
      },
    ],
  },
];

export const RESULT_CATEGORIES: ResultCategory[] = [
  {
    min: 0,
    max: 39,
    label: "Foundation Stage",
    tone: "foundation",
    message:
      "Your company has several important foundations to strengthen. Focus first on essential documents, management systems, and business clarity.",
  },
  {
    min: 40,
    max: 59,
    label: "Developing Contractor",
    tone: "developing",
    message:
      "Your business has begun building important capabilities. More consistent systems and documentation will strengthen your competitiveness.",
  },
  {
    min: 60,
    max: 74,
    label: "Opportunity Ready",
    tone: "ready",
    message:
      "Your company demonstrates credible capabilities and is increasingly prepared to pursue business opportunities professionally.",
  },
  {
    min: 75,
    max: 89,
    label: "Competitive Contractor",
    tone: "competitive",
    message:
      "Your company has strong foundations and competitive readiness. Targeted improvements can elevate you towards preferred-vendor status.",
  },
  {
    min: 90,
    max: 100,
    label: "Future-Ready Contractor",
    tone: "future",
    message:
      "Your company demonstrates strong professional, operational, financial, and digital readiness for sustainable growth.",
  },
];

export const TOTAL_QUESTIONS = INDICATORS.reduce(
  (sum, ind) => sum + ind.questions.length,
  0
);
