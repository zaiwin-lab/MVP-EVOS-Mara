import { eventConfig } from "../config/eventConfig";
import { AGENDA } from "../content/site";
import { SiteLayout, SITE_WRAP, SectionHead } from "../components/SiteChrome";
import { useI18n } from "../context/I18nContext";

/**
 * The day, start to finish.
 *
 * Same ruled timeline the home page used to carry, moved here now that the
 * programme has its own button. Breaks have no description, so their rows stay
 * short rather than being padded out to match the sessions.
 */
export default function Programme() {
  const { t, pick } = useI18n();

  return (
    <SiteLayout>
      <section className={`${SITE_WRAP} py-12 lg:py-16`}>
        <SectionHead
          eyebrow={t("ldTodayEyebrow")}
          title={t("ldTodayTitle")}
          lede={`${eventConfig.time} · ${eventConfig.venue}`}
        />

        <ol className="mx-auto mt-9 max-w-2xl border-l-2 border-slate2-line pl-5 sm:pl-6">
          {AGENDA.map((a, i) => {
            const desc = pick(a.desc);
            return (
              <li key={i} className="relative py-3.5 first:pt-0 last:pb-0">
                <span
                  className="absolute -left-[26px] top-4 h-2.5 w-2.5 rounded-full bg-gold-400 ring-4 ring-[--page] first:top-1 sm:-left-[30px]"
                  aria-hidden="true"
                />
                <div className="font-display text-[12px] font-extrabold tabular-nums tracking-[0.02em] text-gold-700">
                  {a.time}
                </div>
                <div className="mt-0.5 font-display text-[15px] font-bold leading-snug text-navy-950">
                  {pick(a.title)}
                </div>
                {a.speakers && (
                  <div className="mt-1.5">
                    {a.speakerLabel && (
                      <div className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-slate2-dim">
                        {pick(a.speakerLabel)}
                      </div>
                    )}
                    {a.speakers.map((sp) => (
                      <div key={sp.name} className="mt-0.5">
                        <div className="text-[13px] font-bold text-navy-800">{sp.name}</div>
                        {sp.org && <div className="text-[12px] text-slate2-mut">{sp.org}</div>}
                      </div>
                    ))}
                  </div>
                )}
                {desc && <p className="mt-1 text-[13px] leading-relaxed text-slate2-mut">{desc}</p>}
              </li>
            );
          })}
        </ol>

        <p className="mx-auto mt-6 max-w-2xl text-center text-xs text-slate2-dim">{t("pgScheduleNote")}</p>
      </section>
    </SiteLayout>
  );
}
