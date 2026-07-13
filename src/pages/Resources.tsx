import { AppShell } from "../components/AppShell";
import { BrandFooter } from "../components/Brand";
import { Icon } from "../components/Icon";
import { RESOURCES } from "../content/programme";
import { useI18n } from "../context/I18nContext";

export default function Resources() {
  const { t, pick } = useI18n();
  return (
    <AppShell header title={t("programmeResourcesTitle")}>
      <section className="bg-navy-950 px-5 pb-8 pt-6 text-white">
        <span className="section-eyebrow text-gold-300">{t("resourceCentre")}</span>
        <h1 className="mt-1 font-display text-2xl font-extrabold">
          {t("everythingYouNeed")}
        </h1>
        <p className="mt-2 text-sm text-navy-100">{t("resourcesIntro")}</p>
      </section>

      <section className="space-y-3 px-5 py-6">
        {RESOURCES.map((r) => {
          const available = Boolean(r.url);
          const Wrapper = available ? "a" : "div";
          return (
            <Wrapper
              key={r.id}
              {...(available
                ? { href: r.url, target: "_blank", rel: "noreferrer" }
                : {})}
              className={`card flex items-center gap-4 p-4 ${
                available ? "transition hover:shadow-lift" : "opacity-90"
              }`}
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-navy-50 text-navy-700">
                <Icon name={r.icon} className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-bold text-navy-900">
                  {r.titleI18n ? pick(r.titleI18n) : r.title}
                </div>
                <div className="truncate text-xs text-navy-400">{r.description}</div>
              </div>
              {available ? (
                <Icon name="download" className="h-5 w-5 shrink-0 text-navy-400" />
              ) : (
                <span className="chip shrink-0 bg-gold-50 text-gold-700">{t("comingChip")}</span>
              )}
            </Wrapper>
          );
        })}
        <p className="pt-2 text-center text-xs text-navy-400">{t("comingNote")}</p>
      </section>

      <BrandFooter />
    </AppShell>
  );
}
