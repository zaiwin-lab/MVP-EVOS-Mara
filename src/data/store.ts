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
  PromptAttempt,
  Reflection,
} from "./types";

export interface RegistrationInput {
  fullName: string;
  mobile: string;
  email: string;
  companyName?: string;
  coopName?: string; // ANGKASA: Nama Koperasi
  role?: string; // ANGKASA: Peranan
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
  /**
   * Undo an attendance mark. Check-in is self-service, so an organiser needs
   * a way to correct someone who marked themselves present by mistake —
   * especially once the e-certificate depends on it.
   */
  clearAttendance(participantId: string, session: string): Promise<void>;
  /** Permanently remove a participant and all of their related records. */
  deleteParticipant(id: string): Promise<void>;
  /** Record that a participant used a prompt; bumps the count if repeated. */
  recordPromptAttempt(input: PromptAttemptInput): Promise<void>;
  /** Everything behind "Senarai Prompt Saya", newest use first. */
  listPromptAttempts(participantId: string): Promise<PromptAttempt[]>;
  /** Every prompt attempt for this event — admin dashboard. */
  listAllPromptAttempts(): Promise<PromptAttempt[]>;
}

export interface PromptAttemptInput {
  participantId: string;
  areaId: string;
  missionId: string;
  promptTitle: string;
  /** The generated prompt, exactly as the participant sees it. */
  promptText: string;
  /** What they typed into the builder fields. */
  inputs: Record<string, string>;
}

const now = () => new Date().toISOString();

function normalizeMobile(m: string): string {
  return m.replace(/[\s\-()]/g, "");
}

function makeRef(): string {
  return `${eventConfig.refPrefix}-${Math.floor(1000 + Math.random() * 9000)}`;
}

