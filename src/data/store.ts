// ─────────────────────────────────────────────────────────────
// STORAGE LAYER
// A single async interface backed by one of two adapters:
//   • LocalAdapter    — browser localStorage (default, zero setup)
//   • SupabaseAdapter  — shared Postgres backend (when env is set)
// The UI never talks to a backend directly; it calls `store`.
// ─────────────────────────────────────────────────────────────

import { eventConfig } from "../config/eventConfig";
import { supabase, supabaseEnabled } from "./supabaseClient";
import type {
  ActionPlan,
  AssessmentResult,
  AttendanceRecord,
  CompanyProfile,
  Participant,
  ParticipantRecord,
  Reflection,
} from "./types";

export interface RegistrationInput {
  fullName: string;
  mobile: string;
  email: string;
  companyName?: string;
}

export interface Store {
  mode: "local" | "supabase";
  listRecords(): Promise<ParticipantRecord[]>;
  getRecord(participantId: string): Promise<ParticipantRecord | null>;
  findByMobile(mobile: string): Promise<Participant | null>;
  /** Returns the participant if mobile + email match, else null. */
  login(mobile: string, email: string): Promise<Participant | null>;
  createParticipant(input: RegistrationInput): Promise<Participant>;
  updateParticipant(id: string, patch: Partial<Participant>): Promise<Participant | null>;
  saveProfile(profile: CompanyProfile): Promise<void>;
  saveResult(result: AssessmentResult): Promise<void>;
  saveActionPlan(plan: ActionPlan): Promise<void>;
  saveReflection(reflection: Reflection): Promise<void>;
  /** Mark attendance for a session; no-op (returns false) if already marked. */
  markAttendance(participantId: string, session: string): Promise<boolean>;
}

const now = () => new Date().toISOString();

function normalizeMobile(m: string): string {
  return m.replace(/[\s\-()]/g, "");
}

function makeRef(): string {
  return `VDP-${Math.floor(1000 + Math.random() * 9000)}`;
}

