import { Link } from "react-router-dom";
import { eventConfig } from "../config/eventConfig";
import { FEATURES, QUICK_LINKS } from "../content/site";
import { WORK_AREAS, PROMPT_COUNT } from "../content/promptLibrary";
import { READINESS_AREAS } from "../content/readiness";
import { SiteLayout, SITE_WRAP } from "../components/SiteChrome";
import { Icon } from "../components/Icon";
import { areaAccent } from "../lib/accents";

const META = [
  { icon: "calendar", label: eventConfig.dates, sub: eventConfig.weekday },
  { icon: "location", label: eventConfig.venue, sub: eventConfig.venueCity },
  { icon: "users", label: `${eventConfig.expectedParticipants} Peserta`, sub: "Tempat Terhad" },
  { icon: "team", label: `${eventConfig.maxPerCoop} Wakil`, sub: "Setiap Koperasi" },
];

export default function Landing() {
  return (
    <SiteLayout>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-navy-950 text-white">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "30px 30px",
          }}
        />
        <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-gold-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-sky-500/10 blur-3xl" />

        <div className={`relative ${SITE_WRAP} py-12 lg:py-16`}>
          <span className="section-eyebrow text-gold-300">{eventConfig.heroKicker}</span>
          <h1 className="mt-3 font-display text-4xl font-extrabold leading-[1.02] tracking-tight sm:text-5xl lg:text-6xl">
            <span className="block">TRANSFORMASI</span>
            <span className="block bg-gradient-to-r from-sky-300 via-cyan-200 to-gold-300 bg-clip-text text-transparent">
              DIGITAL &amp; AI
            </span>
            <span className="block">UNTUK KOPERASI</span>
          </h1>
          <p className="mt-4 text-sm font-semibold text-gold-200 sm:text-base">
            {eventConfig.heroSubline}
          </p>

          {/* Event meta */}
          <div className="mt-8 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4">
            {META.map((m) => (
              <div key={m.label} className="rounded-2xl border border-white/10 bg-white/5 p-3.5 backdrop-blur">
                <div className="flex items-center gap-2 text-gold-300">
                  <Icon name={m.icon} className="h-4 w-4" />
                </div>
                <div className="mt-2 text-sm font-bold leading-tight">{m.label}</div>
                <div className="text-[11px] text-navy-200">{m.sub}</div>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link to="/check-in" className="btn-gold text-base sm:px-8">
              Mulakan Perjalanan AI Anda
              <Icon name="arrowRight" className="h-5 w-5" />
            </Link>
            <Link to="/sumber" className="btn-ghost bg-white/10 text-sm text-white hover:bg-white/20">
              <Icon name="book" className="h-4 w-4" /> Akses Modul
            </Link>
            <Link to="/galeri" className="btn-ghost bg-white/10 text-sm text-white hover:bg-white/20">
              <Icon name="slides" className="h-4 w-4" /> Galeri Foto
            </Link>
          </div>

          <p className="mt-6 text-xs font-medium tracking-wide text-navy-300">{eventConfig.motto}</p>
        </div>
      </section>

      {/* ── Feature cards ────────────────────────────────────── */}
      <section className={`${SITE_WRAP} py-12 lg:py-16`}>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <Link key={f.title} to={f.to} className="card group flex flex-col gap-3 p-5 transition hover:shadow-lift">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-navy-900 text-gold-300">
                <Icon name={f.icon} className="h-5 w-5" />
              </span>
              <div className="font-display text-lg font-bold text-navy-900">{f.title}</div>
              <p className="text-sm text-navy-500">{f.desc}</p>
              <span className="mt-auto inline-flex items-center gap-1 pt-1 text-sm font-semibold text-navy-700 group-hover:text-gold-600">
                Terokai <Icon name="arrowRight" className="h-4 w-4" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Quick access ─────────────────────────────────────── */}
      <section className="bg-sand-100 py-12 lg:py-16">
        <div className={SITE_WRAP}>
          <div className="flex items-end justify-between gap-4">
            <div>
              <span className="section-eyebrow">Pintu Pantas Anda</span>
              <h2 className="mt-2 font-display text-2xl font-extrabold text-navy-900 sm:text-3xl">Akses Utama Program</h2>
              <p className="mt-1 text-sm text-navy-500">Semua yang anda perlukan, di satu tempat.</p>
            </div>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
            {QUICK_LINKS.map((q) => (
              <Link key={q.title} to={q.to} className="group flex flex-col gap-2 rounded-2xl bg-white p-4 shadow-card transition hover:shadow-lift">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-navy-50 text-navy-700 group-hover:bg-navy-900 group-hover:text-gold-300">
                  <Icon name={q.icon} className="h-5 w-5" />
                </span>
                <div className="text-sm font-bold leading-tight text-navy-900">{q.title}</div>
                <div className="text-[11px] text-navy-400">{q.desc}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6 Work areas teaser ──────────────────────────────── */}
      <section className={`${SITE_WRAP} py-12 lg:py-16`}>
        <div className="max-w-2xl">
          <span className="section-eyebrow">6 Bidang Utama Koperasi</span>
          <h2 className="mt-2 font-display text-2xl font-extrabold text-navy-900 sm:text-3xl">
            {PROMPT_COUNT} prompt praktikal, disusun untuk koperasi
          </h2>
          <p className="mt-3 text-sm text-navy-500 sm:text-base">
            Setiap bidang mengandungi 10 prompt mission yang direka khas untuk kegunaan koperasi secara praktikal.
          </p>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {WORK_AREAS.map((a) => {
            const ac = areaAccent(a.accent);
            return (
              <Link key={a.id} to={`/prompt-hub/${a.id}`} className={`group flex flex-col gap-3 rounded-2xl border p-5 transition hover:shadow-lift ${ac.card}`}>
                <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${ac.badge}`}>
                  <Icon name={a.icon} className="h-5 w-5" />
                </span>
                <div className="font-display text-base font-bold text-navy-900">{a.title}</div>
                <p className="text-xs text-navy-500">{a.blurb}</p>
                <span className="mt-auto inline-flex items-center gap-1 pt-1 text-sm font-semibold text-navy-700 group-hover:text-gold-600">
                  10 Prompt Missions <Icon name="arrowRight" className="h-4 w-4" />
                </span>
              </Link>
            );
          })}
        </div>
        <div className="mt-8 rounded-3xl bg-navy-950 p-6 text-white sm:p-8">
          <div className="grid items-center gap-6 sm:grid-cols-[1fr_auto]">
            <div>
              <h3 className="font-display text-xl font-extrabold sm:text-2xl">Tidak pasti bidang mana untuk bermula?</h3>
              <p className="mt-2 text-sm text-navy-200">
                Lengkapkan AI Readiness Snapshot — {READINESS_AREAS.length} soalan, 2 minit — dan kami cadangkan satu bidang untuk anda mulakan.
              </p>
            </div>
            <Link to="/readiness" className="btn-gold shrink-0">
              Mula Penilaian <Icon name="arrowRight" className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
