import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ADMIN_PASSWORD,
  ADMIN_USERNAME,
  eventBase,
  eventConfig,
  publicOrigin,
} from "../../config/eventConfig";
import { INDICATORS } from "../../content/assessment";
import { store, storageMode } from "../../data/store";
import type { ParticipantRecord } from "../../data/types";
import { recordsToCsv, downloadCsv } from "../../lib/csv";
import { Icon } from "../../components/Icon";
import { LogoMark } from "../../components/Brand";
import { QRCodeCard } from "../../components/QRCode";

const AUTH_KEY = "attendify:adminAuthed";

export default function AdminDashboard() {
  const [authed, setAuthed] = useState(
    () => sessionStorage.getItem(AUTH_KEY) === "1"
  );

  if (!authed) return <AdminLogin onSuccess={() => setAuthed(true)} />;
  return <Dashboard />;
}

function AdminLogin({ onSuccess }: { onSuccess: () => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (username.trim() === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      sessionStorage.setItem(AUTH_KEY, "1");
      onSuccess();
    } else {
      setError(true);
    }
  }

  return (
    <div className="flex min-h-dvh items-center justify-center bg-navy-950 px-5">
      <form onSubmit={submit} className="w-full max-w-sm rounded-2xl bg-white p-7 shadow-lift">
        <div className="flex flex-col items-center text-center">
          <LogoMark className="h-12 w-12" />
          <h1 className="mt-4 font-display text-xl font-extrabold text-navy-900">
            Administrator Access
          </h1>
          <p className="mt-1 text-sm text-navy-500">
            {eventConfig.eventName} · Event Dashboard
          </p>
        </div>
        <div className="mt-6 space-y-4">
          <div>
            <label className="field-label">Username</label>
            <input
              className="field-input"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setError(false);
              }}
              placeholder="admin"
              autoFocus
              autoCapitalize="none"
            />
          </div>
          <div>
            <label className="field-label">Password</label>
            <input
              type="password"
              className="field-input"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(false);
              }}
              placeholder="Enter admin password"
            />
          </div>
          {error && (
            <p className="text-sm font-semibold text-red-600">
              Incorrect username or password. Please try again.
            </p>
          )}
        </div>
        <button type="submit" className="btn-primary mt-5 w-full">
          <Icon name="lock" className="h-4 w-4" />
          Sign In
        </button>
        <Link
          to="/"
          className="mt-4 block text-center text-sm font-semibold text-navy-500 hover:text-navy-800"
        >
          ← Back to home
        </Link>
      </form>
    </div>
  );
}

