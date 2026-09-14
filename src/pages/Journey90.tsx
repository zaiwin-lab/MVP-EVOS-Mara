import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { SiteLayout, SITE_WRAP } from "../components/SiteChrome";
import { Icon } from "../components/Icon";
import { useParticipant } from "../context/ParticipantContext";
import { store } from "../data/store";

const MONTHS = [
  {
    n: 1, tag: "EXPLORE", title: "Bulan 1 — Explore", accent: "emerald",
    focus: "Kenali AI dan cuba yang asas.", range: "Prompt 1–3",
    steps: ["Baca contoh prompt dan fahami kegunaannya.", "Cuba sendiri sekurang-kurangnya 1 prompt.", "Kongsi pengalaman dengan rakan koperasi."],
    quote: "Mulakan dengan rasa ingin tahu.",
  },
  {
    n: 2, tag: "APPLY", title: "Bulan 2 — Apply", accent: "blue",
    focus: "Cuba dalam tugasan harian.", range: "Prompt 4–7",
    steps: ["Pilih 2–3 prompt yang relevan dengan kerja anda.", "Uji dalam situasi sebenar (cth. emel, laporan, promosi).", "Catat apa yang berkesan dan apa boleh diperbaiki."],
    quote: "Pembelajaran berlaku bila anda mencuba.",
  },
  {
    n: 3, tag: "IMPROVE", title: "Bulan 3 — Improve", accent: "rose",
    focus: "Kukuhkan kemahiran dan teroka lebih jauh.", range: "Prompt 8–10",
    steps: ["Cuba prompt yang lebih kreatif atau strategik.", "Sesuaikan prompt mengikut keperluan koperasi.", "Rancang apa yang ingin diteruskan selepas 90 hari."],
    quote: "Langkah kecil membawa perubahan besar.",
  },
] as const;

const REFLECT = [
  { id: "useful", q: "Prompt mana paling berguna untuk anda?", hint: "Which prompt was most useful?" },
  { id: "tried", q: "Apa yang anda telah cuba gunakan dalam kerja atau koperasi?", hint: "What have you tried?" },
  { id: "next", q: "Apa seterusnya?", hint: "What's next for you?" },
];

const TONE: Record<string, string> = {
  emerald: "border-emerald-100 bg-emerald-50/60",
  blue: "border-sky-100 bg-sky-50/60",
  rose: "border-rose-100 bg-rose-50/60",
};
const DOT: Record<string, string> = {
  emerald: "bg-emerald-500",
  blue: "bg-sky-500",
  rose: "bg-rose-500",
};

export default function Journey90() {
  const { participantId, record, refresh } = useParticipant();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [savedFlag, setSavedFlag] = useState(false);

  useEffect(() => {
    if (record?.participant.journeyReflection) setAnswers(record.participant.journeyReflection);
  }, [record]);

  async function save() {
    if (!participantId) return;
    await store.updateParticipant(participantId, { journeyReflection: answers });
    await refresh();
    setSavedFlag(true);
    setTimeout(() => setSavedFlag(false), 2500);
  }

  return (
    <SiteLayout>
      <section className="relative overflow-hidden bg-navy-950 text-white">
        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-gold-500/15 blur-3xl" />
        <div className={`relative ${SITE_WRAP} py-10 lg:py-12`}>
          <span className="section-eyebrow text-gold-300">90-Day Prompt Exploration Journey</span>
          <h1 className="mt-2 font-display text-3xl font-extrabold sm:text-4xl">Perjalanan 90 Hari</h1>
          <p className="mt-3 max-w-2xl text-sm text-navy-200">
            Langkah demi langkah, mengikut rentak anda. Mulakan kecil, belajar bersama, dan temui peluang AI untuk koperasi anda.
          </p>
          <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-gold-200">
            <Icon name="checkCircle" className="h-3.5 w-3.5" /> Panduan ringkas, bukan KPI wajib.
          </span>
        </div>
      </section>

      <section className={`${SITE_WRAP} py-12`}>
        <div className="grid gap-4 lg:grid-cols-3">
          {MONTHS.map((m) => (
            <div key={m.n} className={`flex flex-col rounded-3xl border p-6 ${TONE[m.accent]}`}>
              <div className="flex items-center gap-3">
                <span className={`flex h-10 w-10 items-center justify-center rounded-full text-white ${DOT[m.accent]}`}>
                  <span className="text-sm font-extrabold">{m.n}</span>
                </span>
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wide text-navy-400">{m.tag}</div>
                  <div className="font-display text-lg font-bold text-navy-900">{m.title}</div>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm font-bold text-navy-800">{m.focus}</span>
                <span className="chip bg-white text-navy-600">{m.range}</span>
              </div>
              <ol className="mt-4 space-y-2">
                {m.steps.map((s, i) => (
                  <li key={i} className="flex gap-2 text-sm text-navy-600">
                    <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${DOT[m.accent]}`} /> {s}
                  </li>
                ))}
              </ol>
              <p className="mt-4 border-t border-navy-100 pt-3 text-xs italic text-navy-400">“{m.quote}”</p>
            </div>
          ))}
        </div>

        {/* Reflection space */}
        <div className="mt-10 rounded-3xl bg-navy-950 p-6 text-white sm:p-8">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-gold-300">
              <Icon name="book" className="h-4 w-4" />
            </span>
            <div>
              <h2 className="font-display text-lg font-bold">Ruang Refleksi Anda</h2>
              <p className="text-xs text-navy-200">Your Reflection Space · luangkan sedikit masa untuk fikirkan.</p>
            </div>
          </div>

          <div className="mt-5 space-y-4">
            {REFLECT.map((r, i) => (
              <div key={r.id}>
                <label className="block text-sm font-semibold text-white">
                  <span className="mr-1.5 text-gold-300">{i + 1}.</span>{r.q}
                  <span className="ml-1 text-xs font-normal text-navy-300">/ {r.hint}</span>
                </label>
                <textarea
                  className="mt-1.5 min-h-[70px] w-full resize-y rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-navy-300 focus:border-gold-400 focus:outline-none"
                  placeholder="Tulis refleksi anda di sini…"
                  value={answers[r.id] ?? ""}
                  onChange={(e) => setAnswers((p) => ({ ...p, [r.id]: e.target.value }))}
                />
              </div>
            ))}
          </div>

          {participantId ? (
            <button onClick={save} className="btn-gold mt-5">
              <Icon name={savedFlag ? "check" : "book"} className="h-5 w-5" /> {savedFlag ? "Refleksi Disimpan" : "Simpan Refleksi"}
            </button>
          ) : (
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <Link to="/check-in" className="btn-gold">Daftar untuk simpan refleksi</Link>
              <span className="text-xs text-navy-300">Refleksi adalah pilihan — tiada tekanan.</span>
            </div>
          )}
        </div>
      </section>
    </SiteLayout>
  );
}
