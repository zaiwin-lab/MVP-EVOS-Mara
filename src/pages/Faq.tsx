import { useState } from "react";
import { Link } from "react-router-dom";
import { FAQS } from "../content/site";
import { SiteLayout, SITE_WRAP, PageHero } from "../components/SiteChrome";
import { Icon } from "../components/Icon";
import { useI18n } from "../context/I18nContext";

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  const { t, pick } = useI18n();
  return (
    <SiteLayout>
      <PageHero eyebrow={t("navFaq")} title={t("faqTitle")} lede={t("faqIntro")} />

      <section className={`${SITE_WRAP} py-12`}>
        <div className="mx-auto max-w-3xl space-y-3">
          {FAQS.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={i} className="card overflow-hidden">
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="font-display text-sm font-bold text-navy-900 sm:text-base">{pick(f.q)}</span>
                  <Icon name="arrowRight" className={`h-4 w-4 shrink-0 text-navy-400 transition-transform ${isOpen ? "rotate-90" : ""}`} />
                </button>
                {isOpen && <p className="px-5 pb-5 text-sm text-navy-600">{pick(f.a)}</p>}
              </div>
            );
          })}
        </div>
        <div className="mx-auto mt-8 max-w-3xl text-center">
          <Link to="/check-in" className="btn-gold">{t("ctaReadyRegister")} <Icon name="arrowRight" className="h-5 w-5" /></Link>
        </div>
      </section>
    </SiteLayout>
  );
}
