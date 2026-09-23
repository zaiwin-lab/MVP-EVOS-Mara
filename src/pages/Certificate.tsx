import { useLayoutEffect, useRef } from "react";
import { Link, Navigate } from "react-router-dom";
import { eventConfig, type CertificateField } from "../config/eventConfig";
import { SiteLayout, SITE_WRAP } from "../components/SiteChrome";
import { Icon } from "../components/Icon";
import { LogoMark } from "../components/Brand";
import { useParticipant } from "../context/ParticipantContext";
import { useI18n } from "../context/I18nContext";
import { SESSION } from "../lib/attendance";


/**
 * Serial for one participant's certificate. Derived from the reference they
 * already carry plus the event slug, so it is stable across reloads and can be
 * checked against the attendance table without storing anything extra.
 */
/** The printed design runs KOBIS · ANGKASA · SDEC, not the site's footer order. */
const CERT_PARTNER_ORDER = ["KOBIS Berhad", "ANGKASA", "SDEC"];

export function certificateSerial(ref: string): string {
  const year = eventConfig.dates.match(/\d{4}/)?.[0] ?? "";
  return `${eventConfig.refPrefix}/${year}/${ref.replace(/^.*?-/, "")}`;
}

/**
 * One filled-in line on the organiser's artwork.
 *
 * The line is anchored by its bottom edge so it rests on the printed rule
 * rather than drifting above it, and it shrinks to fit rather than wrapping
 * or truncating. Co-operative names here run long — "Koperasi Pekerja-Pekerja
 * Kerajaan Negeri Sarawak Berhad" is an ordinary one — and on a certificate a
 * slightly smaller line is fine where a second line or an ellipsis is not.
 *
 * Sizes are in `cqw`, so the sheet is one object: the phone preview, the
 * desktop preview and the A4 print are the same document at different scales.
 */
