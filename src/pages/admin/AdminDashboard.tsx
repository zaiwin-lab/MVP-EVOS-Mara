import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { eventConfig, ADMIN_PASSWORD, ADMIN_PASSWORD_SET, publicOrigin } from "../../config/eventConfig";
import { store, storageMode } from "../../data/store";
import type { ParticipantRecord, PromptAttempt } from "../../data/types";
import { WORK_AREAS, getWorkArea, PROMPT_COUNT } from "../../content/promptLibrary";
import { READINESS_BANDS } from "../../content/readiness";
import { Icon } from "../../components/Icon";

const SESSION = eventConfig.attendanceSessions[0].id;
import { QRCodeCard } from "../../components/QRCode";
import { areaAccent } from "../../lib/accents";
import { pick as pickLang, type Localized } from "../../context/I18nContext";


// The admin console is Bahasa Melayu only, and the figures it shows are
// keyed by the BM wording stored in the database — so localized content is
// always resolved to BM here rather than to the visitor's chosen language.
const bm = (v: Localized) => pickLang(v, "bm");

const AUTH_KEY = "attendify:adminAuthed";

export default function AdminDashboard() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem(AUTH_KEY) === "1");
  if (!authed) return <Gate onOk={() => setAuthed(true)} />;
  return (
    <Dashboard
      onSignOut={() => {
        sessionStorage.removeItem(AUTH_KEY);
        setAuthed(false);
      }}
    />
  );
}

function Gate({ onOk }: { onOk: () => void }) {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState(false);
  const navigate = useNavigate();
  function submit() {
    // Refuse to let an empty configured passcode match an empty input.
    if (ADMIN_PASSWORD_SET && pw === ADMIN_PASSWORD) {
      sessionStorage.setItem(AUTH_KEY, "1");
      onOk();
    } else setErr(true);
  }
  return (
    <div className="flex min-h-dvh items-center justify-center bg-navy-950 px-5">
      <div className="w-full max-w-sm rounded-3xl bg-white p-7 shadow-lift">
        <div className="text-center">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-navy-900 text-gold-300"><Icon name="lock" className="h-6 w-6" /></span>
          <h1 className="mt-4 font-display text-xl font-extrabold text-navy-900">Admin ProgramOS Lite</h1>
          <p className="mt-1 text-sm text-navy-500">Masukkan kata laluan untuk teruskan.</p>
        </div>
        <input
          type="password"
          value={pw}
          onChange={(e) => { setPw(e.target.value); setErr(false); }}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder="Kata laluan"
          className="field-input mt-5"
          autoFocus
        />
        {err && <p className="mt-2 text-sm text-red-600">Kata laluan tidak betul.</p>}
        {!ADMIN_PASSWORD_SET && (
          <p className="mt-3 rounded-xl bg-amber-50 px-3 py-2 text-xs leading-relaxed text-amber-800">
            <b>VITE_ADMIN_PASSWORD belum ditetapkan.</b> Tetapkan pemboleh ubah
            persekitaran ini di Netlify dan bina semula untuk mengaktifkan admin.
          </p>
        )}
        <button
          onClick={submit}
          disabled={!ADMIN_PASSWORD_SET}
          className="btn-gold mt-4 w-full disabled:opacity-50"
        >
          Log Masuk
        </button>
        <button onClick={() => navigate("/")} className="mt-3 w-full text-center text-xs text-navy-400 underline">Kembali ke laman utama</button>
      </div>
    </div>
  );
}