function Dashboard() {
  const navigate = useNavigate();
  const [records, setRecords] = useState<ParticipantRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "checkedin" | "assessed" | "noProfile">("all");

  useEffect(() => {
    let alive = true;
    store.listRecords().then((r) => {
      if (alive) {
        setRecords(r);
        setLoading(false);
      }
    });
    return () => {
      alive = false;
    };
  }, []);

  const stats = useMemo(() => computeStats(records), [records]);

  const filtered = useMemo(() => {
    let list = records;
    if (filter === "checkedin") list = list.filter((r) => !r.profile);
    if (filter === "assessed") list = list.filter((r) => r.result);
    if (filter === "noProfile") list = list.filter((r) => !r.profile);
    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (r) =>
          r.participant.fullName.toLowerCase().includes(q) ||
          r.participant.companyName.toLowerCase().includes(q) ||
          r.participant.mobile.includes(q) ||
          (r.profile?.cidbGrade ?? "").toLowerCase().includes(q)
      );
    }
    return list;
  }, [records, query, filter]);

  return (
    <div className="min-h-dvh bg-sand-50">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-navy-100 bg-navy-950 text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <Link to="/" className="flex items-center gap-2.5" title="Back to home">
            <LogoMark className="h-8 w-8" />
            <div className="leading-tight">
              <div className="text-sm font-bold">Attendify™ · Admin</div>
              <div className="text-[11px] text-navy-300">{eventConfig.eventName}</div>
            </div>
          </Link>
          <div className="flex items-center gap-2">
            <span
              className={`hidden rounded-full px-2.5 py-1 text-[11px] font-semibold sm:inline ${
                storageMode === "supabase"
                  ? "bg-green-500/20 text-green-300"
                  : "bg-amber-400/20 text-amber-200"
              }`}
            >
              {storageMode === "supabase"
                ? "🟢 Shared Database Connected"
                : "🟡 On-device data"}
            </span>
            <Link
              to="/"
              className="hidden rounded-lg border border-white/20 px-3 py-2 text-sm font-semibold text-white/80 hover:bg-white/10 sm:inline-flex sm:items-center"
            >
              Home
            </Link>
            <button
              onClick={() => downloadCsv(`attendify-${eventConfig.slug}.csv`, recordsToCsv(records))}
              className="btn-gold px-3 py-2 text-sm"
            >
              <Icon name="download" className="h-4 w-4" />
              <span className="hidden sm:inline">Export CSV</span>
            </button>
            <button
              onClick={() => {
                sessionStorage.removeItem(AUTH_KEY);
                navigate("/");
              }}
              className="rounded-lg border border-white/20 px-3 py-2 text-sm font-semibold text-white/80 hover:bg-white/10"
            >
              Exit
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">
        {loading ? (
          <div className="py-20 text-center text-sm text-navy-400">Loading…</div>
        ) : (
          <>
            {/* Backend status banner */}
            <div
              className={`mb-4 flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold ${
                storageMode === "supabase"
                  ? "border-green-200 bg-green-50 text-green-800"
                  : "border-amber-200 bg-amber-50 text-amber-800"
              }`}
            >
              {storageMode === "supabase" ? (
                <>🟢 Shared Database Connected — all devices share one live database.</>
              ) : (
                <>🟡 On-device data — records stay on this device. Connect Supabase for a shared live database.</>
              )}
            </div>

            {/* Summary cards */}
            <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              <StatCard label="Participants" value={stats.total} icon="users" accent />
              <StatCard label="Attendance" value={stats.attendanceTotal} icon="checkCircle" accent />
              <StatCard label="Completed Profiles" value={stats.profiles} icon="clipboard" />
              <StatCard label="Assessments" value={stats.assessments} icon="chart" />
              <StatCard label="Action Plans" value={stats.actionPlans} icon="target" />
              <StatCard label="Avg Score" value={stats.avgScore} suffix="/100" icon="spark" accent />
            </section>

            {/* Attendance by session */}
            <section className="mt-6">
              <h2 className="section-eyebrow">Attendance by Session</h2>
              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
                {eventConfig.attendanceSessions.map((s) => (
                  <div key={s.id} className="card p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-navy-700">
                        {s.label} · {s.weekday}
                      </span>
                      <Icon name="calendar" className="h-4 w-4 text-navy-300" />
                    </div>
                    <div className="mt-1 text-2xl font-extrabold text-navy-900">
                      {stats.attendanceBySession[s.id] ?? 0}
                      <span className="text-sm font-semibold text-navy-400">
                        {" "}/ {stats.total}
                      </span>
                    </div>
                    <div className="text-[11px] text-navy-400">{s.date}</div>
                  </div>
                ))}
                {stats.customSessionIds.map((id) => (
                  <div key={id} className="card p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-navy-700">
                        {deslugifyLabel(id)}
                      </span>
                      <Icon name="qr" className="h-4 w-4 text-navy-300" />
                    </div>
                    <div className="mt-1 text-2xl font-extrabold text-navy-900">
                      {stats.attendanceBySession[id] ?? 0}
                      <span className="text-sm font-semibold text-navy-400">
                        {" "}/ {stats.total}
                      </span>
                    </div>
                    <div className="text-[11px] text-navy-400">Custom session</div>
                  </div>
                ))}
              </div>
            </section>

            {/* Attendance QR generator */}
            <QRGenerator />

            {/* Group readiness averages */}
            <section className="mt-6">
              <h2 className="section-eyebrow">Group Readiness Averages</h2>
              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
                {INDICATORS.map((ind) => {
                  const avg = stats.indicatorAverages[ind.id] ?? 0;
                  const pct = (avg / 20) * 100;
                  return (
                    <div key={ind.id} className="card p-4">
                      <div className="flex items-center gap-2">
                        <Icon name={ind.icon} className="h-4 w-4 text-navy-500" />
                        <span className="text-xs font-bold text-navy-700">{ind.titleShort}</span>
                      </div>
                      <div className="mt-2 text-2xl font-extrabold text-navy-900">
                        {avg.toFixed(1)}
                        <span className="text-sm font-semibold text-navy-400">/20</span>
                      </div>
                      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-navy-100">
                        <div className="h-full rounded-full bg-gold-400" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Insight cards */}
            <section className="mt-6">
              <h2 className="section-eyebrow">Programme Insights</h2>
              <div className="mt-3 grid grid-cols-2 gap-3 lg:grid-cols-3">
                <InsightCard label="Without a website" value={stats.noWebsite} tone="orange" />
                <InsightCard label="Profile needs improvement" value={stats.profileNeedsWork} tone="orange" />
                <InsightCard label="Need tender-readiness support" value={stats.lowTender} tone="amber" />
                <InsightCard label="Need digital-readiness support" value={stats.lowDigital} tone="amber" />
                <InsightCard label="Most common CIDB grade" value={stats.commonGrade} tone="navy" isText />
                <InsightCard label="Most common category" value={stats.commonCategory} tone="navy" isText />
              </div>
            </section>

            {/* Participant table */}
            <section className="mt-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="section-eyebrow">Participants ({filtered.length})</h2>
                <div className="flex flex-wrap items-center gap-2">
                  <div className="relative">
                    <Icon name="search" className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-300" />
                    <input
                      className="field-input py-2 pl-9 pr-3 text-sm"
                      placeholder="Search name, company, mobile…"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                    />
                  </div>
                  <select
                    className="field-input w-auto py-2 text-sm"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value as typeof filter)}
                  >
                    <option value="all">All</option>
                    <option value="assessed">Assessed</option>
                    <option value="noProfile">No profile</option>
                  </select>
                </div>
              </div>

              {/* Desktop table */}
              <div className="mt-3 hidden overflow-x-auto rounded-2xl border border-navy-100 bg-white lg:block">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-navy-100 bg-navy-50 text-left text-xs uppercase tracking-wide text-navy-500">
                      <th className="px-4 py-3">Name</th>
                      <th className="px-4 py-3">Company</th>
                      <th className="px-4 py-3">Mobile</th>
                      <th className="px-4 py-3">Att.</th>
                      <th className="px-4 py-3">CIDB</th>
                      <th className="px-4 py-3">Profile</th>
                      <th className="px-4 py-3">Score</th>
                      <th className="px-4 py-3">Category</th>
                      <th className="px-4 py-3">Plan</th>
                      <th className="px-4 py-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((r) => (
                      <tr key={r.participant.id} className="border-b border-navy-50 hover:bg-sand-50">
                        <td className="px-4 py-3 font-semibold text-navy-900">{r.participant.fullName}</td>
                        <td className="px-4 py-3 text-navy-600">{r.participant.companyName}</td>
                        <td className="px-4 py-3 text-navy-600">{r.participant.mobile}</td>
                        <td className="px-4 py-3 font-semibold text-navy-700">
                          {r.attendance.length}/{eventConfig.attendanceSessions.length}
                        </td>
                        <td className="px-4 py-3">{r.profile?.cidbGrade ?? "—"}</td>
                        <td className="px-4 py-3">
                          <StatusDot ok={Boolean(r.profile)} />
                        </td>
                        <td className="px-4 py-3 font-bold text-navy-900">
                          {r.result ? r.result.totalScore : "—"}
                        </td>
                        <td className="px-4 py-3 text-xs text-navy-500">
                          {r.result?.readinessCategory ?? "—"}
                        </td>
                        <td className="px-4 py-3">
                          <StatusDot ok={Boolean(r.actionPlan)} />
                        </td>
                        <td className="px-4 py-3">
                          <Link
                            to={`/admin/participant/${r.participant.id}`}
                            className="font-semibold text-navy-700 hover:text-gold-600"
                          >
                            View
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="mt-3 space-y-3 lg:hidden">
                {filtered.map((r) => (
                  <Link
                    key={r.participant.id}
                    to={`/admin/participant/${r.participant.id}`}
                    className="card block p-4"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="truncate font-bold text-navy-900">{r.participant.fullName}</div>
                        <div className="truncate text-xs text-navy-500">{r.participant.companyName}</div>
                      </div>
                      {r.result && (
                        <span className="chip shrink-0 bg-navy-800 text-white">
                          {r.result.totalScore}/100
                        </span>
                      )}
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2 text-[11px]">
                      <span className="chip bg-navy-50 text-navy-600">{r.participant.mobile}</span>
                      <span className="chip bg-navy-50 text-navy-600">
                        Att {r.attendance.length}/{eventConfig.attendanceSessions.length}
                      </span>
                      {r.profile?.cidbGrade && (
                        <span className="chip bg-navy-50 text-navy-600">{r.profile.cidbGrade}</span>
                      )}
                      <span className={`chip ${r.profile ? "bg-green-50 text-green-700" : "bg-orange-50 text-orange-700"}`}>
                        {r.profile ? "Profile ✓" : "No profile"}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>

              {filtered.length === 0 && (
                <div className="rounded-2xl border border-dashed border-navy-200 py-12 text-center text-sm text-navy-400">
                  No participants match your search.
                </div>
              )}
            </section>
          </>
        )}
      </main>
    </div>
  );
}

function StatCard({
  label,
  value,
  suffix,
  icon,
  accent,
}: {
  label: string;
  value: number | string;
  suffix?: string;
  icon: string;
  accent?: boolean;
}) {
  return (
    <div className={`card p-4 ${accent ? "ring-1 ring-gold-200" : ""}`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-navy-400">{label}</span>
        <Icon name={icon} className={`h-4 w-4 ${accent ? "text-gold-500" : "text-navy-300"}`} />
      </div>
      <div className="mt-1 text-2xl font-extrabold text-navy-900">
        {value}
        {suffix && <span className="text-sm font-semibold text-navy-400">{suffix}</span>}
      </div>
    </div>
  );
}

function InsightCard({
  label,
  value,
  tone,
  isText,
}: {
  label: string;
  value: number | string;
  tone: "orange" | "amber" | "navy";
  isText?: boolean;
}) {
  const tones = {
    orange: "text-orange-600",
    amber: "text-amber-600",
    navy: "text-navy-900",
  };
  return (
    <div className="card p-4">
      <div className={`font-extrabold ${isText ? "text-lg" : "text-2xl"} ${tones[tone]}`}>
        {value}
      </div>
      <div className="mt-0.5 text-xs font-medium text-navy-500">{label}</div>
    </div>
  );
}

function StatusDot({ ok }: { ok: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-semibold ${
        ok ? "text-green-600" : "text-navy-300"
      }`}
    >
      <span className={`h-2 w-2 rounded-full ${ok ? "bg-green-500" : "bg-navy-200"}`} />
      {ok ? "Yes" : "No"}
    </span>
  );
}

// ── stats computation ─────────────────────────────────────────
function computeStats(records: ParticipantRecord[]) {
  const total = records.length;
  const withResult = records.filter((r) => r.result);
  const profiles = records.filter((r) => r.profile).length;
  const assessments = withResult.length;
  const actionPlans = records.filter((r) => r.actionPlan).length;

  const attendanceBySession: Record<string, number> = {};
  for (const s of eventConfig.attendanceSessions) attendanceBySession[s.id] = 0;
  let attendanceTotal = 0;
  for (const r of records) {
    for (const a of r.attendance) {
      attendanceTotal += 1;
      attendanceBySession[a.session] = (attendanceBySession[a.session] ?? 0) + 1;
    }
  }
  // Custom sessions created via the admin QR generator (not preset days).
  const presetIds = new Set(eventConfig.attendanceSessions.map((s) => s.id));
  const customSessionIds = Object.keys(attendanceBySession).filter(
    (id) => !presetIds.has(id)
  );

  const avgScore =
    withResult.length > 0
      ? Math.round(withResult.reduce((s, r) => s + (r.result?.totalScore ?? 0), 0) / withResult.length)
      : 0;

  const indicatorAverages: Record<string, number> = {};
  for (const ind of INDICATORS) {
    if (withResult.length === 0) {
      indicatorAverages[ind.id] = 0;
      continue;
    }
    indicatorAverages[ind.id] =
      withResult.reduce((s, r) => s + (r.result?.indicatorScores[ind.id] ?? 0), 0) /
      withResult.length;
  }

  const noWebsite = records.filter(
    (r) => r.profile && !r.profile.digitalLinks.website
  ).length;
  const profileNeedsWork = records.filter(
    (r) => r.profile?.documents.companyProfile === "needs_improvement"
  ).length;
  const lowTender = withResult.filter(
    (r) => (r.result?.indicatorScores.tender ?? 20) < 12
  ).length;
  const lowDigital = withResult.filter(
    (r) => (r.result?.indicatorScores.digital ?? 20) < 12
  ).length;

  const commonGrade = mostCommon(
    records.map((r) => r.profile?.cidbGrade).filter(Boolean) as string[]
  );
  const commonCategory = mostCommon(
    records.map((r) => r.profile?.category).filter(Boolean) as string[]
  );

  return {
    total,
    profiles,
    assessments,
    actionPlans,
    avgScore,
    attendanceTotal,
    attendanceBySession,
    customSessionIds,
    indicatorAverages,
    noWebsite,
    profileNeedsWork,
    lowTender,
    lowDigital,
    commonGrade: commonGrade ?? "—",
    commonCategory: commonCategory ?? "—",
  };
}

// "Day 1 Morning" → "day-1-morning"
function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// "day-1-morning" → "Day 1 Morning"
function deslugifyLabel(id: string): string {
  return id
    .split("-")
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
    .join(" ");
}

// ── Attendance QR generator ──────────────────────────────────
// Admin types any session name → Generate → download the attendance QR.
// Scanning it records presence for that session (duplicates prevented).
function QRGenerator() {
  const origin = publicOrigin();
  const registrationUrl = `${origin}${eventBase}/register`;

  const [name, setName] = useState("");
  const [session, setSession] = useState<{ id: string; label: string } | null>(
    null
  );

  const generate = () => {
    const label = name.trim();
    const id = slugify(label);
    if (!id) return;
    setSession({ id, label });
  };

  const attendUrl = session
    ? `${origin}/attend/${session.id}?n=${encodeURIComponent(session.label)}`
    : "";

  return (
    <section className="mt-6">
      <h2 className="section-eyebrow">Attendance QR Generator</h2>
      <p className="mt-1 text-xs text-navy-400">
        Type any session name (e.g. “Day 1 Morning”, “Site Visit”, “Closing
        Ceremony”), generate the QR, and download it. Scanning records presence
        for that session; duplicate scans are ignored.
      </p>

      <div className="mt-3 grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Generator */}
        <div className="card p-5 lg:col-span-2">
          <label className="field-label">Session name</label>
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              className="field-input flex-1"
              placeholder="e.g. Day 1 Morning"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && generate()}
            />
            <button
              type="button"
              onClick={generate}
              disabled={!name.trim()}
              className="btn-primary shrink-0"
            >
              <Icon name="qr" className="h-5 w-5" />
              Generate
            </button>
          </div>

          {session ? (
            <div className="mt-4 flex justify-center">
              <QRCodeCard
                value={attendUrl}
                label={`Attendance · ${session.label}`}
                caption="Scan to record attendance"
                downloadName={`attendify-attendance-${session.id}-qr.png`}
                size={200}
              />
            </div>
          ) : (
            <p className="mt-4 text-center text-xs text-navy-400">
              Your generated QR will appear here.
            </p>
          )}
        </div>

        {/* Registration QR — always available */}
        <QRCodeCard
          value={registrationUrl}
          label="Registration"
          caption="Register & Enter Attendify"
          downloadName="attendify-registration-qr.png"
          size={190}
        />
      </div>

      {/* Quick presets for the three programme days */}
      <p className="mt-5 text-xs font-semibold text-navy-500">Quick day presets</p>
      <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {eventConfig.attendanceSessions.map((s) => (
          <QRCodeCard
            key={s.id}
            value={`${origin}/attend/${s.id}`}
            label={`Attendance · ${s.label}`}
            caption={`${s.weekday}, ${s.date}`}
            downloadName={`attendify-attendance-${s.id}-qr.png`}
            size={170}
          />
        ))}
      </div>
    </section>
  );
}

function mostCommon(items: string[]): string | null {
  if (items.length === 0) return null;
  const counts = new Map<string, number>();
  for (const i of items) counts.set(i, (counts.get(i) ?? 0) + 1);
  return [...counts.entries()].sort((a, b) => b[1] - a[1])[0][0];
}
