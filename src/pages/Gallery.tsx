import { eventConfig } from "../config/eventConfig";
import { SiteLayout, SITE_WRAP, PageHero } from "../components/SiteChrome";
import { Icon } from "../components/Icon";
import { useI18n } from "../context/I18nContext";

/**
 * Photographs.
 *
 * The official gallery lives wherever the organiser puts it — Drive, Photos,
 * whatever they use on the day. This page is the doorway, not a second copy of
 * the album: maintaining an in-site gallery would mean someone uploading every
 * picture twice.
 */
export default function Gallery() {
  const { t } = useI18n();
  const { galleryUrl } = eventConfig;

  return (
    <SiteLayout>
      <PageHero eyebrow={t("glEyebrow")} title={t("glTitle")} lede={t("glIntro")} />

      <section className={`${SITE_WRAP} py-14`}>
        <div className="mx-auto max-w-lg text-center">
          <span className="icon-tile mx-auto h-14 w-14 bg-gold-100 text-gold-700 ring-1 ring-inset ring-gold-200">
            <Icon name="slides" className="h-7 w-7" />
          </span>

          {galleryUrl ? (
            <>
              <h2 className="h-section mt-5 text-[22px] sm:text-[26px]">{t("glFullTitle")}</h2>
              <p className="lede mt-3">{t("glFullDesc")}</p>
              <a href={galleryUrl} target="_blank" rel="noreferrer" className="btn-gold mt-7 px-6 py-3.5">
                {t("glOpen")} <Icon name="arrowRight" className="h-5 w-5" />
              </a>
            </>
          ) : (
            <>
              <h2 className="h-section mt-5 text-[22px] sm:text-[26px]">{t("glNoneTitle")}</h2>
              <p className="lede mt-3">{t("glSoonDesc")}</p>
            </>
          )}
        </div>
      </section>
    </SiteLayout>
  );
}
