import { useState } from "react";
import { Link } from "react-router-dom";
import { eventConfig } from "../config/eventConfig";
import { FAQS } from "../content/site";
import { WORK_AREAS } from "../content/promptLibrary";
import { SiteLayout, SITE_WRAP, SectionHead } from "../components/SiteChrome";
import { Icon } from "../components/Icon";
import { areaAccent } from "../lib/accents";
import { useI18n } from "../context/I18nContext";

/**
 * The home page answers four questions and stops:
 * where do I check in, what is happening today, which prompts are for me,
 * and where are the modules.
 *
 * It used to answer them several times over — a feature grid, a quick-access
 * grid and a work-area grid all led to the same places. Six ways into the same
 * content is not six times the help; it is a decision the reader has to make
 * before they can start.
 */

const HOME_FAQS = FAQS.filter((f) => f.home);

export default function Landing() {
  const { t, pick } = useI18n();

  return (
    <SiteLayout>
      {/* ── 1 · Hero ─────────────────────────────────────────── */}
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

          {/* The four things a participant comes here to do. Start My Journey
              is the primary — it is what happens on arrival — and the other
              three carry the same weight as each other. */}
          <div className="mt-9 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
            <AccessTile to="/register" icon="qr" label={t("ldStartJourneyCta")} desc={t("ldStartJourneyDesc")} primary />
            <AccessTile to="/program" icon="calendar" label={t("navProgramme")} desc={t("ldProgrammeDesc")} />
            <AccessTile to="/trainers" icon="team" label={t("navTrainers")} desc={t("ldTrainersDesc")} />
            <AccessTile to="/sumber" icon="book" label={t("navModules")} desc={t("ldModulesCardDesc")} />
          </div>

          {/* Where and when, on one line rather than as a four-column stat rack. */}
          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-white/10 pt-6 text-[13.5px] font-semibold text-white/70">
            <span className="inline-flex items-center gap-2">
              <Icon name="calendar" className="h-4 w-4 shrink-0 text-gold-400" />
              {eventConfig.dates}
            </span>
            <span className="inline-flex items-center gap-2">
              <Icon name="location" className="h-4 w-4 shrink-0 text-gold-400" />
              {eventConfig.venue}, {eventConfig.venueCity}
            </span>
            <span className="inline-flex items-center gap-2 text-white/45">
              {eventConfig.partners.map((p) => p.name).join(" × ")}
            </span>
          </div>
        </div>
      </section>

      {/* ── 3 · The six work areas — the centrepiece ──────────── */}
      <section className="border-y border-slate2-line bg-white py-12 lg:py-16">
        <div className={SITE_WRAP}>
          <SectionHead
            eyebrow={t("ldToolkitEyebrow")}
            title={t("ldToolkitTitle")}
            lede={t("ldToolkitDesc")}
          />

          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {WORK_AREAS.map((a) => {
              const ac = areaAccent(a.accent);
              return (
                <Link key={a.id} to={`/prompt-hub/${a.id}`} className="card-hover group flex flex-col gap-3 p-5">
                  <div className="flex items-center justify-between gap-3">
                    <span className={`icon-tile h-11 w-11 ${ac.badge}`}>
                      <Icon name={a.icon} className="h-5 w-5" />
                    </span>
                    <span className="ordinal">{a.code}</span>
                  </div>
                  <div className="font-display text-[15.5px] font-extrabold tracking-[-0.01em] text-navy-950">
                    {pick(a.title)}
                  </div>
                  <p className="text-[13px] leading-relaxed text-slate2-mut">{pick(a.blurb)}</p>
                  <span className="mt-auto inline-flex items-center gap-1 pt-1 text-[12.5px] font-bold text-navy-700 transition group-hover:gap-2 group-hover:text-gold-600">
                    {t("ldMissionsChip")} <Icon name="arrowRight" className="h-4 w-4" />
                  </span>
                </Link>
              );
            })}
          </div>

          {/* ── 4 · Not sure where to start? ──────────────────── */}
          <div className="mx-auto mt-10 flex max-w-3xl flex-col items-start gap-4 rounded-2xl border border-slate2-line bg-sand-50 p-6 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
            <div className="flex items-start gap-3">
              <span className="icon-tile h-10 w-10 shrink-0 bg-gold-100 text-gold-700 ring-1 ring-inset ring-gold-200">
                <Icon name="spark" className="h-5 w-5" />
              </span>
              <div>
                <h3 className="font-display text-[15.5px] font-extrabold text-navy-950">{t("phUnsure")}</h3>
                <p className="mt-0.5 text-[13px] leading-relaxed text-slate2-mut">{t("rdShortIntro")}</p>
              </div>
            </div>
            <Link to="/readiness" className="btn-outline shrink-0 text-sm">
              {t("rdUnsureCta")} <Icon name="arrowRight" className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── 5 · Take it home ─────────────────────────────────── */}
      <section className={`${SITE_WRAP} py-12 lg:py-16`}>
        <SectionHead eyebrow={t("ldTakeEyebrow")} title={t("ldTakeTitle")} />

        <div className="mx-auto mt-10 grid max-w-3xl gap-4 sm:grid-cols-2">
          <Link to="/sumber" className="card-hover group flex flex-col gap-3 p-6">
            <span className="icon-tile h-11 w-11 bg-navy-900 text-gold-300">
              <Icon name="book" className="h-5 w-5" />
            </span>
            <div className="font-display text-[17px] font-extrabold tracking-[-0.01em] text-navy-950">
              {t("navModules")}
            </div>
            <p className="text-sm leading-relaxed text-slate2-mut">{t("ldModulesCardDesc")}</p>
            <span className="mt-auto inline-flex items-center gap-1 pt-1 text-[13px] font-bold text-navy-700 transition group-hover:gap-2 group-hover:text-gold-600">
              {t("ldExplore")} <Icon name="arrowRight" className="h-4 w-4" />
            </span>
          </Link>

          <Link to="/galeri" className="card-hover group flex flex-col gap-3 p-6">
            <span className="icon-tile h-11 w-11 bg-navy-900 text-gold-300">
              <Icon name="slides" className="h-5 w-5" />
            </span>
            <div className="font-display text-[17px] font-extrabold tracking-[-0.01em] text-navy-950">
              {t("navGallery")}
            </div>
            <p className="text-sm leading-relaxed text-slate2-mut">{t("ldGalleryCardDesc")}</p>
            <span className="mt-auto inline-flex items-center gap-1 pt-1 text-[13px] font-bold text-navy-700 transition group-hover:gap-2 group-hover:text-gold-600">
              {t("ldExplore")} <Icon name="arrowRight" className="h-4 w-4" />
            </span>
          </Link>
        </div>
      </section>

      {/* ── 6 · Three questions, no FAQ page ─────────────────── */}
      <section id="faq" className="scroll-mt-20 border-t border-slate2-line bg-white py-12 lg:py-16">
        <div className={SITE_WRAP}>
          <SectionHead eyebrow={t("ldFaqEyebrow")} title={t("faqTitle")} />
          <div className="mx-auto mt-9 max-w-2xl space-y-2.5">
            {HOME_FAQS.map((f, i) => (
              <FaqRow key={i} q={pick(f.q)} a={pick(f.a)} defaultOpen={i === 0} />
            ))}
          </div>
        </div>
      </section>

    </SiteLayout>
  );
}

