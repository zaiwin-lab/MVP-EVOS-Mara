import { Link, useNavigate } from "react-router-dom";
import { eventConfig } from "../config/eventConfig";
import { PROGRAMME_DAYS, TRAINERS, RESOURCES } from "../content/programme";
import { INDICATORS } from "../content/assessment";
import { Wordmark, BrandFooter } from "../components/Brand";
import { Icon } from "../components/Icon";
import { useI18n } from "../context/I18nContext";
import { useParticipant } from "../context/ParticipantContext";

const JOURNEY = [
  { icon: "qr", label: "Scan QR" },
  { icon: "checkCircle", label: "Confirm Attendance" },
  { icon: "clipboard", label: "Complete Profile" },
  { icon: "chart", label: "Readiness Assessment" },
  { icon: "target", label: "Personalised Results" },
  { icon: "book", label: "Programme Resources" },
  { icon: "spark", label: "90-Day Action Plan" },
];

export default function Landing() {
  const { t, lang, toggle } = useI18n();
  const { participantId } = useParticipant();
  const navigate = useNavigate();

  return (
    <div className="app-shell flex flex-col">
      {/* ── Hero ───────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-navy-950 px-5 pb-10 pt-5 text-white">
        {/* subtle decorative grid */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-gold-500/20 blur-3xl" />

        <div className="relative">
          <div className="flex items-center justify-between">
            <Wordmark inverted />
            <button
              onClick={toggle}
              className="rounded-full border border-white/20 px-3 py-1 text-xs font-bold text-white/80"
            >
              {lang === "en" ? "BM" : "EN"}
            </button>
          </div>

          <div className="mt-10">
            <span className="section-eyebrow text-gold-300">{eventConfig.module}</span>
            <h1 className="mt-2 font-display text-4xl font-extrabold leading-[1.05] tracking-tight">
              {eventConfig.tagline}
            </h1>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-navy-100">
              {eventConfig.intro}
            </p>
          </div>

          {/* Event meta card */}
          <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
            <div className="text-xs font-bold uppercase tracking-wide text-gold-300">
              Programme Supported
            </div>
            <div className="mt-1 text-lg font-bold leading-tight">
              {eventConfig.eventName}
            </div>
            <div className="text-xs text-navy-200">{eventConfig.eventNameLocal}</div>
            <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
              <div className="flex items-center gap-2">
                <Icon name="calendar" className="h-4 w-4 text-gold-300" />
                <span>{eventConfig.dates}</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="location" className="h-4 w-4 text-gold-300" />
                <span>{eventConfig.venue}</span>
              </div>
            </div>
          </div>

          {/* Primary actions */}
          <div className="mt-6 space-y-3">
            <button
              onClick={() => navigate(participantId ? "/journey" : "/check-in")}
              className="btn-gold w-full text-base"
            >
              {participantId ? t("continue") : t("startJourney")}
              <Icon name="arrowRight" className="h-5 w-5" />
            </button>
            <div className="grid grid-cols-2 gap-3">
              <Link to="/programme" className="btn-ghost bg-white/10 text-white text-sm hover:bg-white/20">
                {t("viewProgramme")}
              </Link>
              <Link to="/trainers" className="btn-ghost bg-white/10 text-white text-sm hover:bg-white/20">
                {t("meetTrainers")}
              </Link>
            </div>
          </div>

          <div className="mt-5 flex items-center justify-center gap-2 text-[11px] text-navy-300">
            <span>Organised by {eventConfig.organiser}</span>
          </div>
          <div className="text-center text-[11px] text-navy-300">
            In collaboration with{" "}
            <a
              href={eventConfig.collaboratorUrl}
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-gold-300 underline decoration-gold-300/40 underline-offset-2 hover:text-gold-200"
            >
              {eventConfig.collaborator}
            </a>
          </div>
        </div>
      </section>

      {/* ── Programme overview ─────────────────────────────── */}
      <section className="px-5 py-8">
        <span className="section-eyebrow">Programme Overview</span>
        <h2 className="mt-1 font-display text-2xl font-extrabold text-navy-900">
          Three days. One transformation.
        </h2>
        <p className="mt-2 text-sm text-navy-500">
          A practical programme to strengthen Bumiputera contractors — from
          business foundations to winning tenders and digital growth.
        </p>

        <div className="mt-5 space-y-3">
          {PROGRAMME_DAYS.map((d) => (
            <Link
              key={d.day}
              to="/programme"
              className="card flex items-center gap-4 p-4 transition hover:shadow-lift"
            >
              <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl bg-navy-800 text-white">
                <span className="text-[9px] font-semibold uppercase text-gold-300">Day</span>
                <span className="text-lg font-extrabold leading-none">{d.day}</span>
              </div>
              <div className="min-w-0">
                <div className="truncate font-bold text-navy-900">{d.title}</div>
                <div className="text-xs text-navy-400">{d.date} · {d.theme}</div>
              </div>
              <Icon name="arrowRight" className="ml-auto h-5 w-5 shrink-0 text-navy-300" />
            </Link>
          ))}
        </div>
      </section>

      {/* ── Participant journey ────────────────────────────── */}
      <section className="bg-sand-100 px-5 py-8">
        <span className="section-eyebrow">Your Journey</span>
        <h2 className="mt-1 font-display text-2xl font-extrabold text-navy-900">
          One scan starts everything
        </h2>
        <div className="mt-5 space-y-2.5">
          {JOURNEY.map((step, i) => (
            <div key={step.label} className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-navy-700 shadow-sm">
                <Icon name={step.icon} className="h-4 w-4" />
              </div>
              <span className="text-sm font-semibold text-navy-800">{step.label}</span>
              {i < JOURNEY.length - 1 && (
                <span className="ml-auto text-xs text-navy-300">↓</span>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── Readiness indicators teaser ────────────────────── */}
      <section className="px-5 py-8">
        <span className="section-eyebrow">Contractor Readiness Assessment</span>
        <h2 className="mt-1 font-display text-2xl font-extrabold text-navy-900">
          Know exactly where you stand
        </h2>
        <p className="mt-2 text-sm text-navy-500">
          Five indicators. A score out of 100. Personalised, developmental
          recommendations you can act on immediately.
        </p>
        <div className="mt-5 grid grid-cols-1 gap-2.5">
          {INDICATORS.map((ind) => (
            <div key={ind.id} className="flex items-center gap-3 rounded-xl border border-navy-100 bg-white p-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold-50 text-gold-600">
                <Icon name={ind.icon} className="h-5 w-5" />
              </div>
              <span className="text-sm font-semibold text-navy-800">{ind.title}</span>
              <span className="ml-auto text-xs font-bold text-navy-300">/20</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Trainers ───────────────────────────────────────── */}
      <section className="bg-navy-950 px-5 py-8 text-white">
        <span className="section-eyebrow text-gold-300">Meet the Trainers</span>
        <h2 className="mt-1 font-display text-2xl font-extrabold">
          Learn from industry leaders
        </h2>
        <div className="mt-5 space-y-3">
          {TRAINERS.map((tr) => (
            <div key={tr.name} className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold-400 font-extrabold text-navy-900">
                  {tr.initials}
                </div>
                <div className="min-w-0">
                  <div className="font-bold">{tr.name}</div>
                  <div className="text-xs text-gold-300">{tr.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <Link to="/trainers" className="btn-ghost mt-4 w-full bg-white/10 text-white hover:bg-white/20">
          {t("meetTrainers")}
          <Icon name="arrowRight" className="h-4 w-4" />
        </Link>
      </section>

      {/* ── Quick access resources ─────────────────────────── */}
      <section className="px-5 py-8">
        <span className="section-eyebrow">Quick Access</span>
        <h2 className="mt-1 font-display text-2xl font-extrabold text-navy-900">
          Programme resources
        </h2>
        <div className="mt-5 grid grid-cols-2 gap-3">
          {RESOURCES.slice(0, 4).map((r) => (
            <Link
              key={r.id}
              to="/resources"
              className="card flex flex-col gap-2 p-4 transition hover:shadow-lift"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-navy-50 text-navy-700">
                <Icon name={r.icon} className="h-5 w-5" />
              </div>
              <span className="text-sm font-bold leading-tight text-navy-900">{r.title}</span>
            </Link>
          ))}
        </div>
        <Link to="/resources" className="btn-outline mt-4 w-full">
          {t("resources")}
          <Icon name="arrowRight" className="h-4 w-4" />
        </Link>
      </section>

      <BrandFooter />
    </div>
  );
}
