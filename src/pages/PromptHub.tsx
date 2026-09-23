import { Link } from "react-router-dom";
import { WORK_AREAS, PROMPT_COUNT } from "../content/promptLibrary";
import { SiteLayout, SITE_WRAP, PageHero } from "../components/SiteChrome";
import { Icon } from "../components/Icon";
import { areaAccent } from "../lib/accents";
import { useI18n, pick as pickLang } from "../context/I18nContext";

const STEPS = [
  { n: 1, titleKey: "phStep1", descKey: "phStep1Desc" },
  { n: 2, titleKey: "phStep2", descKey: "phStep2Desc" },
  { n: 3, titleKey: "phStep3", descKey: "phStep3Desc" },
] as const;

export default function PromptHub() {
  const { t, pick, lang } = useI18n();

  return (
    <SiteLayout>
      <PageHero
        eyebrow={t("phEyebrow")}
        title={t("phTitle")}
        lede={t("phIntro").replace("{n}", String(PROMPT_COUNT))}
      >
        <div className="mt-7 grid gap-3 sm:grid-cols-3">
          {STEPS.map((s) => (
            <div key={s.n} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.06] p-4">
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-gold-400 text-[13px] font-extrabold text-navy-950">{s.n}</span>
              <div>
                <div className="text-[13.5px] font-bold">{t(s.titleKey)}</div>
                <div className="mt-0.5 text-[12px] leading-relaxed text-white/55">{t(s.descKey)}</div>
              </div>
            </div>
          ))}
        </div>
      </PageHero>

      <section className={`${SITE_WRAP} py-12`}>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {WORK_AREAS.map((a) => {
            const ac = areaAccent(a.accent);
            return (
              <Link key={a.id} to={`/prompt-hub/${a.id}`} className={`group relative flex flex-col gap-3 rounded-2xl border p-5 transition hover:shadow-lift ${ac.card}`}>
                <span className={`flex h-12 w-12 items-center justify-center rounded-xl ${ac.badge}`}>
                  <Icon name={a.icon} className="h-6 w-6" />
                </span>
                <div>
                  <div className="font-display text-base font-bold text-navy-900">{pick(a.title)}</div>
                  {lang !== "en" && lang !== "zh" && (
                    <div className="text-[11px] font-semibold uppercase tracking-wide text-navy-300">{pickLang(a.title, "en")}</div>
                  )}
                </div>
                <p className="text-sm text-navy-500">{pick(a.blurb)}</p>
                <span className={`mt-auto inline-flex items-center gap-1 pt-1 text-sm font-bold ${ac.text}`}>
                  {t("phSeeTen")} <Icon name="arrowRight" className="h-4 w-4" />
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
              <h3 className="font-display text-base font-bold text-navy-900">{t("phUnsure")}</h3>
              <p className="text-sm text-navy-500">{t("rdShortIntro")}</p>
            </div>
          </div>
          <Link to="/readiness" className="btn-gold shrink-0">{t("rdUnsureCta")} <Icon name="arrowRight" className="h-5 w-5" /></Link>
        </div>
      </section>
    </SiteLayout>
  );
}