/** Build a fresh Participant from a registration input (shared by adapters). */
function buildParticipant(input: RegistrationInput): Participant {
  const coop = input.coopName?.trim() || input.companyName?.trim() || "";
  return {
    id: makeId(),
    ref: makeRef(),
    eventSlug: eventConfig.slug,
    fullName: input.fullName.trim(),
    mobile: input.mobile.trim(),
    email: input.email.trim(),
    companyName: coop,
    coopName: coop || undefined,
    role: input.role?.trim() || undefined,
    checkedInAt: now(),
    createdAt: now(),
    updatedAt: now(),
  };
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
  prompts: `${NS}:promptAttempts`,
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
    const participant = buildParticipant(input);
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

  async clearAttendance(participantId: string, session: string): Promise<void> {
    const list = read<AttendanceRecord[]>(K.attendance, []);
    write(
      K.attendance,
      list.filter((a) => !(a.participantId === participantId && a.session === session))
    );
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

  async recordPromptAttempt(input: PromptAttemptInput): Promise<void> {
    const list = read<PromptAttempt[]>(K.prompts, []);
    const i = list.findIndex(
      (a) => a.participantId === input.participantId && a.missionId === input.missionId
    );
    if (i >= 0) {
      list[i] = {
        ...list[i],
        promptTitle: input.promptTitle,
        promptText: input.promptText,
        inputs: input.inputs,
        attemptCount: list[i].attemptCount + 1,
        lastUsedAt: now(),
      };
    } else {
      list.push({
        ...input,
        eventSlug: eventConfig.slug,
        attemptCount: 1,
        firstUsedAt: now(),
        lastUsedAt: now(),
      });
    }
    write(K.prompts, list);
  }

  async listPromptAttempts(participantId: string): Promise<PromptAttempt[]> {
    return read<PromptAttempt[]>(K.prompts, [])
      .filter((a) => a.participantId === participantId)
      .sort((a, b) => new Date(b.lastUsedAt).getTime() - new Date(a.lastUsedAt).getTime());
  }

  async listAllPromptAttempts(): Promise<PromptAttempt[]> {
    return read<PromptAttempt[]>(K.prompts, []).sort(
      (a, b) => new Date(b.lastUsedAt).getTime() - new Date(a.lastUsedAt).getTime()
    );
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

  async deleteParticipant(id: string): Promise<void> {
    write(
      K.participants,
      read<Participant[]>(K.participants, []).filter((p) => p.id !== id)
    );
    write(
      K.profiles,
      read<CompanyProfile[]>(K.profiles, []).filter((p) => p.participantId !== id)
    );
    write(
      K.results,
      read<AssessmentResult[]>(K.results, []).filter((r) => r.participantId !== id)
    );
    write(
      K.actionPlans,
      read<ActionPlan[]>(K.actionPlans, []).filter((a) => a.participantId !== id)
    );
    write(
      K.reflections,
      read<Reflection[]>(K.reflections, []).filter((r) => r.participantId !== id)
    );
    write(
      K.attendance,
      read<AttendanceRecord[]>(K.attendance, []).filter((a) => a.participantId !== id)
    );
  }
}

// ── Supabase adapter ─────────────────────────────────────────
// Stores rich objects as jsonb `data` columns to keep mapping trivial
// and reliable. See supabase/schema.sql.
/**
 * The flat, browsable columns on `participants`.
 *
 * The row carries the participant twice: `data` is the jsonb the app reads,
 * and these columns are what a human sees when they open the table in
 * Supabase. They are written on every insert and update — an earlier version
 * only ever backfilled them by migration, so anyone registering afterwards
 * landed as a row of blanks next to a populated jsonb.
 */
function participantColumns(p: Participant) {
  return {
    mobile: normalizeMobile(p.mobile),
    ref: p.ref ?? null,
    full_name: p.fullName ?? null,
    email: p.email ?? null,
    coop_name: p.coopName ?? p.companyName ?? null,
    role: p.role ?? null,
    readiness_score: p.readinessScore ?? null,
    readiness_category: p.readinessCategory ?? null,
    selected_work_area: p.selectedWorkArea ?? null,
    checked_in_at: p.checkedInAt ?? null,
    updated_at: now(),
  };
}

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

    // supabase-js resolves with { data: null, error } rather than throwing.
    // Reading `.data ?? []` past an error turned any transient failure into
    // "this event has no records" — and ParticipantContext read that as
    // "your record was deleted" and cleared the saved session. Surface the
    // failure instead so callers can tell a broken request from an empty one.
    for (const res of [
      participants,
      profiles,
      results,
      actionPlans,
      reflections,
      attendance,
    ]) {
      if (res.error) throw res.error;
    }

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
    const participant = buildParticipant(input);
    await this.db.from("participants").insert({
      id: participant.id,
      event_slug: participant.eventSlug,
      data: participant,
      ...participantColumns(participant),
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

  async clearAttendance(participantId: string, session: string): Promise<void> {
    await this.db.from("attendance").delete().eq("id", `${participantId}:${session}`);
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
      .update({ data: updated, ...participantColumns(updated) })
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

  async deleteParticipant(id: string): Promise<void> {
    // Child tables cascade on participant delete, but remove them explicitly
    // first so the delete is clean even if a FK constraint is missing.
    await Promise.all([
      this.db.from("attendance").delete().eq("participant_id", id),
      this.db.from("reflections").delete().eq("participant_id", id),
      this.db.from("action_plans").delete().eq("participant_id", id),
      this.db.from("assessment_results").delete().eq("participant_id", id),
      this.db.from("company_profiles").delete().eq("participant_id", id),
    ]);
    await this.db.from("participants").delete().eq("id", id);
  }

  async recordPromptAttempt(input: PromptAttemptInput): Promise<void> {
    const { data: existing, error: readErr } = await this.db
      .from("prompt_attempts")
      .select("attempt_count")
      .eq("participant_id", input.participantId)
      .eq("mission_id", input.missionId)
      .maybeSingle();
    if (readErr) throw readErr;

    if (existing) {
      const { error } = await this.db
        .from("prompt_attempts")
        .update({
          attempt_count: (existing.attempt_count ?? 1) + 1,
          last_used_at: now(),
          prompt_title: input.promptTitle,
          prompt_text: input.promptText,
          inputs: input.inputs,
        })
        .eq("participant_id", input.participantId)
        .eq("mission_id", input.missionId);
      if (error) throw error;
      return;
    }

    const { error } = await this.db.from("prompt_attempts").insert({
      participant_id: input.participantId,
      event_slug: eventConfig.slug,
      area_id: input.areaId,
      mission_id: input.missionId,
      prompt_title: input.promptTitle,
      prompt_text: input.promptText,
      inputs: input.inputs,
    });
    if (error) throw error;
  }

  async listPromptAttempts(participantId: string): Promise<PromptAttempt[]> {
    const { data, error } = await this.db
      .from("prompt_attempts")
      .select("*")
      .eq("participant_id", participantId)
      .order("last_used_at", { ascending: false });
    if (error) throw error;
    return (data ?? []).map((r) => ({
      participantId: r.participant_id as string,
      eventSlug: r.event_slug as string,
      areaId: (r.area_id as string) ?? "",
      missionId: r.mission_id as string,
      promptTitle: (r.prompt_title as string) ?? "",
      promptText: (r.prompt_text as string) ?? "",
      inputs: (r.inputs as Record<string, string>) ?? {},
      attemptCount: (r.attempt_count as number) ?? 1,
      firstUsedAt: r.first_used_at as string,
      lastUsedAt: r.last_used_at as string,
    }));
  }

  async listAllPromptAttempts(): Promise<PromptAttempt[]> {
    const { data, error } = await this.db
      .from("prompt_attempts")
      .select("*")
      .eq("event_slug", eventConfig.slug)
      .order("last_used_at", { ascending: false });
    if (error) throw error;
    return (data ?? []).map((r) => ({
      participantId: r.participant_id as string,
      eventSlug: r.event_slug as string,
      areaId: (r.area_id as string) ?? "",
      missionId: r.mission_id as string,
      promptTitle: (r.prompt_title as string) ?? "",
      promptText: (r.prompt_text as string) ?? "",
      inputs: (r.inputs as Record<string, string>) ?? {},
      attemptCount: (r.attempt_count as number) ?? 1,
      firstUsedAt: r.first_used_at as string,
      lastUsedAt: r.last_used_at as string,
    }));
  }
}

export const store: Store = supabaseEnabled ? new SupabaseAdapter() : new LocalAdapter();

export const storageMode = store.mode;
