import { Link } from "react-router-dom";
import { eventConfig } from "../config/eventConfig";
import { FEATURES, QUICK_LINKS } from "../content/site";
import { WORK_AREAS, PROMPT_COUNT } from "../content/promptLibrary";
import { READINESS_AREAS } from "../content/readiness";
import { SiteLayout, SITE_WRAP } from "../components/SiteChrome";
import { Icon } from "../components/Icon";
import { areaAccent } from "../lib/accents";
import { useI18n } from "../context/I18nContext";

/** Hero meta strip. Labels with a key are resolved at render time. */
const META = [
  { icon: "calendar", label: eventConfig.dates, sub: eventConfig.weekday },
  { icon: "location", label: eventConfig.venue, sub: eventConfig.venueCity },
  { icon: "users", labelKey: "metaParticipants", labelN: eventConfig.expectedParticipants, subKey: "metaLimitedPlaces" },
  { icon: "team", labelKey: "metaReps", labelN: eventConfig.maxPerCoop, subKey: "metaPerCoop" },
] as const;

export default function Landing() {
  const { t, pick } = useI18n();
  return (
    <SiteLayout>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="hero-glow relative overflow-hidden bg-navy-950 text-white">
        <div className="hero-grid pointer-events-none absolute inset-0" />

        <div className={`relative ${SITE_WRAP} py-14 lg:py-20`}>
          <span className="inline-flex items-center gap-2 rounded-full border border-gold-400/25 bg-gold-400/10 px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.14em] text-gold-300">
            <span className="h-1.5 w-1.5 rounded-full bg-gold-400" aria-hidden="true" />
            {pick(eventConfig.heroKicker)}
          </span>

          <h1 className="h-display mt-5 max-w-4xl text-[38px] sm:text-[54px] lg:text-[64px]">
            <span className="block text-white">{pick(eventConfig.heroLines[0])}</span>
            <span className="grad-text block">{pick(eventConfig.heroLines[1])}</span>
            <span className="block text-white">{pick(eventConfig.heroLines[2])}</span>
          </h1>

          <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-white/60 sm:text-[17px]">
            {pick(eventConfig.heroSubline)}
          </p>

          {/* Event meta */}
          {/* CTAs */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <Link to="/check-in" className="btn-gold px-7 py-3.5 text-base">
              {t("ldStartJourney")}
              <Icon name="arrowRight" className="h-5 w-5" />
            </Link>
            <Link to="/sumber" className="btn-on-dark">
              <Icon name="book" className="h-4 w-4" /> {t("ldAccessModules")}
            </Link>
            <Link to="/galeri" className="btn-on-dark">
              <Icon name="slides" className="h-4 w-4" /> {t("ldPhotoGallery")}
            </Link>
          </div>

          {/* Facts, under a hairline — the Sales Portal stat-row device. */}
          <div className="mt-10 border-t border-white/10 pt-6">
            <dl className="grid grid-cols-2 gap-x-6 gap-y-5 sm:flex sm:flex-wrap sm:gap-x-12">
              {META.map((m) => {
                const label = "labelKey" in m ? t(m.labelKey).replace("{n}", String(m.labelN)) : m.label;
                const sub = "subKey" in m ? t(m.subKey) : m.sub;
                return (
                  <div key={m.icon}>
                    <dt className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-white/40">
                      <Icon name={m.icon} className="h-3.5 w-3.5 text-gold-400" />
                      {sub}
                    </dt>
                    <dd className="mt-1.5 text-[15px] font-bold leading-tight text-white">{label}</dd>
                  </div>
                );
              })}
            </dl>
          </div>
        </div>
      </section>

      {/* ── Feature cards ────────────────────────────────────── */}
      <section className={`${SITE_WRAP} py-14 lg:py-20`}>
        <div className="mx-auto max-w-2xl text-center">
          <span className="section-eyebrow">{t("ldFeatEyebrow")}</span>
          <h2 className="h-section mt-4">{t("ldFeatTitle")}</h2>
          <p className="lede mx-auto mt-3 max-w-xl">{t("ldFeatDesc")}</p>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <Link key={f.to + pick(f.title)} to={f.to} className="card-hover group flex flex-col gap-3 p-6">
              <span className="icon-tile h-11 w-11 bg-gold-400/12 text-gold-600 ring-1 ring-inset ring-gold-400/20">
                <Icon name={f.icon} className="h-5 w-5" />
              </span>
              <div className="font-display text-[17px] font-extrabold tracking-[-0.01em] text-navy-950">{pick(f.title)}</div>
              <p className="text-sm leading-relaxed text-slate2-mut">{pick(f.desc)}</p>
              <span className="mt-auto inline-flex items-center gap-1 pt-1 text-[13px] font-bold text-navy-700 transition group-hover:gap-2 group-hover:text-gold-600">
                {t("ldExplore")} <Icon name="arrowRight" className="h-4 w-4" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Quick access ─────────────────────────────────────── */}
      <section className="border-y border-slate2-line bg-white py-14 lg:py-20">
        <div className={SITE_WRAP}>
          <div className="mx-auto max-w-2xl text-center">
            <span className="section-eyebrow">{t("ldQuickEyebrow")}</span>
            <h2 className="h-section mt-4">{t("ldQuickTitle")}</h2>
            <p className="lede mx-auto mt-3 max-w-lg">{t("ldQuickDesc")}</p>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
            {QUICK_LINKS.map((q) => (
              <Link
                key={q.to + pick(q.title)}
                to={q.to}
                className="group flex flex-col gap-2.5 rounded-2xl border border-slate2-line bg-sand-50 p-4 transition hover:-translate-y-0.5 hover:border-gold-200 hover:bg-white hover:shadow-lift"
              >
                <span className="icon-tile h-10 w-10 bg-white text-navy-700 ring-1 ring-inset ring-slate2-line transition group-hover:bg-navy-950 group-hover:text-gold-300 group-hover:ring-navy-950">
                  <Icon name={q.icon} className="h-5 w-5" />
                </span>
                <div className="text-[13.5px] font-bold leading-tight text-navy-950">{pick(q.title)}</div>
                <div className="text-[11px] leading-snug text-slate2-dim">{pick(q.desc)}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6 Work areas teaser ──────────────────────────────── */}
      <section className={`${SITE_WRAP} py-14 lg:py-20`}>
        <div className="mx-auto max-w-2xl text-center">
          <span className="section-eyebrow">{t("ldAreasEyebrow")}</span>
          <h2 className="h-section mt-4">{t("ldAreasTitle").replace("{n}", String(PROMPT_COUNT))}</h2>
          <p className="lede mx-auto mt-3 max-w-xl">{t("ldAreasDesc")}</p>
        </div>

        {/* Numbered grid — the ordinals are real: the areas run A to F and the
            prompts inside them are numbered from those letters. */}
        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {WORK_AREAS.map((a) => {
            const ac = areaAccent(a.accent);
            return (
              <Link key={a.id} to={`/prompt-hub/${a.id}`} className="card-hover group flex flex-col gap-3 p-5">
                <div className="flex items-center justify-between gap-3">
                  <span className={`icon-tile h-10 w-10 ${ac.badge}`}>
                    <Icon name={a.icon} className="h-5 w-5" />
                  </span>
                  <span className="ordinal">{a.code}0{a.missions.length === 10 ? "" : a.missions.length}</span>
                </div>
                <div className="font-display text-[15.5px] font-extrabold tracking-[-0.01em] text-navy-950">{pick(a.title)}</div>
                <p className="text-[13px] leading-relaxed text-slate2-mut">{pick(a.blurb)}</p>
                <span className="mt-auto inline-flex items-center gap-1 pt-1 text-[12.5px] font-bold text-navy-700 transition group-hover:gap-2 group-hover:text-gold-600">
                  {t("ldMissionsChip")} <Icon name="arrowRight" className="h-4 w-4" />
                </span>
              </Link>
            );
          })}
        </div>

        {/* Closing panel — a navy block inside the light section. */}
        <div className="panel-dark hero-glow mt-10 p-7 sm:p-10">
          <div className="hero-grid pointer-events-none absolute inset-0" />
          <div className="relative grid items-center gap-6 sm:grid-cols-[1fr_auto]">
            <div>
              <h3 className="h-display text-[23px] sm:text-[30px]">{t("ldUnsureTitle")}</h3>
              <p className="mt-3 max-w-xl text-[14.5px] leading-relaxed text-white/60">
                {t("ldUnsureDesc").replace("{n}", String(READINESS_AREAS.length))}
              </p>
            </div>
            <Link to="/readiness" className="btn-gold shrink-0 px-6 py-3.5">
              {t("phStartAssessment")} <Icon name="arrowRight" className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
