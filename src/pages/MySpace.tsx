import { Link, Navigate, useNavigate } from "react-router-dom";
import { eventConfig } from "../config/eventConfig";
import { getWorkArea } from "../content/promptLibrary";
import { SiteLayout, SITE_WRAP } from "../components/SiteChrome";
import { Icon } from "../components/Icon";
import { areaAccent } from "../lib/accents";
import { useParticipant } from "../context/ParticipantContext";

export default function MySpace() {
  const { participantId, record, loading, signOut } = useParticipant();
  const navigate = useNavigate();

  if (!participantId && !loading) return <Navigate to="/check-in" replace />;
  if (loading || !record) {
    return (
      <SiteLayout>
        <div className={`${SITE_WRAP} py-20 text-center text-sm text-navy-400`}>Memuatkan…</div>
      </SiteLayout>
    );
  }

  const p = record.participant;
  const area = p.selectedWorkArea ? getWorkArea(p.selectedWorkArea) : undefined;
  const saved = p.savedPrompts ?? [];
  const tried = p.triedPromptIds?.length ?? 0;
  const attended = record.attendance.length > 0;

  return (
    <SiteLayout>
      <section className="bg-navy-950 text-white">
        <div className={`${SITE_WRAP} py-9`}>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <span className="section-eyebrow text-gold-300">Ruang Saya · Hasil Saya</span>
              <h1 className="mt-2 font-display text-2xl font-extrabold sm:text-3xl">Salam, {p.fullName.split(" ")[0]} 👋</h1>
              <p className="mt-1 text-sm text-navy-200">{p.coopName || p.companyName} · {p.role || "Peserta"}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="chip bg-white/10 text-white">{p.ref}</span>
              <button onClick={() => { signOut(); navigate("/"); }} className="chip bg-white/10 text-white hover:bg-white/20">
                <Icon name="arrowRight" className="h-3.5 w-3.5" /> Keluar
              </button>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <span className={`chip ${attended ? "bg-emerald-400/20 text-emerald-200" : "bg-white/10 text-navy-200"}`}>
              <Icon name={attended ? "checkCircle" : "clock"} className="h-3.5 w-3.5" /> {attended ? "Kehadiran direkodkan" : "Belum daftar kehadiran"}
            </span>
            <span className="chip bg-white/10 text-white">{tried} prompt dicuba</span>
            <span className="chip bg-white/10 text-white">{saved.length} prompt disimpan</span>
          </div>
        </div>
      </section>

      <section className={`${SITE_WRAP} py-10`}>
        <div className="grid gap-5 lg:grid-cols-3">
          {/* Readiness */}
          <div className="card p-5 lg:col-span-1">
            <div className="text-xs font-bold uppercase tracking-wide text-navy-400">Kesiapsiagaan AI</div>
            {p.readinessScore != null ? (
              <div className="mt-3 flex items-center gap-4">
                <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-full border-4 border-gold-400 text-navy-900">
                  <span className="text-lg font-extrabold leading-none">{p.readinessScore}</span>
                  <span className="text-[9px] font-semibold text-navy-400">/100</span>
                </div>
                <div>
                  <div className="font-display text-base font-bold text-navy-900">{p.readinessCategory}</div>
                  <Link to="/readiness" className="text-xs font-semibold text-navy-500 underline">Ambil semula</Link>
                </div>
              </div>
            ) : (
              <div className="mt-3">
                <p className="text-sm text-navy-500">Anda belum mengambil penilaian.</p>
                <Link to="/readiness" className="btn-gold mt-3 w-full text-sm">Mula Penilaian AI</Link>
              </div>
            )}
          </div>

          {/* Selected work area */}
          <div className="card p-5 lg:col-span-2">
            <div className="text-xs font-bold uppercase tracking-wide text-navy-400">Bidang Fokus Anda</div>
            {area ? (
              <div className="mt-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${areaAccent(area.accent).badge}`}>
                    <Icon name={area.icon} className="h-5 w-5" />
                  </span>
                  <div>
                    <div className="font-display text-base font-bold text-navy-900">{area.title}</div>
                    <div className="text-xs text-navy-400">{area.blurb}</div>
                  </div>
                </div>
                <Link to={`/prompt-hub/${area.id}`} className="btn-outline shrink-0 text-sm">Buka</Link>
              </div>
            ) : (
              <div className="mt-3 flex items-center justify-between gap-3">
                <p className="text-sm text-navy-500">Anda belum memilih bidang. Terokai 6 bidang utama.</p>
                <Link to="/prompt-hub" className="btn-gold shrink-0 text-sm">Pilih Bidang</Link>
              </div>
            )}
          </div>
        </div>

        {/* Saved prompts */}
        <div className="mt-5 card p-5">
          <div className="flex items-center justify-between">
            <div className="text-xs font-bold uppercase tracking-wide text-navy-400">Senarai Prompt Saya</div>
            <Link to="/prompt-hub" className="text-xs font-semibold text-navy-600 underline">Tambah lagi</Link>
          </div>
          {saved.length ? (
            <ul className="mt-3 divide-y divide-navy-50">
              {saved.map((s) => (
                <li key={s.id} className="flex items-center justify-between gap-3 py-3">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold text-navy-900">{s.title}</div>
                    <div className="text-[11px] text-navy-400">{getWorkArea(s.areaId)?.title}</div>
                  </div>
                  <Link to={`/prompt-hub/${s.areaId}/${s.id}`} className="btn-ghost shrink-0 text-xs">Buka</Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-navy-500">Belum ada prompt disimpan. Jana prompt dan tekan “Simpan ke Senarai”.</p>
          )}
        </div>

        {/* Quick links */}
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <Link to="/prompt-hub" className="card flex items-center gap-3 p-4 hover:shadow-lift">
            <Icon name="target" className="h-5 w-5 text-navy-700" /> <span className="text-sm font-bold text-navy-900">6 Bidang Utama</span>
          </Link>
          <Link to="/journey" className="card flex items-center gap-3 p-4 hover:shadow-lift">
            <Icon name="calendar" className="h-5 w-5 text-navy-700" /> <span className="text-sm font-bold text-navy-900">Perjalanan 90 Hari</span>
          </Link>
          <Link to="/sumber" className="card flex items-center gap-3 p-4 hover:shadow-lift">
            <Icon name="book" className="h-5 w-5 text-navy-700" /> <span className="text-sm font-bold text-navy-900">Modul & Sumber</span>
          </Link>
        </div>

        <p className="mt-6 text-center text-xs text-navy-400">{eventConfig.eventName} · {eventConfig.venue}</p>
      </section>
    </SiteLayout>
  );
}
