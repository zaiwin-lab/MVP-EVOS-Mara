import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { eventConfig, ADMIN_PASSWORD, publicOrigin } from "../../config/eventConfig";
import { store, storageMode } from "../../data/store";
import type { ParticipantRecord } from "../../data/types";
import { WORK_AREAS, getWorkArea, PROMPT_COUNT } from "../../content/promptLibrary";
import { READINESS_BANDS } from "../../content/readiness";
import { Icon } from "../../components/Icon";
import { QRCodeCard } from "../../components/QRCode";
import { areaAccent } from "../../lib/accents";

const AUTH_KEY = "attendify:adminAuthed";

export default function AdminDashboard() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem(AUTH_KEY) === "1");
  if (!authed) return <Gate onOk={() => setAuthed(true)} />;
  return <Dashboard />;
}

function Gate({ onOk }: { onOk: () => void }) {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState(false);
  const navigate = useNavigate();
  function submit() {
    if (pw === ADMIN_PASSWORD) {
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
        <button onClick={submit} className="btn-gold mt-4 w-full">Log Masuk</button>
        <button onClick={() => navigate("/")} className="mt-3 w-full text-center text-xs text-navy-400 underline">Kembali ke laman utama</button>
      </div>
    </div>
  );
}

function Dashboard() {
  const [records, setRecords] = useState<ParticipantRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    store.listRecords().then((r) => { setRecords(r); setLoading(false); });
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

  async function handleDelete(r: ParticipantRecord) {
    if (!window.confirm(`Padam ${r.participant.fullName} dan semua rekod berkaitan? Tindakan ini tidak boleh diundur.`)) return;
    setDeletingId(r.participant.id);
    setRecords((prev) => prev.filter((x) => x.participant.id !== r.participant.id));
    try { await store.deleteParticipant(r.participant.id); }
    catch (e) { console.error(e); load(); }
    finally { setDeletingId(null); }
  }

  const checkInUrl = `${publicOrigin()}/check-in`;
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
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-6 px-4 py-6">
        {/* Backend banner */}
        <div className={`rounded-2xl border px-4 py-3 text-sm ${online ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-amber-200 bg-amber-50 text-amber-800"}`}>
          {online
            ? "🟢 Shared Database Connected — data kehadiran diselaraskan merentas semua peranti peserta."
            : "🟡 Local Mode — Supabase belum dikonfigurasikan; data disimpan pada peranti ini sahaja."}
        </div>

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
                items={WORK_AREAS.map((a) => ({ label: a.title, value: stats.areaCounts[a.id] ?? 0, accent: a.accent }))}
                max={Math.max(1, ...Object.values(stats.areaCounts))}
              />
            </Panel>

            <Panel title="Status Kesiapsiagaan AI" subtitle="Readiness Distribution">
              <BarList
                items={READINESS_BANDS.map((b) => ({ label: b.label, value: stats.bandCounts[b.label] ?? 0, accent: "blue" }))}
                max={Math.max(1, ...Object.values(stats.bandCounts))}
              />
            </Panel>
          </div>

          {/* QR generator */}
          <Panel title="QR Generator Kehadiran" subtitle="Jana · Cetak · Muat Turun">
            <QRCodeCard
              value={checkInUrl}
              caption="Imbas untuk daftar kehadiran ProgramOS Lite"
              downloadName="programos-lite-checkin-qr.png"
              size={190}
            />
            <div className="mt-3 rounded-xl bg-sand-100 px-3 py-2 text-[11px] text-navy-500">
              QR menghala ke: <span className="break-all font-semibold">{checkInUrl}</span>
            </div>
            <button onClick={() => window.print()} className="btn-outline mt-3 w-full text-sm">
              <Icon name="document" className="h-4 w-4" /> Cetak QR
            </button>
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
                          <td className="px-2 py-2.5">{r.attendance.length ? <span className="chip bg-emerald-100 text-emerald-700">Hadir</span> : <span className="chip bg-navy-50 text-navy-400">—</span>}</td>
                          <td className="px-2 py-2.5 font-bold text-navy-900">{p.readinessScore != null ? `${p.readinessScore}` : "—"}</td>
                          <td className="px-2 py-2.5 text-navy-600">{area ? area.title : "—"}</td>
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
                        {area && <span className="chip bg-navy-50 text-navy-600">{area.title}</span>}
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
  areaCounts: Record<string, number>; bandCounts: Record<string, number>;
  topAreaShort: string; topAreaLabel: string; topAreaCount: number;
}
function computeStats(records: ParticipantRecord[]): Stats {
  const coopSet = new Set<string>();
  const areaCounts: Record<string, number> = {};
  const bandCounts: Record<string, number> = {};
  let readinessDone = 0;
  let promptsTried = 0;
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
  }
  let topId = ""; let topCount = 0;
  for (const [id, c] of Object.entries(areaCounts)) if (c > topCount) { topId = id; topCount = c; }
  const topArea = topId ? getWorkArea(topId) : undefined;
  return {
    total: records.length, coops: coopSet.size, readinessDone, promptsTried,
    areaCounts, bandCounts,
    topAreaShort: topArea ? topArea.title.split(" ")[0] : "—",
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
function exportCsv(records: ParticipantRecord[]) {
  const headers = ["Rujukan", "Nama", "Koperasi", "Peranan", "Telefon", "Emel", "Hadir", "Skor Kesiapsiagaan", "Kategori", "Bidang Dipilih", "Prompt Dicuba", "Prompt Disimpan", "Daftar Pada"];
  const esc = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const rows = records.map((r) => {
    const p = r.participant;
    const area = p.selectedWorkArea ? getWorkArea(p.selectedWorkArea)?.title : "";
    return [
      p.ref, p.fullName, p.coopName || p.companyName, p.role || "", p.mobile, p.email,
      r.attendance.length ? "Ya" : "Tidak",
      p.readinessScore ?? "", p.readinessCategory ?? "", area ?? "",
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
