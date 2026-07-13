// ─────────────────────────────────────────────────────────────
// SEED DATA — 20 sample participants for demos & the QA checklist.
// Deterministic (fixed arrays) so screenshots are reproducible.
// Only loaded into a fresh local device; never into Supabase.
// ─────────────────────────────────────────────────────────────

import { eventConfig } from "../config/eventConfig";
import { INDICATORS } from "../content/assessment";
import { computeScore } from "../lib/scoring";
import type {
  ActionPlan,
  AssessmentResult,
  CidbGrade,
  CompanyProfile,
  Participant,
  ParticipantRecord,
  Reflection,
} from "./types";

interface Seed {
  name: string;
  company: string;
  grade: CidbGrade;
  category: string;
  district: string;
  // profile? assessment? actionPlan? — controls how far along they are
  stage: "checkedin" | "profile" | "assessed" | "complete";
  // rough answer strength 1–5 to shape their score
  strength: [number, number, number, number, number];
}

const CATEGORIES = [
  "Building works",
  "Civil engineering",
  "Roadworks",
  "Mechanical",
  "Electrical",
  "Infrastructure",
  "Maintenance",
];

const SEEDS: Seed[] = [
  { name: "Ahmad Faizal Bin Osman", company: "Faizal Bina Sdn. Bhd.", grade: "G4", category: "Building works", district: "Miri", stage: "complete", strength: [4, 3, 4, 3, 2] },
  { name: "Siti Noraini Binti Hassan", company: "Noraini Construction Sdn. Bhd.", grade: "G3", category: "Civil engineering", district: "Miri", stage: "complete", strength: [3, 3, 4, 3, 3] },
  { name: "Lim Chee Keong", company: "CK Infra Works Sdn. Bhd.", grade: "G5", category: "Infrastructure", district: "Marudi", stage: "assessed", strength: [5, 4, 4, 4, 3] },
  { name: "Mohd Ridzuan Bin Ali", company: "Ridzuan Jaya Enterprise", grade: "G2", category: "Maintenance", district: "Miri", stage: "assessed", strength: [2, 2, 3, 2, 1] },
  { name: "Norhayati Binti Ibrahim", company: "Hayati Bina Maju Sdn. Bhd.", grade: "G4", category: "Roadworks", district: "Bekenu", stage: "complete", strength: [4, 4, 4, 3, 3] },
  { name: "Gerard Anak Jugah", company: "Jugah Engineering Sdn. Bhd.", grade: "G6", category: "Civil engineering", district: "Miri", stage: "assessed", strength: [5, 5, 5, 4, 4] },
  { name: "Tan Wei Ming", company: "Weimah Electrical Sdn. Bhd.", grade: "G3", category: "Electrical", district: "Miri", stage: "profile", strength: [3, 2, 3, 3, 4] },
  { name: "Roslan Bin Abdullah", company: "Roslan Mekanikal Enterprise", grade: "G2", category: "Mechanical", district: "Lutong", stage: "assessed", strength: [2, 2, 2, 2, 2] },
  { name: "Dayang Fatimah Binti Awang", company: "Fatimah Bina Sarawak Sdn. Bhd.", grade: "G5", category: "Building works", district: "Miri", stage: "complete", strength: [4, 4, 5, 4, 3] },
  { name: "Henry Anak Belawing", company: "Belawing Infra Sdn. Bhd.", grade: "G4", category: "Infrastructure", district: "Marudi", stage: "assessed", strength: [4, 3, 4, 3, 2] },
  { name: "Zulkifli Bin Mahmud", company: "Zul Jaya Construction", grade: "G3", category: "Roadworks", district: "Miri", stage: "profile", strength: [3, 3, 3, 2, 2] },
  { name: "Chong Mei Ling", company: "Meiling Maintenance Services", grade: "G1", category: "Maintenance", district: "Miri", stage: "assessed", strength: [2, 1, 2, 2, 3] },
  { name: "Abang Suhaili Bin Openg", company: "Suhaili Bina Utama Sdn. Bhd.", grade: "G6", category: "Civil engineering", district: "Miri", stage: "complete", strength: [5, 4, 5, 5, 4] },
  { name: "Norlela Binti Salleh", company: "Lela Electrical & Supplies", grade: "G2", category: "Electrical", district: "Bekenu", stage: "checkedin", strength: [2, 2, 2, 2, 2] },
  { name: "Sylvester Anak Lawai", company: "Lawai Mekanikal Sdn. Bhd.", grade: "G4", category: "Mechanical", district: "Miri", stage: "assessed", strength: [4, 3, 4, 4, 3] },
  { name: "Mohd Hafiz Bin Zainal", company: "Hafiz Bina Prima Enterprise", grade: "G3", category: "Building works", district: "Lutong", stage: "profile", strength: [3, 3, 3, 3, 2] },
  { name: "Angela Anak Nyaring", company: "Nyaring Infra Solutions", grade: "G5", category: "Infrastructure", district: "Miri", stage: "assessed", strength: [4, 4, 4, 4, 4] },
  { name: "Ismail Bin Drahman", company: "Ismail Roadworks Sdn. Bhd.", grade: "G4", category: "Roadworks", district: "Marudi", stage: "checkedin", strength: [3, 3, 3, 3, 2] },
  { name: "Vivian Wong Sze Wei", company: "Vivian Build & Design", grade: "G2", category: "Building works", district: "Miri", stage: "assessed", strength: [3, 2, 3, 2, 4] },
  { name: "Peter Anak Sagah", company: "Sagah Civil Works Sdn. Bhd.", grade: "G3", category: "Civil engineering", district: "Miri", stage: "profile", strength: [3, 3, 4, 3, 3] },
];

