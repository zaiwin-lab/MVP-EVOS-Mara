import { eventConfig } from "../config/eventConfig";
import { SiteLayout, SITE_WRAP, SectionHead } from "../components/SiteChrome";
import { Icon } from "../components/Icon";
import { useI18n } from "../context/I18nContext";
import { VENUE, CHECKLIST, REMINDERS, DRESS_CODE } from "../content/maklumat";

/**
 * Everything a participant needs to find the room and pack the right bag.
 *
 * Read standing up, on a phone, the night before or in a hotel lobby — so it
 * is cards and short lines, not paragraphs. Nothing here is decorative.
 */
export default function Maklumat() {
  const { t, pick } = useI18n();

  return (
    <SiteLayout>
      <section className={`${SITE_WRAP} py-12 lg:py-16`}>
        <SectionHead
          eyebrow={t("mkEyebrow")}
          title={t("mkTitle")}
          lede={`${eventConfig.venue} · ${eventConfig.dates}`}
        />

        {/* ── Venue and logistics ── */}
        <div className="mx-auto mt-9 grid max-w-4xl gap-4 sm:grid-cols-2">
          {VENUE.map((v) => (
            <div key={v.icon} className="card p-5">
              <span className="icon-tile h-9 w-9 bg-gold-100 text-gold-700">
                <Icon name={v.icon} className="h-4 w-4" />
              </span>
              <div className="mt-3 text-[11px] font-extrabold uppercase tracking-[0.14em] text-slate2-dim">
                {pick(v.label)}
              </div>
              <div className="mt-1 whitespace-pre-line text-[14px] font-semibold leading-relaxed text-navy-950">
                {pick(v.value)}
              </div>
            </div>
          ))}
        </div>

        {/* ── What to bring ── */}
        <div className="mx-auto mt-10 max-w-4xl">
          <h2 className="font-display text-[19px] font-bold text-navy-950">{t("mkBring")}</h2>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {CHECKLIST.map((c) => (
              <li key={pick(c)} className="flex items-start gap-2.5 rounded-xl bg-sand-100 px-4 py-3">
                <Icon name="checkCircle" className="mt-0.5 h-4 w-4 shrink-0 text-gold-600" />
                <span className="text-[14px] text-navy-900">{pick(c)}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* ── Reminders and dress code, side by side on a wide screen ── */}
        <div className="mx-auto mt-10 grid max-w-4xl gap-6 sm:grid-cols-2">
          <div>
            <h2 className="font-display text-[19px] font-bold text-navy-950">{t("mkReminders")}</h2>
            <ul className="mt-4 space-y-2.5">
              {REMINDERS.map((r) => (
                <li key={pick(r)} className="flex items-start gap-2.5">
                  <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-gold-500" aria-hidden="true" />
                  <span className="text-[14px] leading-relaxed text-slate2-mut">{pick(r)}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="font-display text-[19px] font-bold text-navy-950">{t("mkDress")}</h2>
            <p className="mt-4 text-[14px] leading-relaxed text-slate2-mut">{pick(DRESS_CODE)}</p>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