function Dashboard({ onSignOut }: { onSignOut: () => void }) {
  const [records, setRecords] = useState<ParticipantRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [prompts, setPrompts] = useState<PromptAttempt[]>([]);

  const load = () => {
    setLoading(true);
    store.listRecords().then((r) => { setRecords(r); setLoading(false); });
    store
      .listAllPromptAttempts()
      .then(setPrompts)
      .catch((err) => console.warn("Could not load prompt activity", err));
  };
  useEffect(load, []);

  const stats = useMemo(() => computeStats(records), [records]);

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return records;
    return records.filter((r) => {
      const p = r.participant;
      return [p.fullName, p.coopName, p.companyName, p.mobile, p.email, p.role, p.ref]
        .filter(Boolean).some((v) => String(v).toLowerCase().includes(t));
    });
  }, [records, q]);

  /**
   * Check-in is self-service, so the organiser needs the last word on who
   * actually attended — the e-certificate is issued off this flag.
   */
  async function toggleAttendance(r: ParticipantRecord) {
    const id = r.participant.id;
    const present = r.attendance.some((a) => a.session === SESSION);
    if (present && !window.confirm(`Tandakan ${r.participant.fullName} sebagai TIDAK hadir? E-sijil mereka akan ditarik balik.`)) return;
    setBusyId(id);
    // Optimistic: the row flips immediately, then reloads from the store.
    setRecords((prev) =>
      prev.map((x) =>
        x.participant.id !== id
          ? x
          : {
              ...x,
              attendance: present
                ? x.attendance.filter((a) => a.session !== SESSION)
                : [...x.attendance, { participantId: id, session: SESSION, markedAt: new Date().toISOString() }],
            }
      )
    );
    try {
      if (present) await store.clearAttendance(id, SESSION);
      else await store.markAttendance(id, SESSION);
    } catch (e) {
      console.error(e);
      load();
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete(r: ParticipantRecord) {
    if (!window.confirm(`Padam ${r.participant.fullName} dan semua rekod berkaitan? Tindakan ini tidak boleh diundur.`)) return;
    setDeletingId(r.participant.id);
    setRecords((prev) => prev.filter((x) => x.participant.id !== r.participant.id));
    try { await store.deleteParticipant(r.participant.id); }
    catch (e) { console.error(e); load(); }
    finally { setDeletingId(null); }
  }

  // Two different jobs: one QR signs people up before the day, the other
  // marks attendance on the day for people who already have an account.
  const checkInUrl = `${publicOrigin()}/check-in`;
  const attendUrl = `${publicOrigin()}/hadir`;
  const online = storageMode === "supabase";

  return (
    <div className="min-h-dvh bg-sand-50">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-navy-950 text-white">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
          <Link to="/" className="flex h-9 w-9 items-center justify-center rounded-full text-white/70 hover:bg-white/10"><Icon name="arrowLeft" /></Link>
          <div>
            <div className="text-sm font-bold">ANGKASA Admin · ProgramOS Lite</div>
            <div className="text-[11px] text-navy-300">Gambaran keseluruhan pelaksanaan program</div>
          </div>
          <span className={`ml-auto chip ${online ? "bg-emerald-400/20 text-emerald-200" : "bg-amber-400/20 text-amber-100"}`}>
            <span className={`h-2 w-2 rounded-full ${online ? "bg-emerald-400" : "bg-amber-400"}`} />
            {online ? "Shared Database Connected" : "Local Mode"}
          </span>
          <button
            type="button"
            onClick={onSignOut}
            className="shrink-0 rounded-full border border-white/20 px-3 py-1.5 text-xs font-semibold text-white/80 hover:bg-white/10"
          >
            Log Keluar
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-6 px-4 py-6">
        {/* Backend banner */}
        <div className={`rounded-2xl border px-4 py-3 text-sm ${online ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-amber-200 bg-amber-50 text-amber-800"}`}>
          {online
            ? "🟢 Shared Database Connected — data kehadiran diselaraskan merentas semua peranti peserta."
            : "🟡 Local Mode — Supabase belum dikonfigurasikan; data disimpan pada peranti ini sahaja."}
        </div>

        {/* Room counter — the number the organiser watches on the day. */}
        <AttendanceCounter present={stats.present} target={eventConfig.expectedParticipants} registered={stats.total} />

        {/* Summary cards */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          <StatCard icon="users" label="Peserta" sub="Total Participants" value={stats.total} tone="navy" />
          <StatCard icon="building" label="Koperasi" sub="Co-operatives" value={stats.coops} tone="violet" />
          <StatCard icon="chart" label="Penilaian Selesai" sub="Readiness Completed" value={stats.readinessDone} tone="emerald" />
          <StatCard icon="target" label="Bidang Popular" sub={stats.topAreaLabel} value={stats.topAreaCount} tone="rose" isText textValue={stats.topAreaShort} />
          <StatCard icon="spark" label="Prompt Dicuba" sub="Prompt Missions Tried" value={stats.promptsTried} tone="amber" />
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Charts */}
          <div className="space-y-6 lg:col-span-2">
            <Panel title="Bidang Paling Popular" subtitle="Work Area Popularity">
              <BarList
                items={WORK_AREAS.map((a) => ({ label: bm(a.title), value: stats.areaCounts[a.id] ?? 0, accent: a.accent }))}
                max={Math.max(1, ...Object.values(stats.areaCounts))}
              />
            </Panel>

            <Panel title="Status Kesiapsiagaan AI" subtitle="Readiness Distribution">
              <BarList
                items={READINESS_BANDS.map((b) => ({ label: bm(b.label), value: stats.bandCounts[bm(b.label)] ?? 0, accent: "blue" }))}
                max={Math.max(1, ...Object.values(stats.bandCounts))}
              />
            </Panel>
          </div>

          {/* QR generator */}
          <Panel title="QR Kehadiran — Hari Program" subtitle="Jana · Cetak · Muat Turun">
            <QRCodeCard
              value={attendUrl}
              caption="Imbas pada hari program untuk menandakan kehadiran"
              downloadName="programos-lite-kehadiran-qr.png"
              size={190}
            />
            <div className="mt-3 rounded-xl bg-sand-100 px-3 py-2 text-[11px] text-navy-500">
              QR menghala ke: <span className="break-all font-semibold">{attendUrl}</span>
            </div>
            <button onClick={() => window.print()} className="btn-outline mt-3 w-full text-sm">
              <Icon name="document" className="h-4 w-4" /> Cetak QR
            </button>

            <details className="mt-4 border-t border-slate2-line pt-3">
              <summary className="cursor-pointer text-[12px] font-bold text-navy-600">
                QR Pendaftaran (sebelum program)
              </summary>
              <div className="mt-3">
                <QRCodeCard
                  value={checkInUrl}
                  caption="Imbas untuk mendaftar penyertaan"
                  downloadName="programos-lite-pendaftaran-qr.png"
                  size={160}
                />
                <div className="mt-2 rounded-xl bg-sand-100 px-3 py-2 text-[11px] text-navy-500">
                  <span className="break-all font-semibold">{checkInUrl}</span>
                </div>
              </div>
            </details>
          </Panel>
        </div>

        {/* Participants */}
        <Panel
          title={`Peserta (${filtered.length})`}
          subtitle="Senarai penyertaan"
          action={
            <div className="flex items-center gap-2">
              <div className="relative">
                <Icon name="search" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-300" />
                <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cari…" className="w-40 rounded-full border border-navy-100 bg-white py-2 pl-9 pr-3 text-sm focus:outline-none sm:w-52" />
              </div>
              <button onClick={() => exportCsv(records)} disabled={!records.length} className="btn-gold text-sm disabled:opacity-50">
                <Icon name="download" className="h-4 w-4" /> <span className="hidden sm:inline">CSV</span>
              </button>
            </div>
          }
        >
          {loading ? (
            <div className="py-12 text-center text-sm text-navy-400">Memuatkan…</div>
          ) : filtered.length === 0 ? (
            <div className="py-12 text-center text-sm text-navy-400">Tiada peserta lagi.</div>
          ) : (
            <>
              {/* Desktop table */}
              <div className="-mx-2 hidden overflow-x-auto sm:block">
                <table className="w-full min-w-[720px] text-sm">
                  <thead>
                    <tr className="text-left text-[11px] font-bold uppercase tracking-wide text-navy-400">
                      <th className="px-2 py-2">Peserta</th>
                      <th className="px-2 py-2">Koperasi</th>
                      <th className="px-2 py-2">Peranan</th>
                      <th className="px-2 py-2">Hadir</th>
                      <th className="px-2 py-2">Skor</th>
                      <th className="px-2 py-2">Bidang</th>
                      <th className="px-2 py-2 text-right">Tindakan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-navy-50">
                    {filtered.map((r) => {
                      const p = r.participant;
                      const area = p.selectedWorkArea ? getWorkArea(p.selectedWorkArea) : undefined;
                      return (
                        <tr key={p.id} className="hover:bg-sand-50">
                          <td className="px-2 py-2.5">
                            <div className="font-semibold text-navy-900">{p.fullName}</div>
                            <div className="text-[11px] text-navy-400">{p.ref} · {p.mobile}</div>
                          </td>
                          <td className="px-2 py-2.5 text-navy-700">{p.coopName || p.companyName || "—"}</td>
                          <td className="px-2 py-2.5 text-navy-600">{p.role || "—"}</td>
                          <td className="px-2 py-2.5">
                            <AttendanceToggle record={r} busy={busyId === p.id} onToggle={() => toggleAttendance(r)} />
                          </td>
                          <td className="px-2 py-2.5 font-bold text-navy-900">{p.readinessScore != null ? `${p.readinessScore}` : "—"}</td>
                          <td className="px-2 py-2.5 text-navy-600">{area ? bm(area.title) : "—"}</td>
                          <td className="px-2 py-2.5">
                            <div className="flex items-center justify-end gap-1">
                              <Link to={`/admin/participant/${p.id}`} className="rounded-lg px-2.5 py-1.5 text-xs font-semibold text-navy-700 hover:bg-navy-50">Lihat</Link>
                              <button onClick={() => handleDelete(r)} disabled={deletingId === p.id} className="rounded-lg px-2.5 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:opacity-40">Padam</button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="space-y-2 sm:hidden">
                {filtered.map((r) => {
                  const p = r.participant;
                  const area = p.selectedWorkArea ? getWorkArea(p.selectedWorkArea) : undefined;
                  return (
                    <div key={p.id} className="rounded-2xl border border-navy-100 p-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="truncate font-semibold text-navy-900">{p.fullName}</div>
                          <div className="text-[11px] text-navy-400">{p.coopName || p.companyName} · {p.role || "—"}</div>
                        </div>
                        {r.attendance.length ? <span className="chip bg-emerald-100 text-emerald-700">Hadir</span> : <span className="chip bg-navy-50 text-navy-400">—</span>}
                      </div>
                      <div className="mt-2 flex flex-wrap gap-1.5 text-[11px] text-navy-500">
                        <span className="chip bg-navy-50 text-navy-600">{p.ref}</span>
                        {p.readinessScore != null && <span className="chip bg-navy-50 text-navy-600">Skor {p.readinessScore}</span>}
                        {area && <span className="chip bg-navy-50 text-navy-600">{bm(area.title)}</span>}
                      </div>
                      <div className="mt-2 flex justify-end gap-1">
                        <Link to={`/admin/participant/${p.id}`} className="rounded-lg px-2.5 py-1.5 text-xs font-semibold text-navy-700 hover:bg-navy-50">Lihat</Link>
                        <button onClick={() => handleDelete(r)} disabled={deletingId === p.id} className="rounded-lg px-2.5 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:opacity-40">Padam</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </Panel>

        <PromptActivityPanel prompts={prompts} records={records} />

        <p className="pb-6 text-center text-[11px] text-navy-400">
          {PROMPT_COUNT} prompt · {WORK_AREAS.length} bidang · {eventConfig.eventName}
        </p>
      </main>
    </div>
  );
}

// ── Stats ────────────────────────────────────────────────────
interface Stats {
  total: number; coops: number; readinessDone: number; promptsTried: number;
  /** How many are marked present for the programme session. */
  present: number;
  areaCounts: Record<string, number>; bandCounts: Record<string, number>;
  topAreaShort: string; topAreaLabel: string; topAreaCount: number;
}
function computeStats(records: ParticipantRecord[]): Stats {
  const coopSet = new Set<string>();
  const areaCounts: Record<string, number> = {};
  const bandCounts: Record<string, number> = {};
  let readinessDone = 0;
  let promptsTried = 0;
  let present = 0;
  for (const r of records) {
    const p = r.participant;
    const coop = (p.coopName || p.companyName || "").trim().toLowerCase();
    if (coop) coopSet.add(coop);
    if (p.selectedWorkArea) areaCounts[p.selectedWorkArea] = (areaCounts[p.selectedWorkArea] ?? 0) + 1;
    if (p.readinessScore != null || r.result) {
      readinessDone++;
      const band = p.readinessCategory || r.result?.readinessCategory;
      if (band) bandCounts[band] = (bandCounts[band] ?? 0) + 1;
    }
    promptsTried += p.triedPromptIds?.length ?? 0;
    if (r.attendance.some((a) => a.session === SESSION)) present++;
  }
  let topId = ""; let topCount = 0;
  for (const [id, c] of Object.entries(areaCounts)) if (c > topCount) { topId = id; topCount = c; }
  const topArea = topId ? getWorkArea(topId) : undefined;
  return {
    total: records.length, coops: coopSet.size, readinessDone, promptsTried, present,
    areaCounts, bandCounts,
    topAreaShort: topArea ? bm(topArea.title).split(" ")[0] : "—",
    topAreaLabel: topArea ? "Most Selected" : "Belum ada",
    topAreaCount: topCount,
  };
}

// ── UI bits ──────────────────────────────────────────────────
function StatCard({ icon, label, sub, value, tone, isText, textValue }: {
  icon: string; label: string; sub: string; value: number; tone: string; isText?: boolean; textValue?: string;
}) {
  const ac = areaAccent(tone === "navy" ? "blue" : tone);
  return (
    <div className="card p-4">
      <span className={`flex h-9 w-9 items-center justify-center rounded-lg ${ac.badge}`}><Icon name={icon} className="h-4 w-4" /></span>
      <div className="mt-3 font-display text-2xl font-extrabold text-navy-900">{isText ? (textValue || "—") : value}</div>
      <div className="text-sm font-bold text-navy-700">{label}</div>
      <div className="text-[11px] text-navy-400">{sub}</div>
    </div>
  );
}

function Panel({ title, subtitle, action, children }: { title: string; subtitle?: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="card p-5">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="font-display text-base font-extrabold text-navy-900">{title}</h2>
          {subtitle && <p className="text-[11px] font-semibold uppercase tracking-wide text-navy-300">{subtitle}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

function BarList({ items, max }: { items: { label: string; value: number; accent: string }[]; max: number }) {
  return (
    <div className="space-y-2.5">
      {items.map((it) => (
        <div key={it.label} className="flex items-center gap-3">
          <span className="w-40 shrink-0 truncate text-xs font-semibold text-navy-600">{it.label}</span>
          <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-navy-50">
            <div className={`h-full rounded-full ${areaAccent(it.accent).bar}`} style={{ width: `${(it.value / max) * 100}%` }} />
          </div>
          <span className="w-6 shrink-0 text-right text-xs font-bold text-navy-900">{it.value}</span>
        </div>
      ))}
    </div>
  );
}

// ── CSV export ───────────────────────────────────────────────
type Cell = string | number | null | undefined;

function exportCsv(records: ParticipantRecord[]) {
  const headers = ["Rujukan", "Nama", "Koperasi", "Peranan", "Telefon", "Emel", "Hadir", "Skor Kesiapsiagaan", "Kategori", "Bidang Dipilih", "Prompt Dicuba", "Prompt Disimpan", "Daftar Pada"];
  const esc = (v: Cell) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const rows = records.map((r) => {
    const p = r.participant;
    const selected = p.selectedWorkArea ? getWorkArea(p.selectedWorkArea) : undefined;
    const area = selected ? bm(selected.title) : "";
    return [
      p.ref, p.fullName, p.coopName || p.companyName, p.role || "", p.mobile, p.email,
      r.attendance.length ? "Ya" : "Tidak",
      p.readinessScore ?? "", p.readinessCategory ?? "", area,
      p.triedPromptIds?.length ?? 0, p.savedPrompts?.length ?? 0,
      new Date(p.checkedInAt).toLocaleString("en-MY"),
    ].map(esc).join(",");
  });
  const csv = [headers.map(esc).join(","), ...rows].join("\n");
  const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `programos-lite-peserta-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// ── Prompt activity ──────────────────────────────────────────
/**
 * Who used which prompt, and the exact text they generated. This is the
 * reason the admin no longer needs the Supabase dashboard to see what
 * participants actually produced.
 */
function PromptActivityPanel({
  prompts,
  records,
}: {
  prompts: PromptAttempt[];
  records: ParticipantRecord[];
}) {
  const [open, setOpen] = useState<string | null>(null);

  const nameFor = (participantId: string) =>
    records.find((r) => r.participant.id === participantId)?.participant ?? null;

  const uniqueUsers = new Set(prompts.map((p) => p.participantId)).size;
  const totalUses = prompts.reduce((n, p) => n + p.attemptCount, 0);

  return (
    <Panel
      title="Aktiviti Prompt"
      subtitle={`${prompts.length} prompt · ${uniqueUsers} peserta · ${totalUses} kali guna`}
      action={
        prompts.length ? (
          <button onClick={() => exportPromptCsv(prompts, records)} className="btn-ghost text-xs">
            <Icon name="download" className="h-3.5 w-3.5" /> CSV
          </button>
        ) : null
      }
    >
      {!prompts.length ? (
        <p className="py-6 text-center text-sm text-navy-400">
          Belum ada prompt digunakan oleh peserta.
        </p>
      ) : (
        <div className="divide-y divide-navy-50">
          {prompts.map((a) => {
            const p = nameFor(a.participantId);
            const key = `${a.participantId}:${a.missionId}`;
            const isOpen = open === key;
            return (
              <div key={key} className="py-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-bold text-navy-900">
                      {p?.fullName ?? "Peserta dipadam"}
                      <span className="ml-2 font-normal text-navy-400">
                        {p?.coopName || p?.companyName}
                      </span>
                    </div>
                    <div className="mt-0.5 flex flex-wrap items-center gap-x-2 text-[11px] text-navy-500">
                      <span className="font-semibold text-navy-700">{a.promptTitle}</span>
                      <span aria-hidden="true">·</span>
                      <span>{(() => { const wa = getWorkArea(a.areaId); return wa ? bm(wa.title) : a.areaId; })()}</span>
                      <span aria-hidden="true">·</span>
                      <span>{a.attemptCount}× guna</span>
                      <span aria-hidden="true">·</span>
                      <span>{new Date(a.lastUsedAt).toLocaleString("ms-MY")}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setOpen(isOpen ? null : key)}
                    className="shrink-0 rounded-lg border border-navy-200 px-2.5 py-1.5 text-xs font-semibold text-navy-600 hover:bg-navy-50"
                  >
                    {isOpen ? "Tutup" : "Lihat"}
                  </button>
                </div>

                {isOpen && (
                  <div className="mt-3 space-y-3">
                    {Object.keys(a.inputs ?? {}).length > 0 && (
                      <div>
                        <div className="text-[11px] font-bold uppercase tracking-wide text-navy-400">
                          Jawapan peserta
                        </div>
                        <dl className="mt-1 grid gap-1 sm:grid-cols-2">
                          {Object.entries(a.inputs).map(([k, v]) => (
                            <div key={k} className="rounded-lg bg-navy-50 px-3 py-2">
                              <dt className="text-[10px] font-semibold uppercase text-navy-400">{k}</dt>
                              <dd className="text-xs text-navy-800">{v || "—"}</dd>
                            </div>
                          ))}
                        </dl>
                      </div>
                    )}
                    {a.promptText ? (
                      <pre className="max-h-64 overflow-auto whitespace-pre-wrap rounded-xl bg-navy-900 p-4 text-[12px] leading-relaxed text-navy-100">
{a.promptText}
                      </pre>
                    ) : (
                      <p className="text-xs text-navy-400">
                        Direkod sebelum teks prompt disimpan.
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </Panel>
  );
}

function exportPromptCsv(prompts: PromptAttempt[], records: ParticipantRecord[]) {
  const esc = (v: Cell) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const rows: Cell[][] = [
    ["Nama", "Koperasi", "E-mel", "Prompt", "Bidang", "Kali Guna", "Kali Terakhir", "Jawapan", "Teks Prompt"],
    ...prompts.map((a) => {
      const p = records.find((r) => r.participant.id === a.participantId)?.participant;
      return [
        p?.fullName ?? "",
        p?.coopName || p?.companyName || "",
        p?.email ?? "",
        a.promptTitle,
        (() => { const wa = getWorkArea(a.areaId); return wa ? bm(wa.title) : a.areaId; })(),
        a.attemptCount,
        new Date(a.lastUsedAt).toLocaleString("ms-MY"),
        JSON.stringify(a.inputs ?? {}),
        a.promptText ?? "",
      ];
    }),
  ];
  const csv = rows.map((r) => r.map(esc).join(",")).join("\n");
  const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `aktiviti-prompt-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}


/**
 * Present / absent for one participant. A button rather than a badge: the
 * organiser is the one who decides, and the e-certificate follows this.
 */
function AttendanceToggle({
  record,
  busy,
  onToggle,
}: {
  record: ParticipantRecord;
  busy: boolean;
  onToggle: () => void;
}) {
  const present = record.attendance.some((a) => a.session === SESSION);
  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={busy}
      aria-pressed={present}
      title={present ? "Klik untuk tandakan tidak hadir" : "Klik untuk tandakan hadir"}
      className={`chip transition disabled:opacity-40 ${
        present
          ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
          : "bg-navy-50 text-navy-400 hover:bg-navy-100 hover:text-navy-600"
      }`}
    >
      <Icon name={present ? "checkCircle" : "clock"} className="h-3.5 w-3.5" />
      {present ? "Hadir" : "Tandakan"}
    </button>
  );
}


/**
 * Live room counter. Present over expected — the figure that tells the
 * organiser whether the room is full without counting heads.
 */
function AttendanceCounter({
  present,
  target,
  registered,
}: {
  present: number;
  target: number;
  registered: number;
}) {
  const pct = Math.min(100, Math.round((present / Math.max(1, target)) * 100));
  return (
    <div className="panel-dark hero-glow p-5 sm:p-6">
      <div className="hero-grid pointer-events-none absolute inset-0" />
      <div className="relative flex flex-wrap items-center justify-between gap-5">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/45">
            Kehadiran Hari Ini · Attendance
          </div>
          <div className="mt-1.5 flex items-end gap-2">
            <span className="num text-[46px] leading-none text-gold-400 sm:text-[56px]">{present}</span>
            <span className="num pb-1.5 text-[22px] leading-none text-white/35">/ {target}</span>
          </div>
          <div className="mt-1 text-[12px] text-white/45">
            {registered} peserta berdaftar · {Math.max(0, target - present)} belum hadir
          </div>
        </div>

        <div className="w-full sm:w-72">
          <div className="h-2.5 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full transition-[width] duration-700 ease-out"
              style={{ width: `${pct}%`, backgroundImage: "var(--grad-btn)" }}
            />
          </div>
          <div className="mt-2 text-right text-[11px] font-bold text-white/50">{pct}%</div>
        </div>
      </div>
    </div>
  );
}
