import { Link, useNavigate } from "react-router-dom";
import { eventConfig } from "../config/eventConfig";
import { PROGRAMME_DAYS, TRAINERS, RESOURCES } from "../content/programme";
import { INDICATORS } from "../content/assessment";
import { Wordmark, BrandFooter } from "../components/Brand";
import { Icon } from "../components/Icon";
import { LangToggle } from "../components/LangToggle";
import { useI18n } from "../context/I18nContext";
import { useParticipant } from "../context/ParticipantContext";

const JOURNEY = [
  { icon: "qr", key: "jScanQr" },
  { icon: "checkCircle", key: "jConfirm" },
  { icon: "clipboard", key: "jProfile" },
  { icon: "chart", key: "jAssessment" },
  { icon: "target", key: "jResults" },
  { icon: "book", key: "jResources" },
  { icon: "spark", key: "jActionPlan" },
] as const;

// Centered content container used by every section.
const WRAP = "mx-auto w-full max-w-6xl px-5 sm:px-8";

export default function Landing() {
  const { t, pick, term } = useI18n();
  const { participantId } = useParticipant();
  const navigate = useNavigate();

  return (
    <div className="flex min-h-dvh flex-col bg-white">
      {/* ── Hero ───────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-navy-950 text-white">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-gold-500/20 blur-3xl" />

        <div className={`relative ${WRAP} pb-12 pt-5`}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Wordmark inverted />
            <div className="flex items-center gap-2">
              <LangToggle tone="dark" />
              <Link
                to={participantId ? "/my" : "/login"}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/20 px-3 py-1.5 text-xs font-bold text-white/90 hover:bg-white/10"
              >
                <Icon name="users" className="h-4 w-4" />
                <span>{t("myAttendify")}</span>
              </Link>
              <Link
                to="/admin"
                className="inline-flex items-center gap-1.5 rounded-full border border-white/20 px-3 py-1.5 text-xs font-bold text-white/70 hover:bg-white/10"
                title={t("admin")}
              >
                <Icon name="lock" className="h-4 w-4" />
                <span className="hidden sm:inline">{t("admin")}</span>
              </Link>
            </div>
          </div>

          <div className="mt-10 grid items-center gap-8 lg:mt-14 lg:grid-cols-2 lg:gap-12">
            <div>
              <span className="section-eyebrow text-gold-300">{eventConfig.module}</span>
              <h1 className="mt-3 font-display text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
                {eventConfig.tagline}
              </h1>
              <p className="mt-5 max-w-xl text-sm leading-relaxed text-navy-100 sm:text-base">
                {pick(eventConfig.introLocalized)}
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <button
                  onClick={() => navigate(participantId ? "/my" : "/register")}
                  className="btn-gold text-base sm:px-8"
                >
                  {participantId ? t("continue") : t("startJourney")}
                  <Icon name="arrowRight" className="h-5 w-5" />
                </button>
                <Link to="/programme" className="btn-ghost bg-white/10 text-sm text-white hover:bg-white/20">
                  {t("viewProgramme")}
                </Link>
                <Link to="/trainers" className="btn-ghost bg-white/10 text-sm text-white hover:bg-white/20">
                  {t("meetTrainers")}
                </Link>
              </div>

              <div className="mt-6 text-[11px] text-navy-300 sm:text-xs">
                {t("configuredNote")}
              </div>
            </div>

            {/* Event meta card */}
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur lg:p-8">
              <div className="text-xs font-bold uppercase tracking-wide text-gold-300">
                {t("programmeSupported")}
              </div>
              <div className="mt-2 font-display text-2xl font-bold leading-tight lg:text-3xl">
                {eventConfig.eventName}
              </div>
              <div className="mt-1 text-sm text-navy-200">{eventConfig.eventNameLocal}</div>
              <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="flex items-center gap-2 text-gold-300">
                    <Icon name="calendar" className="h-4 w-4" />
                    <span className="text-[11px] font-bold uppercase tracking-wide">{t("datesLabel")}</span>
                  </div>
                  <div className="mt-1 font-semibold">{eventConfig.dates}</div>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-gold-300">
                    <Icon name="location" className="h-4 w-4" />
                    <span className="text-[11px] font-bold uppercase tracking-wide">{t("venueLabel")}</span>
                  </div>
                  <div className="mt-1 font-semibold">{eventConfig.venue}</div>
                </div>
              </div>
              <div className="mt-6 border-t border-white/10 pt-4 text-xs text-navy-300">
                {t("organisedBy")} {eventConfig.organiser} · {t("inCollaborationWith")}{" "}
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
          </div>
        </div>
      </section>

      {/* ── Programme overview ─────────────────────────────── */}
      <section className={`${WRAP} py-12 lg:py-16`}>
        <div className="max-w-2xl">
          <span className="section-eyebrow">{t("programmeOverview")}</span>
          <h2 className="mt-2 font-display text-2xl font-extrabold text-navy-900 sm:text-3xl">
            {t("threeDaysHeading")}
          </h2>
          <p className="mt-3 text-sm text-navy-500 sm:text-base">{t("programmeOverviewDesc")}</p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {PROGRAMME_DAYS.map((d) => (
            <Link
              key={d.day}
              to="/programme"
              className="card group flex flex-col p-5 transition hover:shadow-lift"
            >
              <div className="flex h-12 w-12 flex-col items-center justify-center rounded-xl bg-navy-800 text-white">
                <span className="text-[9px] font-semibold uppercase text-gold-300">{t("dayLabel")}</span>
                <span className="text-lg font-extrabold leading-none">{d.day}</span>
              </div>
              <div className="mt-4 font-display text-lg font-bold text-navy-900">
                {d.titleI18n ? pick(d.titleI18n) : d.title}
              </div>
              <div className="mt-1 text-xs text-navy-400">{d.date}</div>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {d.topics.slice(0, 3).map((topic) => (
                  <span key={topic} className="chip bg-navy-50 text-navy-600">
                    {term(topic)}
                  </span>
                ))}
              </div>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-navy-700 group-hover:text-gold-600">
                {t("viewDay")} <Icon name="arrowRight" className="h-4 w-4" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Participant journey ────────────────────────────── */}
      <section className="bg-sand-100 py-12 lg:py-16">
        <div className={WRAP}>
          <div className="max-w-2xl">
            <span className="section-eyebrow">{t("yourJourney")}</span>
            <h2 className="mt-2 font-display text-2xl font-extrabold text-navy-900 sm:text-3xl">
              {t("oneScanHeading")}
            </h2>
          </div>
          <ol className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-7">
            {JOURNEY.map((step, i) => (
              <li
                key={step.key}
                className="flex items-center gap-3 rounded-2xl bg-white p-3 shadow-sm lg:flex-col lg:items-start lg:gap-3 lg:p-4"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-navy-800 text-white">
                  <Icon name={step.icon} className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] font-bold uppercase text-gold-600">
                    {t("stepLabel")} {i + 1}
                  </div>
                  <div className="text-sm font-semibold leading-tight text-navy-800">
                    {t(step.key)}
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── Readiness indicators ───────────────────────────── */}
      <section className={`${WRAP} py-12 lg:py-16`}>
        <div className="max-w-2xl">
          <span className="section-eyebrow">{t("contractorReadinessAssessment")}</span>
          <h2 className="mt-2 font-display text-2xl font-extrabold text-navy-900 sm:text-3xl">
            {t("knowWhereYouStand")}
          </h2>
          <p className="mt-3 text-sm text-navy-500 sm:text-base">{t("indicatorsDesc")}</p>
        </div>
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {INDICATORS.map((ind) => (
            <div key={ind.id} className="card flex flex-col gap-3 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gold-50 text-gold-600">
                <Icon name={ind.icon} className="h-5 w-5" />
              </div>
              <span className="text-sm font-bold leading-tight text-navy-800">
                {ind.titleI18n ? pick(ind.titleI18n) : ind.title}
              </span>
              <span className="mt-auto text-xs font-bold text-navy-300">{t("scoredOutOf20")}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Trainers ───────────────────────────────────────── */}
      <section className="bg-navy-950 py-12 text-white lg:py-16">
        <div className={WRAP}>
          <div className="max-w-2xl">
            <span className="section-eyebrow text-gold-300">{t("meetTrainers")}</span>
            <h2 className="mt-2 font-display text-2xl font-extrabold sm:text-3xl">
              {t("learnFromLeaders")}
            </h2>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {TRAINERS.map((tr) => (
              <div key={tr.name} className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gold-400 text-xl font-extrabold text-navy-900">
                    {tr.initials}
                  </div>
                  <div className="min-w-0">
                    <div className="font-display text-lg font-bold">{tr.name}</div>
                    <div className="text-xs font-bold text-gold-300">
                      {tr.roleI18n ? pick(tr.roleI18n) : tr.role}
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {tr.focusAreas.slice(0, 4).map((f) => (
                    <span key={f} className="chip bg-white/10 text-navy-100">
                      {term(f)}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <Link to="/trainers" className="btn-ghost mt-6 bg-white/10 text-white hover:bg-white/20">
            {t("meetTrainers")}
            <Icon name="arrowRight" className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* ── Resources ──────────────────────────────────────── */}
      <section className={`${WRAP} py-12 lg:py-16`}>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <span className="section-eyebrow">{t("quickAccess")}</span>
            <h2 className="mt-2 font-display text-2xl font-extrabold text-navy-900 sm:text-3xl">
              {t("programmeResourcesTitle")}
            </h2>
          </div>
          <a
            href={eventConfig.resourcesDriveUrl}
            target="_blank"
            rel="noreferrer"
            className="btn-outline text-sm"
          >
            {t("allResources")}
            <Icon name="arrowRight" className="h-4 w-4" />
          </a>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
          {RESOURCES.slice(0, 8).map((r) => (
            <Link
              key={r.id}
              to="/resources"
              className="card flex flex-col gap-3 p-4 transition hover:shadow-lift"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-navy-50 text-navy-700">
                <Icon name={r.icon} className="h-5 w-5" />
              </div>
              <span className="text-sm font-bold leading-tight text-navy-900">
                {r.titleI18n ? pick(r.titleI18n) : r.title}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <BrandFooter />
    </div>
  );
}