const DAY_START = new Date("2026-07-14T08:30:00+08:00").getTime();

function mobileFor(i: number): string {
  return `01${(i % 9) + 1}${String(2340000 + i * 13457).slice(0, 7)}`;
}

function answersFor(strength: [number, number, number, number, number]): Record<string, number> {
  const answers: Record<string, number> = {};
  INDICATORS.forEach((ind, idx) => {
    const base = strength[idx];
    ind.questions.forEach((q, qi) => {
      // vary each answer a little around the indicator's base strength
      const v = Math.max(1, Math.min(5, base + ((qi % 3) - 1)));
      answers[q.id] = v;
    });
  });
  return answers;
}

export function seedRecords(): ParticipantRecord[] {
  return SEEDS.map((s, i) => {
    const id = `seed-${String(i + 1).padStart(2, "0")}`;
    const checkedInAt = new Date(DAY_START + i * 4 * 60 * 1000).toISOString();
    const hasProfile = s.stage !== "checkedin";
    const hasAssessment = s.stage === "assessed" || s.stage === "complete";
    const hasPlan = s.stage === "complete";

    const participant: Participant = {
      id,
      ref: `VDP-${1000 + i * 7}`,
      eventSlug: eventConfig.slug,
      fullName: s.name,
      mobile: mobileFor(i),
      email: `${s.name.split(" ")[0].toLowerCase()}@example.com`,
      position: "Managing Director",
      district: s.district,
      companyName: s.company,
      checkedInAt,
      createdAt: checkedInAt,
      updatedAt: checkedInAt,
      profileCompleted: hasProfile,
      assessmentCompleted: hasAssessment,
      actionPlanCompleted: hasPlan,
    };

    let profile: CompanyProfile | undefined;
    if (hasProfile) {
      profile = {
        participantId: id,
        registrationNumber: `SSM-${1200000 + i * 111}`,
        establishedYear: String(2005 + (i % 15)),
        cidbGrade: s.grade,
        category: s.category,
        employeeCount: String(5 + (i % 40)),
        mainServiceArea: s.district,
        experienceYears: String(3 + (i % 18)),
        completedProjects: String(4 + (i % 30)),
        capabilities: [s.category, CATEGORIES[(i + 2) % CATEGORIES.length]],
        digitalLinks:
          s.strength[4] >= 4
            ? { website: "https://example.com", whatsappBusiness: mobileFor(i) }
            : { whatsappBusiness: mobileFor(i) },
        digitalStatus: s.strength[4] >= 4 ? "available" : "planning",
        documents: { companyProfile: s.strength[0] >= 4 ? "available_updated" : "needs_improvement" },
        documentLinks: {},
        updatedAt: checkedInAt,
      };
    }

    let result: AssessmentResult | undefined;
    if (hasAssessment) {
      const answers = answersFor(s.strength);
      const breakdown = computeScore(answers);
      result = {
        participantId: id,
        totalScore: breakdown.totalScore,
        indicatorScores: breakdown.indicatorScores,
        answers,
        readinessCategory: breakdown.category.label,
        strongestIndicator: breakdown.strongest.title,
        priorityIndicator: breakdown.priority.title,
        recommendations: breakdown.recommendations,
        summary: breakdown.summary,
        completedAt: new Date(new Date(checkedInAt).getTime() + 90 * 60 * 1000).toISOString(),
      };
    }

    let actionPlan: ActionPlan | undefined;
    if (hasPlan) {
      actionPlan = {
        participantId: id,
        priority: "Strengthen digital presence and proposal readiness",
        day30Action: "Update company profile and capability statement",
        day30Date: "2026-08-13",
        day60Action: "Set up Google Business profile and a simple website",
        day60Date: "2026-09-12",
        day90Action: "Prepare and submit two tenders using new templates",
        day90Date: "2026-10-14",
        businessGoal: "Grow into larger civil projects and secure preferred-vendor status",
        commitment: true,
        submittedAt: new Date(new Date(checkedInAt).getTime() + 120 * 60 * 1000).toISOString(),
      };
    }

    const reflections: Reflection[] =
      s.stage === "complete"
        ? [
            {
              participantId: id,
              dayNumber: 1,
              responses: {
                lesson: "A professional company profile builds instant credibility.",
                improve: "Our documentation and filing system.",
                action: "Rebuild our company profile this month.",
              },
              submittedAt: checkedInAt,
            },
          ]
        : [];

    return { participant, profile, result, actionPlan, reflections };
  });
}