function CertLine({
  field,
  inset,
  value,
}: {
  field: CertificateField;
  inset: number;
  value: string;
}) {
  const boxRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);

  useLayoutEffect(() => {
    const box = boxRef.current;
    const text = textRef.current;
    if (!box || !text) return;

    const floor = field.sizePct * 0.5;
    const step = field.sizePct * 0.03;

    const fit = () => {
      let size = field.sizePct;
      text.style.fontSize = `${size}cqw`;
      while (text.scrollWidth > box.clientWidth && size > floor) {
        size -= step;
        text.style.fontSize = `${size}cqw`;
      }
    };

    fit();
    // A webfont that arrives after the first measurement changes the width,
    // so measure again once it has.
    void document.fonts?.ready.then(fit);

    const observer = new ResizeObserver(fit);
    observer.observe(box);
    return () => observer.disconnect();
  }, [field.sizePct, value]);

  return (
    <div
      ref={boxRef}
      className="absolute text-center"
      style={{
        left: `${inset}%`,
        right: `${inset}%`,
        top: `${field.bottomPct}%`,
        transform: "translateY(-100%)",
      }}
    >
      <p
        ref={textRef}
        className="whitespace-nowrap font-serif leading-none"
        style={{
          fontSize: `${field.sizePct}cqw`,
          color: field.color,
          fontWeight: field.weight,
        }}
      >
        {value}
      </p>
    </div>
  );
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

  const art = eventConfig.certificate;
  const serial = certificateSerial(p.ref);
  const coop = p.coopName || p.companyName;
  const certPartners = CERT_PARTNER_ORDER
    .map((name) => eventConfig.partners.find((x) => x.name === name))
    .filter((x): x is (typeof eventConfig.partners)[number] => Boolean(x));
  // The printed reference carries the programme date, which keeps every
  // certificate for this event identical. Switching to "attendance" makes it
  // the moment this person was marked present instead — see eventConfig.
  const issuedLabel =
    art.issuedDate === "attendance" && markedAt
      ? `${t("certIssued")} ${new Date(markedAt).toLocaleDateString("en-MY", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })}`
      : `${t("certIssued")} ${eventConfig.dates}`;

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
            /* The artwork is one image with two lines set over it, and every
               size on it is in `cqw`, so it can shrink to a phone and stay
               the same document. The layout the site draws itself cannot —
               its text would become unreadable — so that one keeps a floor
               and scrolls sideways instead. */
            className={`relative mx-auto aspect-[297/210] w-full overflow-hidden rounded-2xl border border-slate2-line bg-white shadow-pop [container-type:inline-size] print:min-w-0 print:rounded-none print:border-0 print:shadow-none ${
              art.artworkUrl ? "" : "min-w-[720px]"
            }`}
          >
            {art.artworkUrl ? (
              /* The organiser's own design. The artwork already carries the
                 heading, the programme name, the date, the venue and the
                 signature, so the site fills in only the two ruled lines:
                 the participant's name, and the organisation under "of". */
              <>
                <img
                  src={art.artworkUrl}
                  alt=""
                  aria-hidden="true"
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <CertLine
                  field={art.name}
                  inset={art.fieldInsetPct}
                  value={p.fullName}
                />
                {coop && (
                  <CertLine
                    field={art.organisation}
                    inset={art.fieldInsetPct}
                    value={coop}
                  />
                )}
                {art.showSerial && (
                  <div
                    className="absolute inset-x-[6%] bottom-[4%] flex items-center justify-between text-[0.9cqw]"
                    style={{ color: art.organisation.color }}
                  >
                    <span className="font-mono font-semibold">{serial}</span>
                    <span>{issuedLabel}</span>
                  </div>
                )}
              </>
            ) : (
              <>
                {/* Navy edge with a hairline gold rule inside it */}
                <div className="absolute inset-0 border-[9px] border-navy-950" aria-hidden="true" />
                <div className="absolute inset-[9px] border border-gold-500/70" aria-hidden="true" />

                <div className="relative flex h-full flex-col items-center px-[7%] pb-[3.5%] pt-[4%] text-center">
                  {/* ── Crest and what this certifies ── */}
                  <LogoMark className="h-[6.2%] min-h-[34px] w-auto aspect-square" />

                  <div className="mt-[1.6%] text-[1.15cqw] font-extrabold uppercase tracking-[0.34em] text-gold-600">
                    {t("certBadge")}
                  </div>

                  <h2 className="mt-[1.4%] font-display text-[2.6cqw] font-extrabold leading-tight tracking-[-0.02em] text-navy-950">
                    {eventConfig.eventNameLocal}
                  </h2>

                  <p className="mt-[1.1%] text-[1.12cqw] font-bold uppercase tracking-[0.08em] text-navy-800">
                    {eventConfig.dates} &nbsp;•&nbsp; {eventConfig.venue}
                  </p>

                  {/* ── The award ── */}
                  <div className="flex flex-1 flex-col items-center justify-center">
                    <p className="text-[1.3cqw] text-slate2-mut">{t("certHeading")}</p>

                    <p className="mt-[0.6%] font-display text-[4.2cqw] font-extrabold leading-[1.1] tracking-[-0.025em] text-navy-950">
                      {p.fullName}
                    </p>

                    {/* The rule under the name is the device the printed design uses. */}
                    <span className="mt-[1.8%] block h-px w-[46%] bg-gold-500" aria-hidden="true" />

                    {coop && (
                      <p className="mt-[1.1%] text-[1.5cqw] font-bold text-gold-700">{coop}</p>
                    )}

                    <p className="mt-[1.5%] text-[1.26cqw] text-slate2-mut">{t("certBody")}</p>
                    <p className="mt-[0.4%] text-[1.35cqw] font-bold text-navy-900">
                      {eventConfig.eventName}
                    </p>
                  </div>

                  {/* ── Partners ── */}
                  <div className="grid w-full grid-cols-3 items-end gap-[3%]">
                    {certPartners.map((partner) => (
                      <div key={partner.name} className="flex flex-col items-center justify-end">
                        {partner.logo ? (
                          <img
                            src={partner.logo}
                            alt={partner.name}
                            className="w-auto max-w-[78%] object-contain"
                            style={{ height: `${2.6 * (partner.logoScale ?? 1)}cqw` }}
                          />
                        ) : (
                          <span className="font-display text-[1.6cqw] font-extrabold text-navy-900">{partner.name}</span>
                        )}
                        <div className="mt-[4%] text-[1.05cqw] font-extrabold uppercase tracking-[0.06em] text-navy-900">
                          {partner.name}
                        </div>
                        <div className="text-[0.95cqw] text-slate2-mut">{pick(partner.role)}</div>
                      </div>
                    ))}
                  </div>

                  {/* ── Serial and issue date ── */}
                  <div className="mt-[2.4%] flex w-full items-center justify-between text-[0.92cqw]">
                    <span className="font-bold uppercase tracking-[0.05em] text-navy-900">
                      {t("certSerialLabel")} {serial}
                    </span>
                    <span className="uppercase tracking-[0.05em] text-slate2-mut">{issuedLabel}</span>
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
