import { eventConfig } from "../config/eventConfig";
import { SiteLayout, SITE_WRAP } from "../components/SiteChrome";
import { Icon } from "../components/Icon";
import { useI18n } from "../context/I18nContext";

export default function Gallery() {
  const { t } = useI18n();
  const { galleryUrl, galleryImages } = eventConfig;
  const hasImages = galleryImages.length > 0;

  return (
    <SiteLayout>
      <section className="bg-navy-950 text-white">
        <div className={`${SITE_WRAP} py-10 lg:py-12`}>
          <span className="section-eyebrow text-gold-300">{t("glEyebrow")}</span>
          <h1 className="mt-2 font-display text-3xl font-extrabold sm:text-4xl">{t("glTitle")}</h1>
          <p className="mt-3 max-w-2xl text-sm text-navy-200">{t("glIntro")}</p>
        </div>
      </section>

      <section className={`${SITE_WRAP} py-12`}>
        {hasImages ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {galleryImages.map((src, i) => (
              <div key={i} className="overflow-hidden rounded-2xl border border-navy-100 bg-sand-100">
                <img src={src} alt={`Galeri ${i + 1}`} loading="lazy" className="h-40 w-full object-cover" />
              </div>
            ))}
          </div>
        ) : galleryUrl ? (
          <div className="mx-auto max-w-xl text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-navy-50 text-navy-700">
              <Icon name="slides" className="h-7 w-7" />
            </div>
            <h2 className="mt-4 font-display text-xl font-bold text-navy-900">{t("glFullTitle")}</h2>
            <p className="mt-2 text-sm text-navy-500">{t("glFullDesc")}</p>
            <a href={galleryUrl} target="_blank" rel="noreferrer" className="btn-gold mt-5 inline-flex">
              {t("glOpen")} <Icon name="arrowRight" className="h-5 w-5" />
            </a>
          </div>
        ) : (
          <ComingSoon />
        )}
      </section>
    </SiteLayout>
  );
}

function ComingSoon() {
  const { t } = useI18n();
  return (
    <div className="mx-auto max-w-xl rounded-3xl border border-dashed border-navy-200 bg-sand-50 p-10 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-navy-400 shadow-sm">
        <Icon name="slides" className="h-7 w-7" />
      </div>
      <h2 className="mt-4 font-display text-xl font-bold text-navy-900">{t("sbComingSoon")}</h2>
      <p className="mt-2 text-sm text-navy-500">{t("glSoonDesc")}</p>
    </div>
  );
}