/** One of the four programme access tiles in the hero. */
function AccessTile({
  to, icon, label, desc, primary = false,
}: {
  to: string; icon: string; label: string; desc: string; primary?: boolean;
}) {
  return (
    <Link
      to={to}
      className={`group flex flex-col gap-2 rounded-2xl p-4 text-left transition ${
        primary
          ? "text-navy-950 shadow-gold hover:brightness-[1.06]"
          : "border border-white/[0.14] bg-white/[0.07] text-white hover:border-white/25 hover:bg-white/[0.12]"
      }`}
      style={primary ? { backgroundImage: "var(--grad-btn)" } : undefined}
    >
      <span
        className={`icon-tile h-9 w-9 ${
          primary ? "bg-navy-950/10 text-navy-900" : "bg-white/10 text-gold-300"
        }`}
      >
        <Icon name={icon} className="h-[18px] w-[18px]" />
      </span>
      <span className="font-display text-[15px] font-extrabold tracking-[-0.01em]">{label}</span>
      <span className={`text-[12.5px] leading-snug ${primary ? "text-navy-900/70" : "text-white/55"}`}>
        {desc}
      </span>
    </Link>
  );
}

/** One collapsible question. Three of these replace a page. */
function FaqRow({ q, a, defaultOpen }: { q: string; a: string; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(Boolean(defaultOpen));
  return (
    <div className="card overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
      >
        <span className="font-display text-[14.5px] font-bold text-navy-950">{q}</span>
        <Icon
          name="arrowRight"
          className={`h-4 w-4 shrink-0 text-slate2-dim transition-transform ${open ? "rotate-90" : ""}`}
        />
      </button>
      {open && <p className="px-5 pb-5 text-[13.5px] leading-relaxed text-slate2-mut">{a}</p>}
    </div>
  );
}
