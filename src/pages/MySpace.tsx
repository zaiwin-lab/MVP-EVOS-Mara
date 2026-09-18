import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { eventConfig } from "../config/eventConfig";
import { getWorkArea } from "../content/promptLibrary";
import { SiteLayout, SITE_WRAP } from "../components/SiteChrome";
import { Icon } from "../components/Icon";
import { areaAccent } from "../lib/accents";
import { useParticipant } from "../context/ParticipantContext";
import { useI18n } from "../context/I18nContext";
import { store } from "../data/store";
import type { PromptAttempt } from "../data/types";

export default function MySpace() {
  const { participantId, record, loading, signOut } = useParticipant();
  const { t, pick } = useI18n();
  const navigate = useNavigate();
  const [attempts, setAttempts] = useState<PromptAttempt[]>([]);

  // Every prompt this participant has actually used, from its own table —
  // not just the ones they explicitly saved.
  useEffect(() => {
    if (!participantId) {
      setAttempts([]);
      return;
    }
    let cancelled = false;
    store
      .listPromptAttempts(participantId)
      .then((rows) => !cancelled && setAttempts(rows))
      .catch((err) => console.warn("Could not load prompt attempts", err));
    return () => {
      cancelled = true;
    };
  }, [participantId]);

  if (!participantId && !loading) return <Navigate to="/check-in" replace />;
  if (loading || !record) {
    return (
      <SiteLayout>
        <div className={`${SITE_WRAP} py-20 text-center text-sm text-navy-400`}>{t("msLoading")}</div>
      </SiteLayout>
    );
  }

  const p = record.participant;
  const area = p.selectedWorkArea ? getWorkArea(p.selectedWorkArea) : undefined;
  const saved = p.savedPrompts ?? [];
  const tried = attempts.length || (p.triedPromptIds?.length ?? 0);
  const attended = record.attendance.length > 0;

  return (
    <SiteLayout>
      <section className="bg-navy-950 text-white">
        <div className={`${SITE_WRAP} py-9`}>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <span className="section-eyebrow text-gold-300">{t("msEyebrow")}</span>
              <h1 className="mt-2 font-display text-2xl font-extrabold sm:text-3xl">{t("msGreeting").replace("{name}", p.fullName.split(" ")[0])}</h1>
              <p className="mt-1 text-sm text-navy-200">{p.coopName || p.companyName} · {p.role || t("msParticipantRole")}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="chip bg-white/10 text-white">{p.ref}</span>
              <button onClick={() => { signOut(); navigate("/"); }} className="chip bg-white/10 text-white hover:bg-white/20">
                <Icon name="arrowRight" className="h-3.5 w-3.5" /> {t("exit")}
              </button>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <span className={`chip ${attended ? "bg-emerald-400/20 text-emerald-200" : "bg-white/10 text-navy-200"}`}>
              <Icon name={attended ? "checkCircle" : "clock"} className="h-3.5 w-3.5" /> {attended ? t("msAttendanceYes") : t("msAttendanceNo")}
            </span>
            <span className="chip bg-white/10 text-white">{t("msTriedCount").replace("{n}", String(tried))}</span>
            <span className="chip bg-white/10 text-white">{t("msSavedCount").replace("{n}", String(saved.length))}</span>
          </div>
        </div>
      </section>

      <section className={`${SITE_WRAP} py-10`}>
        <div className="grid gap-5 lg:grid-cols-3">
          {/* Readiness */}
          <div className="card p-5 lg:col-span-1">
            <div className="text-xs font-bold uppercase tracking-wide text-navy-400">{t("msReadiness")}</div>
            {p.readinessScore != null ? (
              <div className="mt-3 flex items-center gap-4">
                <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-full border-4 border-gold-400 text-navy-900">
                  <span className="text-lg font-extrabold leading-none">{p.readinessScore}</span>
                  <span className="text-[9px] font-semibold text-navy-400">/100</span>
                </div>
                <div>
                  <div className="font-display text-base font-bold text-navy-900">{p.readinessCategory}</div>
                  <Link to="/readiness" className="text-xs font-semibold text-navy-500 underline">{t("msRetake")}</Link>
                </div>
              </div>
            ) : (
              <div className="mt-3">
                <p className="text-sm text-navy-500">{t("msNoAssessment")}</p>
                <Link to="/readiness" className="btn-gold mt-3 w-full text-sm">{t("msStartAssessment")}</Link>
              </div>
            )}
          </div>

          {/* Selected work area */}
          <div className="card p-5 lg:col-span-2">
            <div className="text-xs font-bold uppercase tracking-wide text-navy-400">{t("msFocusArea")}</div>
            {area ? (
              <div className="mt-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${areaAccent(area.accent).badge}`}>
                    <Icon name={area.icon} className="h-5 w-5" />
                  </span>
                  <div>
                    <div className="font-display text-base font-bold text-navy-900">{pick(area.title)}</div>
                    <div className="text-xs text-navy-400">{pick(area.blurb)}</div>
                  </div>
                </div>
                <Link to={`/prompt-hub/${area.id}`} className="btn-outline shrink-0 text-sm">{t("msOpen")}</Link>
              </div>
            ) : (
              <div className="mt-3 flex items-center justify-between gap-3">
                <p className="text-sm text-navy-500">{t("msNoArea")}</p>
                <Link to="/prompt-hub" className="btn-gold shrink-0 text-sm">{t("msChooseArea")}</Link>
              </div>
            )}
          </div>
        </div>

        {/* Saved prompts */}
        <div className="mt-5 card p-5">
          <div className="flex items-center justify-between">
            <div className="text-xs font-bold uppercase tracking-wide text-navy-400">{t("myPrompts")}</div>
            <Link to="/prompt-hub" className="text-xs font-semibold text-navy-600 underline">{t("msAddMore")}</Link>
          </div>
          {attempts.length ? (
            <ul className="mt-3 divide-y divide-navy-50">
              {attempts.map((a) => (
                <PromptRow
                  key={a.missionId}
                  attempt={a}
                  isSaved={saved.some((s) => s.id === a.missionId)}
                />
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-navy-500">{t("msNoPrompts")}</p>
          )}
        </div>

        {/* Quick links */}
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <Link to="/prompt-hub" className="card flex items-center gap-3 p-4 hover:shadow-lift">
            <Icon name="target" className="h-5 w-5 text-navy-700" /> <span className="text-sm font-bold text-navy-900">{t("msSixAreas")}</span>
          </Link>
          <Link to="/journey" className="card flex items-center gap-3 p-4 hover:shadow-lift">
            <Icon name="calendar" className="h-5 w-5 text-navy-700" /> <span className="text-sm font-bold text-navy-900">{t("msJourney")}</span>
          </Link>
          <Link to="/sumber" className="card flex items-center gap-3 p-4 hover:shadow-lift">
            <Icon name="book" className="h-5 w-5 text-navy-700" /> <span className="text-sm font-bold text-navy-900">{t("msResources")}</span>
          </Link>
        </div>

        <p className="mt-6 text-center text-xs text-navy-400">{eventConfig.eventName} · {eventConfig.venue}</p>
      </section>
    </SiteLayout>
  );
}

/**
 * One saved prompt. Collapsed it is a title; expanded it shows the exact text
 * the participant generated, with their own answers in it, ready to copy.
 */
function PromptRow({ attempt, isSaved }: { attempt: PromptAttempt; isSaved: boolean }) {
  const { t, pick } = useI18n();
  const [copied, setCopied] = useState(false);
  const area = getWorkArea(attempt.areaId);

  async function copy() {
    try {
      await navigator.clipboard.writeText(attempt.promptText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable — the text is on screen to select manually */
    }
  }

  const used = new Date(attempt.lastUsedAt).toLocaleDateString("ms-MY", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <li className="py-3">
      <details className="group">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold text-navy-900">
              {attempt.promptTitle || attempt.missionId}
            </div>
            <div className="flex flex-wrap items-center gap-x-2 text-[11px] text-navy-400">
              <span>{area ? pick(area.title) : ""}</span>
              <span aria-hidden="true">·</span>
              <span>{t("msTimesUsed").replace("{n}", String(attempt.attemptCount))}</span>
              <span aria-hidden="true">·</span>
              <span>{used}</span>
              {isSaved && (
                <span className="rounded bg-emerald-100 px-1.5 py-0.5 font-semibold text-emerald-700">
                  {t("msSavedTag")}
                </span>
              )}
            </div>
          </div>
          <span className="shrink-0 rounded-full border border-navy-200 px-3 py-1 text-xs font-semibold text-navy-600 group-open:bg-navy-50">
            <span className="group-open:hidden">{t("msViewPrompt")}</span>
            <span className="hidden group-open:inline">{t("msClosePrompt")}</span>
          </span>
        </summary>

        {attempt.promptText ? (
          <div className="mt-3">
            <pre className="max-h-72 overflow-auto whitespace-pre-wrap rounded-xl bg-navy-50 p-4 text-[12.5px] leading-relaxed text-navy-800">
{attempt.promptText}
            </pre>
            <div className="mt-2 flex flex-wrap gap-2">
              <button type="button" onClick={copy} className="btn-ghost text-xs">
                <Icon name={copied ? "check" : "clipboard"} className="h-3.5 w-3.5" />
                {copied ? t("pbCopied") : t("msCopyPrompt")}
              </button>
              <Link to={`/prompt-hub/${attempt.areaId}/${attempt.missionId}`} className="btn-ghost text-xs">
                {t("msRegenerate")}
              </Link>
            </div>
          </div>
        ) : (
          <p className="mt-3 text-xs text-navy-400">{t("msNoStoredText")}</p>
        )}
      </details>
    </li>
  );
}
