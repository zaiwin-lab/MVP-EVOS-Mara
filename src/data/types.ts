// ─────────────────────────────────────────────────────────────
// DATA MODEL
// Mirrors the recommended Supabase entities but is storage-agnostic:
// the same shapes are used by the localStorage adapter and the
// Supabase adapter. All child records key off participant.id.
// ─────────────────────────────────────────────────────────────

export type CidbGrade = "G1" | "G2" | "G3" | "G4" | "G5" | "G6" | "G7";

export type DigitalStatus = "available" | "not_available" | "planning";
export type DocumentStatus =
  | "available_updated"
  | "needs_improvement"
  | "not_available";

export interface Participant {
  id: string;
  ref: string; // human-friendly confirmation reference, e.g. VDP-4821
  eventSlug: string;
  fullName: string;
  mobile: string;
  pin: string; // 4–6 digit PIN for returning login
  email?: string;
  position?: string;
  ageRange?: string;
  district?: string;
  companyName: string;
  checkedInAt: string; // registration/first-seen ISO timestamp
  createdAt: string;
  updatedAt: string;
  // completion flags derived on read, but cached for convenience
  profileCompleted?: boolean;
  assessmentCompleted?: boolean;
  actionPlanCompleted?: boolean;
}

// One attendance mark per participant per session (Day 1/2/3, …).
export interface AttendanceRecord {
  participantId: string;
  session: string; // e.g. "day-1"
  markedAt: string; // ISO timestamp
}

export interface CompanyProfile {
  participantId: string;
  registrationNumber?: string;
  establishedYear?: string;
  cidbGrade?: CidbGrade | "";
  category?: string; // primary business category
  employeeCount?: string;
  mainServiceArea?: string;
  experienceYears?: string;
  completedProjects?: string;
  capabilities: string[]; // construction capabilities
  digitalLinks: {
    website?: string;
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    tiktok?: string;
    googleBusiness?: string;
    whatsappBusiness?: string;
    corporateEmail?: string;
  };
  digitalStatus: DigitalStatus | "";
  documents: Record<string, DocumentStatus | "">;
  documentLinks: Record<string, string>;
  updatedAt: string;
}

export interface AssessmentResult {
  participantId: string;
  totalScore: number; // 0–100
  indicatorScores: Record<string, number>; // indicatorId -> 0–20
  answers: Record<string, number>; // questionId -> 1–5
  readinessCategory: string;
  strongestIndicator: string;
  priorityIndicator: string;
  recommendations: string[];
  summary: string;
  completedAt: string;
}

export interface Reflection {
  participantId: string;
  dayNumber: 1 | 2 | 3;
  responses: Record<string, string>;
  submittedAt: string;
}

export interface ActionPlan {
  participantId: string;
  priority: string;
  day30Action: string;
  day30Date: string;
  day60Action: string;
  day60Date: string;
  day90Action: string;
  day90Date: string;
  businessGoal: string;
  commitment: boolean;
  submittedAt: string;
}

// Aggregate view used by the admin dashboard
export interface ParticipantRecord {
  participant: Participant;
  profile?: CompanyProfile;
  result?: AssessmentResult;
  actionPlan?: ActionPlan;
  reflections: Reflection[];
  attendance: AttendanceRecord[];
}