function makeId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `p_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

// ── LocalStorage adapter ─────────────────────────────────────
// The `:v2` suffix is a storage version. Bumping it starts the app from a
// clean, empty state and abandons any records written under an older key
// (e.g. earlier demo/seed data) — so the dashboard shows real entries only.
const NS = `attendify:${eventConfig.slug}:v2`;
const K = {
  participants: `${NS}:participants`,
  profiles: `${NS}:profiles`,
  results: `${NS}:results`,
  actionPlans: `${NS}:actionPlans`,
  reflections: `${NS}:reflections`,
  attendance: `${NS}:attendance`,
};

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error("Attendify: failed to write to localStorage", err);
  }
}

function assemble(
  participants: Participant[],
  profiles: CompanyProfile[],
  results: AssessmentResult[],
  actionPlans: ActionPlan[],
  reflections: Reflection[],
  attendance: AttendanceRecord[]
): ParticipantRecord[] {
  return participants
    .map((participant) => ({
      participant,
      profile: profiles.find((p) => p.participantId === participant.id),
      result: results.find((r) => r.participantId === participant.id),
      actionPlan: actionPlans.find((a) => a.participantId === participant.id),
      reflections: reflections.filter((r) => r.participantId === participant.id),
      attendance: attendance.filter((a) => a.participantId === participant.id),
    }))
    .sort(
      (a, b) =>
        new Date(b.participant.checkedInAt).getTime() -
        new Date(a.participant.checkedInAt).getTime()
    );
}

class LocalAdapter implements Store {
  mode = "local" as const;

  async listRecords(): Promise<ParticipantRecord[]> {
    return assemble(
      read<Participant[]>(K.participants, []),
      read<CompanyProfile[]>(K.profiles, []),
      read<AssessmentResult[]>(K.results, []),
      read<ActionPlan[]>(K.actionPlans, []),
      read<Reflection[]>(K.reflections, []),
      read<AttendanceRecord[]>(K.attendance, [])
    );
  }

  async getRecord(id: string): Promise<ParticipantRecord | null> {
    const all = await this.listRecords();
    return all.find((r) => r.participant.id === id) ?? null;
  }

  async findByMobile(mobile: string): Promise<Participant | null> {
    const target = normalizeMobile(mobile);
    const list = read<Participant[]>(K.participants, []);
    return list.find((p) => normalizeMobile(p.mobile) === target) ?? null;
  }

  async login(mobile: string, email: string): Promise<Participant | null> {
    const p = await this.findByMobile(mobile);
    return p && p.email.trim().toLowerCase() === email.trim().toLowerCase() ? p : null;
  }

  async createParticipant(input: RegistrationInput): Promise<Participant> {
    const list = read<Participant[]>(K.participants, []);
    const participant: Participant = {
      id: makeId(),
      ref: makeRef(),
      eventSlug: eventConfig.slug,
      fullName: input.fullName.trim(),
      mobile: input.mobile.trim(),
      email: input.email.trim(),
      companyName: input.companyName?.trim() || "",
      checkedInAt: now(),
      createdAt: now(),
      updatedAt: now(),
    };
    write(K.participants, [participant, ...list]);
    return participant;
  }

  async markAttendance(participantId: string, session: string): Promise<boolean> {
    const list = read<AttendanceRecord[]>(K.attendance, []);
    if (list.some((a) => a.participantId === participantId && a.session === session)) {
      return false; // already marked — duplicate prevented
    }
    write(K.attendance, [
      ...list,
      { participantId, session, markedAt: now() },
    ]);
    return true;
  }

  async updateParticipant(
    id: string,
    patch: Partial<Participant>
  ): Promise<Participant | null> {
    const list = read<Participant[]>(K.participants, []);
    let updated: Participant | null = null;
    const next = list.map((p) => {
      if (p.id !== id) return p;
      updated = { ...p, ...patch, updatedAt: now() };
      return updated;
    });
    write(K.participants, next);
    return updated;
  }

  async saveProfile(profile: CompanyProfile): Promise<void> {
    const list = read<CompanyProfile[]>(K.profiles, []).filter(
      (p) => p.participantId !== profile.participantId
    );
    write(K.profiles, [...list, { ...profile, updatedAt: now() }]);
    await this.updateParticipant(profile.participantId, { profileCompleted: true });
  }

  async saveResult(result: AssessmentResult): Promise<void> {
    const list = read<AssessmentResult[]>(K.results, []).filter(
      (r) => r.participantId !== result.participantId
    );
    write(K.results, [...list, result]);
    await this.updateParticipant(result.participantId, { assessmentCompleted: true });
  }

  async saveActionPlan(plan: ActionPlan): Promise<void> {
    const list = read<ActionPlan[]>(K.actionPlans, []).filter(
      (a) => a.participantId !== plan.participantId
    );
    write(K.actionPlans, [...list, plan]);
    await this.updateParticipant(plan.participantId, { actionPlanCompleted: true });
  }

  async saveReflection(reflection: Reflection): Promise<void> {
    const list = read<Reflection[]>(K.reflections, []).filter(
      (r) =>
        !(
          r.participantId === reflection.participantId &&
          r.dayNumber === reflection.dayNumber
        )
    );
    write(K.reflections, [...list, reflection]);
  }
}

// ── Supabase adapter ─────────────────────────────────────────
// Stores rich objects as jsonb `data` columns to keep mapping trivial
// and reliable. See supabase/schema.sql.
class SupabaseAdapter implements Store {
  mode = "supabase" as const;
  private db = supabase!;

  async listRecords(): Promise<ParticipantRecord[]> {
    const [participants, profiles, results, actionPlans, reflections, attendance] =
      await Promise.all([
        this.db.from("participants").select("data").eq("event_slug", eventConfig.slug),
        this.db.from("company_profiles").select("data"),
        this.db.from("assessment_results").select("data"),
        this.db.from("action_plans").select("data"),
        this.db.from("reflections").select("data"),
        this.db.from("attendance").select("data"),
      ]);
    return assemble(
      (participants.data ?? []).map((r) => r.data as Participant),
      (profiles.data ?? []).map((r) => r.data as CompanyProfile),
      (results.data ?? []).map((r) => r.data as AssessmentResult),
      (actionPlans.data ?? []).map((r) => r.data as ActionPlan),
      (reflections.data ?? []).map((r) => r.data as Reflection),
      (attendance.data ?? []).map((r) => r.data as AttendanceRecord)
    );
  }

  async getRecord(id: string): Promise<ParticipantRecord | null> {
    const all = await this.listRecords();
    return all.find((r) => r.participant.id === id) ?? null;
  }

  async findByMobile(mobile: string): Promise<Participant | null> {
    const { data } = await this.db
      .from("participants")
      .select("data")
      .eq("event_slug", eventConfig.slug)
      .eq("mobile", normalizeMobile(mobile))
      .limit(1);
    return data && data[0] ? (data[0].data as Participant) : null;
  }

  async login(mobile: string, email: string): Promise<Participant | null> {
    const p = await this.findByMobile(mobile);
    return p && p.email.trim().toLowerCase() === email.trim().toLowerCase() ? p : null;
  }

  async createParticipant(input: RegistrationInput): Promise<Participant> {
    const participant: Participant = {
      id: makeId(),
      ref: makeRef(),
      eventSlug: eventConfig.slug,
      fullName: input.fullName.trim(),
      mobile: input.mobile.trim(),
      email: input.email.trim(),
      companyName: input.companyName?.trim() || "",
      checkedInAt: now(),
      createdAt: now(),
      updatedAt: now(),
    };
    await this.db.from("participants").insert({
      id: participant.id,
      event_slug: participant.eventSlug,
      mobile: normalizeMobile(participant.mobile),
      data: participant,
    });
    return participant;
  }

  async markAttendance(participantId: string, session: string): Promise<boolean> {
    const id = `${participantId}:${session}`;
    const record: AttendanceRecord = { participantId, session, markedAt: now() };
    const { error } = await this.db
      .from("attendance")
      .insert({ id, participant_id: participantId, session, data: record });
    // Unique PK on id → a duplicate insert errors, which is our dup-prevention.
    return !error;
  }

  async updateParticipant(
    id: string,
    patch: Partial<Participant>
  ): Promise<Participant | null> {
    const { data } = await this.db
      .from("participants")
      .select("data")
      .eq("id", id)
      .limit(1);
    if (!data || !data[0]) return null;
    const updated: Participant = { ...(data[0].data as Participant), ...patch, updatedAt: now() };
    await this.db
      .from("participants")
      .update({ mobile: normalizeMobile(updated.mobile), data: updated })
      .eq("id", id);
    return updated;
  }

  async saveProfile(profile: CompanyProfile): Promise<void> {
    const payload = { ...profile, updatedAt: now() };
    await this.db
      .from("company_profiles")
      .upsert({ participant_id: profile.participantId, data: payload });
    await this.updateParticipant(profile.participantId, { profileCompleted: true });
  }

  async saveResult(result: AssessmentResult): Promise<void> {
    await this.db.from("assessment_results").upsert({
      participant_id: result.participantId,
      total_score: result.totalScore,
      data: result,
    });
    await this.updateParticipant(result.participantId, { assessmentCompleted: true });
  }

  async saveActionPlan(plan: ActionPlan): Promise<void> {
    await this.db
      .from("action_plans")
      .upsert({ participant_id: plan.participantId, data: plan });
    await this.updateParticipant(plan.participantId, { actionPlanCompleted: true });
  }

  async saveReflection(reflection: Reflection): Promise<void> {
    await this.db.from("reflections").upsert(
      {
        id: `${reflection.participantId}:${reflection.dayNumber}`,
        participant_id: reflection.participantId,
        day_number: reflection.dayNumber,
        data: reflection,
      },
      { onConflict: "id" }
    );
  }
}

export const store: Store = supabaseEnabled ? new SupabaseAdapter() : new LocalAdapter();

export const storageMode = store.mode;
