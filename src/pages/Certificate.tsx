import { Link, Navigate } from "react-router-dom";
import { eventConfig } from "../config/eventConfig";
import { SiteLayout, SITE_WRAP } from "../components/SiteChrome";
import { Icon } from "../components/Icon";
import { LogoMark } from "../components/Brand";
import { useParticipant } from "../context/ParticipantContext";
import { useI18n } from "../context/I18nContext";

const SESSION = eventConfig.attendanceSessions[0].id;

/**
 * Serial for one participant's certificate. Derived from the reference they
 * already carry plus the event slug, so it is stable across reloads and can be
 * checked against the attendance table without storing anything extra.
 */
export function certificateSerial(ref: string): string {
  const year = eventConfig.dates.match(/\d{4}/)?.[0] ?? "";
  return `${eventConfig.refPrefix}/${year}/${ref.replace(/^.*?-/, "")}`;
}

export default function Certificate() {
  const { participantId, record, loading } = useParticipant();
  const { t, pick } = useI18n();

  if (!participantId && !loading) return <Navigate to="/check-in" replace />;
  if (loading || !record) {
    return (
      <SiteLayout>
        <div className={`${SITE_WRAP} py-20 text-center text-sm text-slate2-mut`}>{t("msLoading")}</div>
      </SiteLayout>
    );
  }

  const p = record.participant;
  const attended = record.attendance.some((a) => a.session === SESSION);
  const markedAt = record.attendance.find((a) => a.session === SESSION)?.markedAt;

  // Attendance is what the certificate certifies. Without it there is nothing
  // to issue, so the page says what is missing instead of printing a blank.
  if (!attended) {
    return (
      <SiteLayout>
        <section className={`${SITE_WRAP} py-14`}>
          <div className="mx-auto max-w-lg text-center">
            <span className="icon-tile mx-auto h-14 w-14 bg-gold-100 text-gold-700 ring-1 ring-inset ring-gold-200">
              <Icon name="lock" className="h-7 w-7" />
            </span>
            <h1 className="h-section mt-5">{t("certLockedTitle")}</h1>
            <p className="lede mt-3">{t("certLockedBody")}</p>
            <Link to="/my" className="btn-outline mt-6">
              <Icon name="arrowLeft" className="h-4 w-4" /> {t("rdToMySpace")}
            </Link>
          </div>
        </section>
      </SiteLayout>
    );
  }

  const issued = markedAt ? new Date(markedAt) : new Date();
  const serial = certificateSerial(p.ref);
  const art = eventConfig.certificate;
  const coop = p.coopName || p.companyName;
  const issuedLabel = `${t("certIssued")} ${issued.toLocaleDateString("en-MY", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })}`;

  return (
    <SiteLayout>
      {/* Screen-only controls. `print:hidden` keeps them off the paper. */}
      <section className={`${SITE_WRAP} py-8 print:hidden`}>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="section-eyebrow">{t("certEyebrow")}</span>
            <h1 className="h-section mt-3">{t("certTitle")}</h1>
            <p className="lede mt-2 max-w-xl">{t("certHint")}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => window.print()} className="btn-gold">
              <Icon name="download" className="h-5 w-5" /> {t("certPrint")}
            </button>
            <Link to="/my" className="btn-outline">{t("rdToMySpace")}</Link>
          </div>
        </div>
      </section>

      {/* ── The certificate ───────────────────────────────────
          Fixed A4-landscape proportions so the screen preview and the
          printed sheet are the same object. It scales down on a phone
          rather than reflowing, because a reflowed certificate is not
          the document the participant is being given. */}
      <section className={`${SITE_WRAP} pb-16 print:p-0`}>
        <div className="mx-auto w-full max-w-[1000px] overflow-x-auto print:overflow-visible">
          <div
            id="sijil"
            className="relative mx-auto aspect-[297/210] w-full min-w-[720px] overflow-hidden rounded-2xl border border-slate2-line bg-white shadow-pop print:min-w-0 print:rounded-none print:border-0 print:shadow-none"
          >
            {art.artworkUrl ? (
              /* The organiser's own design. The site fills in only the parts
                 that change from one participant to the next. */
              <>
                <img
                  src={art.artworkUrl}
                  alt=""
                  aria-hidden="true"
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div
                  className="absolute inset-x-[8%] text-center"
                  style={{ top: `${art.namePositionPct}%`, transform: "translateY(-50%)" }}
                >
                  <p
                    className="font-display text-[38px] font-extrabold leading-tight tracking-[-0.02em]"
                    style={{ color: art.nameColor }}
                  >
                    {p.fullName}
                  </p>
                  {coop && (
                    <p className="mt-1 text-[16px] font-semibold" style={{ color: art.metaColor }}>
                      {coop}
                    </p>
                  )}
                </div>
                {art.showSerial && (
                  <div
                    className="absolute inset-x-[6%] bottom-[4%] flex items-center justify-between text-[10px]"
                    style={{ color: art.metaColor }}
                  >
                    <span className="font-mono font-semibold">{serial}</span>
                    <span>{issuedLabel}</span>
                  </div>
                )}
              </>
            ) : (
              <>
            {/* Gold rule inside a navy edge */}
            <div className="absolute inset-0 border-[10px] border-navy-950" aria-hidden="true" />
            <div className="absolute inset-[10px] border border-gold-400/60" aria-hidden="true" />
            <div
              className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-gold-400/10 blur-3xl"
              aria-hidden="true"
            />

            <div className="relative flex h-full flex-col items-center justify-between px-[6%] py-[4.5%] text-center">
              {/* Crest and the programme this certifies */}
              <div className="flex flex-col items-center">
                <LogoMark className="h-11 w-11" />
                <div className="mt-2.5 text-[10.5px] font-extrabold uppercase tracking-[0.3em] text-gold-700">
                  {t("certBadge")}
                </div>
                <h2 className="mt-3 max-w-[80%] font-display text-[22px] font-extrabold leading-tight tracking-[-0.02em] text-navy-950">
                  {pick(eventConfig.eventNameLocalized)}
                </h2>
                <p className="mt-1.5 text-[11.5px] font-semibold uppercase tracking-[0.1em] text-slate2-dim">
                  {eventConfig.dates} · {eventConfig.venue}
                </p>
              </div>

              {/* The award itself, centred in whatever space is left over */}
              <div className="flex flex-col items-center">
                <span className="h-px w-16 bg-gold-400" aria-hidden="true" />
                <p className="mt-4 text-[13px] text-slate2-mut">{t("certHeading")}</p>

                <p className="mt-2 font-display text-[38px] font-extrabold leading-tight tracking-[-0.02em] text-navy-950">
                  {p.fullName}
                </p>

                {coop && <p className="mt-1 text-[16px] font-semibold text-gold-700">{coop}</p>}

                <p className="mx-auto mt-4 max-w-[72%] text-[13.5px] leading-relaxed text-slate2-mut">
                  {t("certBody")}
                </p>
                <span className="mt-4 h-px w-16 bg-gold-400" aria-hidden="true" />
              </div>

              {/* Signature band */}
              <div className="w-full">
              <div className="grid w-full grid-cols-3 items-end gap-6">
                {eventConfig.partners.map((partner) => (
                  <div key={partner.name}>
                    <div className="mx-auto h-px w-4/5 bg-slate2-line2" />
                    <div className="mt-2 text-[11px] font-extrabold uppercase tracking-[0.12em] text-navy-900">
                      {partner.name}
                    </div>
                    <div className="text-[10px] text-slate2-dim">{pick(partner.role)}</div>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex w-full items-center justify-between text-[10px] text-slate2-dim">
                <span className="font-mono font-semibold">{serial}</span>
                <span>{issuedLabel}</span>
              </div>
              </div>
            </div>
              </>
            )}
          </div>
        </div>

        <p className="mx-auto mt-5 max-w-xl text-center text-xs text-slate2-dim print:hidden">
          {t("certVerifyNote").replace("{serial}", serial)}
        </p>
      </section>
    </SiteLayout>
  );
}
