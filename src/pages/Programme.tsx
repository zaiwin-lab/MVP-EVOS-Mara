import { Link } from "react-router-dom";
import { eventConfig } from "../config/eventConfig";
import { AGENDA } from "../content/site";
import { SiteLayout, SITE_WRAP, PageHero } from "../components/SiteChrome";
import { Icon } from "../components/Icon";
import { useI18n } from "../context/I18nContext";

export default function Programme() {
  const { t, pick } = useI18n();
  return (
    <SiteLayout>
      <PageHero eyebrow={t("pgEyebrow")} title={t("pgTitle")} lede={t("pgIntro")}>
        <div className="mt-6 flex flex-wrap gap-2 text-xs">
          <span className="chip border border-white/10 bg-white/10 text-white"><Icon name="calendar" className="h-3.5 w-3.5 text-gold-400" /> {eventConfig.dates} · {eventConfig.weekday}</span>
          <span className="chip border border-white/10 bg-white/10 text-white"><Icon name="clock" className="h-3.5 w-3.5 text-gold-400" /> {eventConfig.time}</span>
          <span className="chip border border-white/10 bg-white/10 text-white"><Icon name="location" className="h-3.5 w-3.5 text-gold-400" /> {eventConfig.venue}</span>
        </div>
      </PageHero>

      <section className={`${SITE_WRAP} py-12`}>
        <ol className="relative space-y-3 border-l-2 border-navy-100 pl-6">
          {AGENDA.map((a, i) => (
            <li key={i} className="relative">
              <span className="absolute -left-[31px] flex h-5 w-5 items-center justify-center rounded-full bg-gold-400 text-[10px] font-bold text-navy-900">
                {i + 1}
              </span>
              <div className="card p-4 sm:p-5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="chip bg-navy-900 text-white">{a.time}</span>
                  <span className="font-display text-base font-bold text-navy-900">{pick(a.title)}</span>
                </div>
                <p className="mt-1.5 text-sm text-navy-500">{pick(a.desc)}</p>
              </div>
            </li>
          ))}
        </ol>

        <p className="mt-6 rounded-xl bg-sand-100 px-4 py-3 text-xs text-navy-500">{t("pgScheduleNote")}</p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link to="/check-in" className="btn-gold">{t("ctaRegisterCheckIn")} <Icon name="arrowRight" className="h-5 w-5" /></Link>
          <Link to="/prompt-hub" className="btn-outline">{t("ctaExplorePromptHub")}</Link>
        </div>
      </section>
    </SiteLayout>
  );
}
