import { eventConfig } from "../config/eventConfig";
import { SiteLayout, SITE_WRAP, PageHero } from "../components/SiteChrome";
import { Icon } from "../components/Icon";
import { useI18n } from "../context/I18nContext";

/**
 * Modules and resources.
 *
 * Only what actually exists is shown. The page used to render all six
 * categories whether or not anything sat behind them, so a participant met six
 * cards that each said "coming soon" — which looks like a full shelf until you
 * reach for something. An empty shelf, honestly labelled, is more useful.
 */
export default function Sumber() {
  const { t, pick } = useI18n();
  const { resources, moduleFolderUrl } = eventConfig;

  const linked = resources.filter((r) => r.url);
  const hasAnything = Boolean(moduleFolderUrl) || linked.length > 0;

  return (
    <SiteLayout>
      <PageHero eyebrow={t("navModules")} title={t("sbTitle")} lede={t("sbIntro")}>
        {/* Only when there are sub-categories below. With a single folder the
            panel underneath carries the same action with context, and two
            identical buttons on one sparse page is one too many. */}
        {moduleFolderUrl && linked.length > 0 && (
          <div className="mt-6">
            <a href={moduleFolderUrl} target="_blank" rel="noreferrer" className="btn-gold px-6 py-3.5">
              <Icon name="book" className="h-5 w-5" /> {t("sbOpenAll")}
            </a>
          </div>
        )}
      </PageHero>

      <section className={`${SITE_WRAP} py-12`}>
        {/* One master folder and no sub-categories yet: the page says what is in
            it and opens it, rather than leaving a note under an empty body. */}
        {moduleFolderUrl && linked.length === 0 ? (
          <div className="mx-auto max-w-lg text-center">
            <span className="icon-tile mx-auto h-14 w-14 bg-navy-900 text-gold-300">
              <Icon name="book" className="h-7 w-7" />
            </span>
            <h2 className="h-section mt-5 text-[22px] sm:text-[26px]">{t("sbFolderTitle")}</h2>
            <p className="lede mt-3">{t("sbFolderDesc")}</p>
            <a href={moduleFolderUrl} target="_blank" rel="noreferrer" className="btn-gold mt-7 px-6 py-3.5">
              <Icon name="arrowRight" className="h-5 w-5" /> {t("sbOpenFolder")}
            </a>
            <p className="mt-8 text-xs text-slate2-dim">{t("sbNote")}</p>
          </div>
        ) : hasAnything ? (
          <>
            {linked.length > 0 && (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {linked.map((r) => (
                  <a
                    key={r.id}
                    href={r.url}
                    target="_blank"
                    rel="noreferrer"
                    className="card-hover group flex flex-col gap-3 p-5"
                  >
                    <span className="icon-tile h-11 w-11 bg-navy-900 text-gold-300">
                      <Icon name={r.icon} className="h-5 w-5" />
                    </span>
                    <div className="font-display text-[16px] font-extrabold tracking-[-0.01em] text-navy-950">
                      {pick(r.title)}
                    </div>
                    <p className="text-[13.5px] leading-relaxed text-slate2-mut">{pick(r.desc)}</p>
                    <span className="mt-auto inline-flex items-center gap-1 pt-1 text-[13px] font-bold text-navy-700 transition group-hover:gap-2 group-hover:text-gold-600">
                      {t("sbOpenFolder")} <Icon name="arrowRight" className="h-4 w-4" />
                    </span>
                  </a>
                ))}
              </div>
            )}
            <p className="mt-8 rounded-2xl bg-sand-100 px-5 py-4 text-xs text-slate2-mut">{t("sbNote")}</p>
          </>
        ) : (
          <div className="mx-auto max-w-lg text-center">
            <span className="icon-tile mx-auto h-14 w-14 bg-gold-100 text-gold-700 ring-1 ring-inset ring-gold-200">
              <Icon name="book" className="h-7 w-7" />
            </span>
            <h2 className="h-section mt-5 text-[22px] sm:text-[26px]">{t("sbNoneTitle")}</h2>
            <p className="lede mt-3">{t("sbNoneDesc")}</p>
          </div>
        )}
      </section>
    </SiteLayout>
  );
}
