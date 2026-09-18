import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { store } from "../../data/store";
import type { ParticipantRecord } from "../../data/types";
import { READINESS_AREAS } from "../../content/readiness";
import { getWorkArea } from "../../content/promptLibrary";
import { Icon } from "../../components/Icon";
import { RadarChart } from "../../components/RadarChart";
import { ScoreRing } from "../../components/ScoreRing";
import { pick as pickLang, type Localized } from "../../context/I18nContext";


// The admin console is Bahasa Melayu only, and the figures it shows are
// keyed by the BM wording stored in the database — so localized content is
// always resolved to BM here rather than to the visitor's chosen language.
const bm = (v: Localized) => pickLang(v, "bm");

const AUTH_KEY = "attendify:adminAuthed";

export default function AdminParticipant() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [record, setRecord] = useState<ParticipantRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (sessionStorage.getItem(AUTH_KEY) !== "1") { navigate("/admin"); return; }
    if (!id) return;
    store.getRecord(id).then((r) => { setRecord(r); setLoading(false); });
  }, [id, navigate]);

  async function handleDelete() {
    if (!record) return;
    if (!window.confirm(`Padam ${record.participant.fullName} dan semua rekod berkaitan?`)) return;
    await store.deleteParticipant(record.participant.id);
    navigate("/admin");
  }

  if (loading) return <div className="min-h-dvh bg-sand-50 py-20 text-center text-sm text-navy-400">Memuatkan…</div>;
  if (!record) {
    return (
      <div className="min-h-dvh bg-sand-50 py-20 text-center">
        <p className="text-sm text-navy-500">Peserta tidak dijumpai.</p>
        <Link to="/admin" className="btn-outline mt-4 inline-flex">Kembali</Link>
      </div>
    );
  }

  const { participant: p, result } = record;
  const area = p.selectedWorkArea ? getWorkArea(p.selectedWorkArea) : undefined;
  const saved = p.savedPrompts ?? [];

  return (
    <div className="min-h-dvh bg-sand-50">
      <header className="sticky top-0 z-20 bg-navy-950 text-white">
        <div className="mx-auto flex max-w-4xl items-center gap-3 px-4 py-3">
          <Link to="/admin" className="flex h-9 w-9 items-center justify-center rounded-full text-white/70 hover:bg-white/10"><Icon name="arrowLeft" /></Link>
          <div className="min-w-0">
            <div className="truncate text-sm font-bold">{p.fullName}</div>
            <div className="truncate text-[11px] text-navy-300">{p.coopName || p.companyName}</div>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <button onClick={handleDelete} className="chip bg-red-500/20 text-red-200 hover:bg-red-500/30">Padam</button>
            <span className="chip bg-white/10 text-white">{p.ref}</span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl space-y-5 px-4 py-6">
        <Panel title="Maklumat Peserta" icon="users">
          <DL rows={[
            ["Nama Penuh", p.fullName],
            ["Nama Koperasi", p.coopName || p.companyName || "—"],
            ["Peranan", p.role || "—"],
            ["No. Telefon", p.mobile],
            ["Emel", p.email],
            ["Kehadiran", record.attendance.length ? "Hadir" : "Belum"],
            ["Daftar Pada", new Date(p.checkedInAt).toLocaleString("en-MY")],
          ]} />
        </Panel>

        {result ? (
          <Panel title="Kesiapsiagaan AI" icon="chart">
            <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-start">
              <div className="flex flex-col items-center">
                <ScoreRing score={result.totalScore} size={140} />
                <span className="mt-2 chip bg-navy-800 text-white">{result.readinessCategory}</span>
              </div>
              <div className="w-full flex-1">
                <RadarChart axes={READINESS_AREAS.map((a) => ({ label: bm(a.radarLabel), value: result.indicatorScores[a.id] ?? 0, max: 20 }))} size={220} />
              </div>
            </div>
            <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {READINESS_AREAS.map((a) => (
                <div key={a.id} className="flex items-center justify-between rounded-lg bg-sand-50 px-3 py-2 text-sm">
                  <span className="text-navy-600">{bm(a.title)}</span>
                  <span className="font-bold text-navy-900">{result.indicatorScores[a.id] ?? 0}/20</span>
                </div>
              ))}
            </div>
            {result.summary && <p className="mt-4 rounded-xl bg-sand-50 p-4 text-sm text-navy-700">{result.summary}</p>}
          </Panel>
        ) : (
          <EmptyPanel label="Penilaian AI belum diambil." />
        )}

        <Panel title="Aktiviti Prompt" icon="spark">
          <DL rows={[
            ["Bidang Dipilih", area ? bm(area.title) : "—"],
            ["Prompt Dicuba", String(p.triedPromptIds?.length ?? 0)],
            ["Prompt Disimpan", String(saved.length)],
          ]} />
          {saved.length > 0 && (
            <ul className="mt-3 space-y-1.5">
              {saved.map((s) => (
                <li key={s.id} className="flex items-center gap-2 rounded-lg bg-sand-50 px-3 py-2 text-sm text-navy-700">
                  <Icon name="check" className="h-4 w-4 text-emerald-600" /> {s.title}
                  <span className="ml-auto text-[11px] text-navy-400">{(() => { const wa = getWorkArea(s.areaId); return wa ? bm(wa.title) : ""; })()}</span>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        {p.journeyReflection && Object.values(p.journeyReflection).some(Boolean) && (
          <Panel title="Refleksi 90 Hari" icon="book">
            <ul className="space-y-2 text-sm text-navy-700">
              {Object.entries(p.journeyReflection).filter(([, v]) => v).map(([k, v]) => (
                <li key={k} className="rounded-lg bg-sand-50 px-3 py-2">{v}</li>
              ))}
            </ul>
          </Panel>
        )}
      </main>
    </div>
  );
}

function Panel({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <section className="card p-5">
      <div className="mb-4 flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-navy-50 text-navy-700"><Icon name={icon} className="h-4 w-4" /></span>
        <h2 className="font-display text-base font-extrabold text-navy-900">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function EmptyPanel({ label }: { label: string }) {
  return <div className="rounded-2xl border border-dashed border-navy-200 py-8 text-center text-sm text-navy-400">{label}</div>;
}

function DL({ rows }: { rows: [string, string][] }) {
  return (
    <dl className="grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2">
      {rows.map(([k, v]) => (
        <div key={k} className="flex justify-between gap-4 border-b border-navy-50 py-1.5">
          <dt className="text-xs font-semibold text-navy-400">{k}</dt>
          <dd className="text-right text-sm font-medium text-navy-800">{v}</dd>
        </div>
      ))}
    </dl>
  );
}
