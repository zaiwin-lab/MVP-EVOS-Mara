// ─────────────────────────────────────────────────────────────
// PROGRAMME CONTENT — VDP Frontier MARA Miri
// Sourced from the official programme brochure. Editable in one place.
// ─────────────────────────────────────────────────────────────

export interface ProgrammeDay {
  day: number;
  date: string;
  title: string;
  theme: string;
  topics: string[];
}

export interface Trainer {
  name: string;
  role: string;
  title: string;
  focusAreas: string[];
  initials: string;
}

export interface ResourceItem {
  id: string;
  title: string;
  description: string;
  url?: string; // when set, the card links out; otherwise "Coming During the Programme"
  icon: string;
}

export const PROGRAMME_DAYS: ProgrammeDay[] = [
  {
    day: 1,
    date: "14 July 2026",
    title: "Building Strong Business Foundations",
    theme: "Foundations",
    topics: [
      "Contractor mindset",
      "Industry expectations",
      "Corporate profile",
      "Capability statement",
      "Business credibility",
    ],
  },
  {
    day: 2,
    date: "15 July 2026",
    title: "Winning Business Opportunities",
    theme: "Opportunities",
    topics: [
      "Project management",
      "Tender readiness",
      "Proposal excellence",
      "Client engagement",
      "Business presentation",
    ],
  },
  {
    day: 3,
    date: "16 July 2026",
    title: "Digital Transformation and AI",
    theme: "Digital & AI",
    topics: [
      "AI for contractors",
      "Business automation",
      "AI proposal writing",
      "Digital marketing",
      "90-day business action plan",
    ],
  },
];

export const TRAINERS: Trainer[] = [
  {
    name: "Ts. Nizam Dato Khalid",
    role: "Lead Trainer — Day 1 & Day 2",
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
    description: "Official VDP Frontier MARA Miri brochure.",
    icon: "doc",
  },
  {
    id: "schedule",
    title: "Programme Schedule",
    description: "Full three-day agenda and session timings.",
    icon: "calendar",
  },
  {
    id: "handbook",
    title: "Participant Handbook",
    description: "Your guide to getting the most from the programme.",
    icon: "book",
  },
  {
    id: "company-profile-template",
    title: "Company Profile Template",
    description: "A professional starting point for your corporate profile.",
    icon: "template",
  },
  {
    id: "capability-statement-template",
    title: "Capability Statement Template",
    description: "Present your strengths to clients and evaluators.",
    icon: "template",
  },
  {
    id: "tender-checklist",
    title: "Tender Checklist",
    description: "Everything to prepare before submitting a tender.",
    icon: "check",
  },
  {
    id: "ai-prompt-pack",
    title: "AI Prompt Starter Pack",
    description: "Ready-to-use AI prompts for proposals and marketing.",
    icon: "spark",
  },
  {
    id: "action-plan",
    title: "90-Day Action Plan",
    description: "Build and track your personal business action plan.",
    icon: "target",
  },
  {
    id: "slides",
    title: "Presentation Slides",
    description: "Session slide decks shared by the trainers.",
    icon: "slides",
  },
];
