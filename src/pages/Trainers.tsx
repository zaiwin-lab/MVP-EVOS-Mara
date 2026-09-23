import { TRAINERS, type Trainer } from "../content/trainers";
import { SiteLayout, SITE_WRAP, PageHero } from "../components/SiteChrome";
import { Icon } from "../components/Icon";
import { useI18n } from "../context/I18nContext";

/**
 * Who is delivering the programme.
 *
 * One card under another, in running order, using the existing card, type and
 * accent treatment — nothing new is introduced for this page. Both cards carry
 * the same blocks in the same order so neither reads as the more important of
 * the two.
 */
export default function Trainers() {
  const { t } = useI18n();

  return (
    <SiteLayout>
      <PageHero eyebrow={t("trEyebrow")} title={t("trTitle")} lede={t("trIntro")} />

      <section className={`${SITE_WRAP} py-12`}>
        <div className="mx-auto max-w-3xl space-y-5">
          {TRAINERS.map((trainer) => (
            <TrainerCard key={trainer.id} trainer={trainer} />
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}

function TrainerCard({ trainer }: { trainer: Trainer }) {
  const { t, pick } = useI18n();

  return (
    <article className="card overflow-hidden">
      {/* Identity header — navy, so the name carries the card. */}
      <div className="flex items-center gap-4 bg-navy-950 p-5 sm:p-6">
        {trainer.photo ? (
          <img
            src={trainer.photo}
            alt={trainer.name}
            className="h-16 w-16 shrink-0 rounded-2xl object-cover object-top sm:h-[72px] sm:w-[72px]"
          />
        ) : (
          <span
            className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl font-display text-[21px] font-extrabold text-navy-950 sm:h-[72px] sm:w-[72px] sm:text-[24px]"
            style={{ backgroundImage: "var(--grad-btn)" }}
            aria-hidden="true"
          >
            {trainer.initials}
          </span>
        )}
        <div className="min-w-0">
          <h2 className="font-display text-[18px] font-extrabold leading-tight tracking-[-0.02em] text-white sm:text-[21px]">
            {trainer.name}
          </h2>
          <p className="mt-1 text-[12.5px] font-bold leading-snug text-gold-300">{pick(trainer.role)}</p>
        </div>
      </div>

      <div className="p-5 sm:p-6">
        {/* Designation */}
        <div className="border-l-2 border-gold-400 pl-4">
          {trainer.designation.map((line, i) => (
            <div
              key={line}
              className={
                i === 0
                  ? "font-display text-[14px] font-extrabold text-navy-950"
                  : "text-[13px] text-slate2-mut"
              }
            >
              {line}
            </div>
          ))}
        </div>

        <p className="mt-5 text-[14px] leading-relaxed text-slate2-mut">{pick(trainer.profile)}</p>

        {/* Focus areas */}
        <div className="mt-6">
          <div className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-slate2-dim">
            {t("trFocusAreas")}
          </div>
          <ul className="mt-3 grid gap-x-5 gap-y-2 sm:grid-cols-2">
            {trainer.focusAreas.map((area, i) => (
              <li key={i} className="flex items-start gap-2 text-[13.5px] leading-snug text-navy-800">
                <Icon name="check" className="mt-[3px] h-3.5 w-3.5 shrink-0 text-gold-600" />
                {pick(area)}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  );
}
