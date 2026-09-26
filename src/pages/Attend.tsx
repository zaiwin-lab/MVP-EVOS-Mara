import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { eventConfig } from "../config/eventConfig";
import { store } from "../data/store";
import { SiteLayout, SITE_WRAP } from "../components/SiteChrome";
import { Icon } from "../components/Icon";
import { useParticipant } from "../context/ParticipantContext";
import { useI18n } from "../context/I18nContext";
import { QrScanner } from "../components/QrScanner";
import { SESSION, isAttendanceCode } from "../lib/attendance";

const TARGET = eventConfig.expectedParticipants;

/** How often the room count refreshes while the page sits open. */
const POLL_MS = 12_000;

/**
 * The QR target for the programme day. Someone who already has an account
 * scans, taps once, and the room counter moves.
 *
 * Signing in happens inline rather than by redirecting to /login: at a venue,
 * bouncing someone between pages after they have scanned a code is where
 * check-ins get lost.
 */
export default function Attend() {
  const { participantId, record, refresh, setParticipantId } = useParticipant();
  const { t } = useI18n();

  const [count, setCount] = useState<number | null>(null);
  const [marking, setMarking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);

  // Inline sign-in
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [signingIn, setSigningIn] = useState(false);

  const alreadyHere = record?.attendance.some((a) => a.session === SESSION) ?? false;

  const loadCount = useCallback(async () => {
    try {
      const rows = await store.listRecords();
      setCount(rows.filter((r) => r.attendance.some((a) => a.session === SESSION)).length);
    } catch (e) {
      // A failed count must never block the button — marking attendance is
      // the point of the page, the number is decoration.
      console.warn("Could not load the attendance count", e);
    }
  }, []);

  useEffect(() => {
    void loadCount();
    const id = window.setInterval(loadCount, POLL_MS);
    return () => window.clearInterval(id);
  }, [loadCount]);

  /** A scan only counts if the code is this programme's. */
  async function handleScan(text: string) {
    setScanning(false);
    if (!isAttendanceCode(text)) {
      setError(t("scanWrongCode"));
      return;
    }
    await markPresent();
  }

  async function markPresent() {
    if (!participantId || marking) return;
    setMarking(true);
    setError(null);
    try {
      await store.markAttendance(participantId, SESSION);
      await refresh();
      await loadCount();
    } catch (e) {
      console.error(e);
      setError(t("commonError"));
    } finally {
      setMarking(false);
    }
  }

  async function signIn() {
    if (signingIn) return;
    setSigningIn(true);
    setError(null);
    try {
      const p = await store.login(mobile, email);
      if (!p) {
        setError(t("lgWrong"));
        return;
      }
      setParticipantId(p.id);
      await refresh();
    } catch (e) {
      console.error(e);
      setError(t("commonError"));
    } finally {
      setSigningIn(false);
    }
  }

  const pct = count == null ? 0 : Math.min(100, Math.round((count / Math.max(1, TARGET)) * 100));

  return (
    <SiteLayout>
      <section className="hero-glow relative overflow-hidden bg-navy-950 text-white">
        <div className="hero-grid pointer-events-none absolute inset-0" />
        <div className={`relative ${SITE_WRAP} py-10 sm:py-14`}>
          <div className="mx-auto max-w-xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-gold-400/25 bg-gold-400/10 px-3 py-1 text-[10.5px] font-extrabold uppercase tracking-[0.15em] text-gold-300">
              <span className="h-1.5 w-1.5 rounded-full bg-gold-400" aria-hidden="true" />
              {t("atEyebrow")}
            </span>
            <h1 className="h-display mt-4 text-[30px] sm:text-[40px]">{t("atTitle")}</h1>

            {/* The room counter. This is what moves when someone scans. */}
            <div className="mt-8">
              <div className="flex items-end justify-center gap-2">
                <span className="num text-[64px] leading-none text-gold-400 sm:text-[80px]">
                  {count ?? "—"}
                </span>
                <span className="num pb-2 text-[26px] leading-none text-white/35 sm:text-[32px]">/ {TARGET}</span>
              </div>
              <div className="stat-label mt-2 text-white/45">{t("atCounterLabel")}</div>

              <div
                className="mx-auto mt-5 h-2 w-full max-w-sm overflow-hidden rounded-full bg-white/10"
                role="progressbar"
                aria-valuenow={count ?? 0}
                aria-valuemin={0}
                aria-valuemax={TARGET}
                aria-label={t("atCounterLabel")}
              >
                <div
                  className="h-full rounded-full transition-[width] duration-700 ease-out"
                  style={{ width: `${pct}%`, backgroundImage: "var(--grad-btn)" }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={`${SITE_WRAP} py-10`}>
        <div className="mx-auto max-w-md">
          {/* ── Already marked ─────────────────────────────── */}
          {participantId && alreadyHere && (
            <div className="card p-7 text-center">
              <span className="icon-tile mx-auto h-16 w-16 bg-emerald-100 text-emerald-600">
                <Icon name="checkCircle" className="h-9 w-9" />
              </span>
              <h2 className="h-section mt-4 text-[22px] sm:text-[26px]">{t("atDoneTitle")}</h2>
              <p className="lede mt-2">
                {t("atDoneBody").replace("{name}", record?.participant.fullName.split(" ")[0] ?? "")}
              </p>
              <div className="mt-6 grid gap-2 sm:grid-cols-2">
                <Link to="/prompt-hub" className="btn-gold">{t("ldOpenHub")}</Link>
                <Link to="/sijil" className="btn-outline">{t("myCertificate")}</Link>
              </div>
            </div>
          )}

          {/* ── Signed in, one tap away ────────────────────── */}
          {participantId && !alreadyHere && (
            <div className="card p-7 text-center">
              <p className="text-[13px] font-semibold uppercase tracking-[0.12em] text-slate2-dim">
                {t("atGreeting")}
              </p>
              <p className="mt-1 font-display text-[24px] font-extrabold tracking-[-0.02em] text-navy-950">
                {record?.participant.fullName}
              </p>
              {record?.participant.coopName && (
                <p className="text-sm font-semibold text-gold-700">{record.participant.coopName}</p>
              )}

              <button
                onClick={() => { setError(null); setScanning(true); }}
                disabled={marking}
                className="btn-gold mt-6 w-full py-4 text-base"
              >
                <Icon name="qr" className="h-5 w-5" />
                {t("scanCta")}
              </button>
              <button
                onClick={markPresent}
                disabled={marking}
                className="btn-outline mt-2 w-full text-sm"
              >
                <Icon name="checkCircle" className="h-4 w-4" />
                {marking ? t("atMarking") : t("atMarkCta")}
              </button>
              {error && <p className="mt-3 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
              <p className="field-hint mt-3">{t("atMarkHint")}</p>
            </div>
          )}

          {/* ── Not signed in ──────────────────────────────── */}
          {!participantId && (
            <div className="card p-7">
              <div className="text-center">
                <span className="icon-tile mx-auto h-12 w-12 bg-gold-100 text-gold-700 ring-1 ring-inset ring-gold-200">
                  <Icon name="qr" className="h-6 w-6" />
                </span>
                <h2 className="h-section mt-4 text-[21px] sm:text-[24px]">{t("atSignInTitle")}</h2>
                <p className="lede mt-2 text-[14px]">{t("atSignInBody")}</p>
              </div>

              <div className="mt-6 space-y-4">
                <div>
                  <label className="field-label" htmlFor="at-mobile">{t("mobileNumber")}</label>
                  <input
                    id="at-mobile"
                    className="field-input"
                    value={mobile}
                    inputMode="tel"
                    autoComplete="tel"
                    placeholder="cth. 012-345 6789"
                    onChange={(e) => setMobile(e.target.value)}
                  />
                </div>
                <div>
                  <label className="field-label" htmlFor="at-email">{t("emailLabel")}</label>
                  <input
                    id="at-email"
                    className="field-input"
                    value={email}
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    placeholder="anda@syarikat.com"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
                <button onClick={signIn} disabled={signingIn} className="btn-gold w-full py-3.5">
                  {signingIn ? t("lgSubmitting") : t("atSignInCta")}
                  {!signingIn && <Icon name="arrowRight" className="h-5 w-5" />}
                </button>
              </div>

              <p className="mt-5 text-center text-sm text-slate2-mut">
                {t("notRegistered")}{" "}
                <Link to="/check-in?next=/hadir" className="font-bold text-navy-800 underline">{t("registerHere")}</Link>
              </p>
            </div>
          )}
        </div>
      </section>
      {scanning && <QrScanner onResult={handleScan} onClose={() => setScanning(false)} />}
    </SiteLayout>
  );
}
