import { Link } from "react-router-dom";
import { WORK_AREAS, PROMPT_COUNT } from "../content/promptLibrary";
import { SiteLayout, SITE_WRAP } from "../components/SiteChrome";
import { Icon } from "../components/Icon";
import { areaAccent } from "../lib/accents";
import { useParticipant } from "../context/ParticipantContext";

const STEPS = [
  { n: 1, title: "Pilih Bidang", desc: "Pilih satu bidang yang paling relevan dengan keperluan koperasi anda." },
  { n: 2, title: "Lihat Prompt", desc: "Terokai senarai prompt mengikut bidang." },
  { n: 3, title: "Mulakan", desc: "Isi butiran, jana prompt, dan gunakan dalam AI pilihan anda." },
];

export default function PromptHub() {
  const { record } = useParticipant();
  const selected = record?.participant.selectedWorkArea;

  return (
    <SiteLayout>
      <section className="bg-navy-950 text-white">
        <div className={`${SITE_WRAP} py-10 lg:py-12`}>
          <span className="section-eyebrow text-gold-300">AI Prompt Hub · 6 Bidang Utama</span>
          <h1 className="mt-2 font-display text-3xl font-extrabold sm:text-4xl">Pilih Bidang Utama Anda</h1>
          <p className="mt-1 text-sm font-semibold text-navy-200">Choose Your Work Area</p>
          <p className="mt-3 max-w-2xl text-sm text-navy-200">
            Setiap bidang mengandungi koleksi prompt AI yang disusun khas untuk membantu koperasi bekerja dengan lebih mudah, cepat dan berkesan — {PROMPT_COUNT} prompt kesemuanya.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {STEPS.map((s) => (
              <div key={s.n} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gold-400 text-sm font-extrabold text-navy-900">{s.n}</span>
                <div>
                  <div className="text-sm font-bold">{s.title}</div>
                  <div className="text-xs text-navy-200">{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={`${SITE_WRAP} py-12`}>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {WORK_AREAS.map((a) => {
            const ac = areaAccent(a.accent);
            const isSel = selected === a.id;
            return (
              <Link key={a.id} to={`/prompt-hub/${a.id}`} className={`group relative flex flex-col gap-3 rounded-2xl border p-5 transition hover:shadow-lift ${ac.card}`}>
                {isSel && (
                  <span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-navy-900 px-2.5 py-1 text-[11px] font-bold text-white">
                    <Icon name="check" className="h-3 w-3" /> Dipilih
                  </span>
                )}
                <span className={`flex h-12 w-12 items-center justify-center rounded-xl ${ac.badge}`}>
                  <Icon name={a.icon} className="h-6 w-6" />
                </span>
                <div>
                  <div className="font-display text-base font-bold text-navy-900">{a.title}</div>
                  <div className="text-[11px] font-semibold uppercase tracking-wide text-navy-300">{a.titleEn}</div>
                </div>
                <p className="text-sm text-navy-500">{a.blurb}</p>
                <span className={`mt-auto inline-flex items-center gap-1 pt-1 text-sm font-bold ${ac.text}`}>
                  Lihat 10 Prompt <Icon name="arrowRight" className="h-4 w-4" />
                </span>
              </Link>
            );
          })}
        </div>

        <div className="mt-8 flex flex-col items-start gap-3 rounded-3xl bg-sand-100 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gold-400/20 text-gold-700">
              <Icon name="spark" className="h-5 w-5" />
            </span>
            <div>
              <h3 className="font-display text-base font-bold text-navy-900">Tidak pasti bidang mana?</h3>
              <p className="text-sm text-navy-500">Ambil AI Readiness Snapshot dan kami cadangkan satu bidang untuk anda mulakan.</p>
            </div>
          </div>
          <Link to="/readiness" className="btn-gold shrink-0">Mula Penilaian <Icon name="arrowRight" className="h-5 w-5" /></Link>
        </div>
      </section>
    </SiteLayout>
  );
}
