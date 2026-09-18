import { useState } from "react";
import { Link } from "react-router-dom";
import {
  READINESS_AREAS,
  computeReadiness,
  type ReadinessOutcome,
} from "../content/readiness";
import { getWorkArea } from "../content/promptLibrary";
import { SiteLayout, SITE_WRAP } from "../components/SiteChrome";
import { Icon } from "../components/Icon";
import { ScoreRing } from "../components/ScoreRing";
import { RadarChart } from "../components/RadarChart";
import { areaAccent } from "../lib/accents";
import { useParticipant } from "../context/ParticipantContext";
import { useI18n, pick as pickLang } from "../context/I18nContext";
import { store } from "../data/store";
import type { AssessmentResult } from "../data/types";

/** Saved results stay in one language (BM) so the admin export is consistent,
 *  no matter which language the participant took the assessment in. */
const bm = (v: Parameters<typeof pickLang>[0]) => pickLang(v, "bm");

export default function Readiness() {
  const { participantId, refresh } = useParticipant();
  const { t, pick } = useI18n();
  const [step, setStep] = useState(0); // 0..N-1 questions, then N = result
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [outcome, setOutcome] = useState<ReadinessOutcome | null>(null);

  const total = READINESS_AREAS.length;
  const isResult = step >= total;

  function choose(areaId: string, score: number) {
    const next = { ...answers, [areaId]: score };
    setAnswers(next);
    if (step + 1 >= total) finish(next);
    else setStep(step + 1);
  }

  async function finish(final: Record<string, number>) {
    const result = computeReadiness(final);
    setOutcome(result);
    setStep(total);
    if (participantId) {
      const strongest = [...READINESS_AREAS].sort((a, b) => (result.perArea[b.id] ?? 0) - (result.perArea[a.id] ?? 0))[0];
      const recArea = getWorkArea(result.recommendWorkArea);
      const payload: AssessmentResult = {
        participantId,
        totalScore: result.score,
        indicatorScores: result.perArea,
        answers: final,
        readinessCategory: bm(result.band.label),
        strongestIndicator: strongest?.id ?? "",
        priorityIndicator: result.weakestAreaId,
        recommendations: recArea ? [`Mulakan dengan bidang: ${bm(recArea.title)}`] : [],
        summary: bm(result.band.message),
        completedAt: new Date().toISOString(),
      };
      await store.saveResult(payload);
      await store.updateParticipant(participantId, {
        readinessScore: result.score,
        readinessCategory: bm(result.band.label),
      });
      await refresh();
    }
  }

  return (
    <SiteLayout>
      <section className="bg-navy-950 text-white">
        <div className={`${SITE_WRAP} py-8`}>
          <span className="section-eyebrow text-gold-300">{t("rdEyebrow")}</span>
          <h1 className="mt-2 font-display text-2xl font-extrabold sm:text-3xl">{t("rdTitle")}</h1>
          <p className="mt-1 text-sm text-navy-200">{t("rdIntro").replace("{n}", String(total))}</p>

          {/* progress */}
          <div className="mt-5 flex items-center gap-1.5">
            {READINESS_AREAS.map((a, i) => (
              <div key={a.id} className="flex flex-1 flex-col items-center gap-1">
                <div className={`h-1.5 w-full rounded-full ${i < step || isResult ? "bg-gold-400" : i === step ? "bg-white/70" : "bg-white/15"}`} />
                <span className="hidden text-[9px] font-semibold text-navy-300 sm:block">{pick(a.radarLabel)}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={`${SITE_WRAP} py-10`}>
        {!isResult ? (
          <QuestionCard
            index={step}
            total={total}
            selected={answers[READINESS_AREAS[step].id]}
            onChoose={(score) => choose(READINESS_AREAS[step].id, score)}
            onBack={step > 0 ? () => setStep(step - 1) : undefined}
          />
        ) : outcome ? (
          <Result outcome={outcome} loggedIn={Boolean(participantId)} />
        ) : null}
      </section>
    </SiteLayout>
  );
}

function QuestionCard({
  index, total, selected, onChoose, onBack,
}: {
  index: number; total: number; selected?: number;
  onChoose: (score: number) => void; onBack?: () => void;
}) {
  const { t, pick, lang } = useI18n();
  const area = READINESS_AREAS[index];
  // In BM and Iban the English title is still a useful second line; in EN and
  // ZH it would just repeat the heading, so it is dropped there.
  const secondary = lang === "en" || lang === "zh" ? "" : pickLang(area.title, "en");
  const questionSecondary = lang === "en" || lang === "zh" ? "" : pickLang(area.question, "en");

  return (
    <div className="mx-auto max-w-2xl">
      <div className="flex items-center gap-2 text-navy-400">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-navy-50 text-navy-700">
          <Icon name={area.icon} className="h-4 w-4" />
        </span>
        <span className="text-xs font-bold uppercase tracking-wide">
          {pick(area.title)}{secondary && ` · ${secondary}`}
        </span>
      </div>
      <h2 className="mt-4 font-display text-xl font-extrabold text-navy-900 sm:text-2xl">
        <span className="mr-2 text-gold-500">{index + 1}.</span>{pick(area.question)}
      </h2>
      {questionSecondary && <p className="mt-1 text-sm text-navy-400">{questionSecondary}</p>}

      <div className="mt-6 space-y-3">
        {area.options.map((o) => {
          const active = selected === o.score;
          const optionSecondary = lang === "en" || lang === "zh" ? "" : pickLang(o.label, "en");
          return (
            <button
              key={o.score}
              onClick={() => onChoose(o.score)}
              className={`flex w-full items-start gap-3 rounded-2xl border p-4 text-left transition ${
                active ? "border-navy-900 bg-navy-50 ring-2 ring-navy-900" : "border-navy-100 bg-white hover:border-navy-300 hover:bg-sand-50"
              }`}
            >
              <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${active ? "border-navy-900 bg-navy-900 text-white" : "border-navy-300"}`}>
                {active && <Icon name="check" className="h-3 w-3" />}
              </span>
              <span>
                <span className="text-sm font-bold text-navy-900">
                  {pick(o.label)}
                  {optionSecondary && <span className="font-normal text-navy-400"> / {optionSecondary}</span>}
                </span>
                <span className="mt-0.5 block text-xs text-navy-500">{pick(o.desc)}</span>
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-6 flex items-center justify-between">
        {onBack ? (
          <button onClick={onBack} className="btn-outline text-sm"><Icon name="arrowLeft" className="h-4 w-4" /> {t("rdPrevious")}</button>
        ) : <span />}
        <span className="text-xs font-semibold text-navy-400">
          {t("rdQuestionOf").replace("{i}", String(index + 1)).replace("{n}", String(total))}
        </span>
      </div>
    </div>
  );
}

function Result({ outcome, loggedIn }: { outcome: ReadinessOutcome; loggedIn: boolean }) {
  const { t, pick } = useI18n();
  const recArea = getWorkArea(outcome.recommendWorkArea);
  const ac = recArea ? areaAccent(recArea.accent) : areaAccent("blue");
  const bandLabel = pick(outcome.band.label);

  return (
    <div className="mx-auto max-w-3xl">
      <div className="card p-6 text-center sm:p-8">
        <div className="flex flex-col items-center">
          <ScoreRing score={outcome.score} label={bandLabel} size={168} />
          <h2 className="mt-4 font-display text-xl font-extrabold text-navy-900 sm:text-2xl">
            {t("rdLevelLabel").replace("{band}", bandLabel)}
          </h2>
          <p className="mt-2 max-w-lg text-sm text-navy-500">{pick(outcome.band.message)}</p>
        </div>

        <div className="mt-6">
          <div className="text-xs font-bold uppercase tracking-wide text-navy-400">{t("rdRadarTitle")}</div>
          <RadarChart
            axes={READINESS_AREAS.map((a) => ({ label: pick(a.radarLabel), value: outcome.perArea[a.id] ?? 0, max: 20 }))}
            size={260}
          />
        </div>
      </div>

      {/* Recommended work area */}
      {recArea && (
        <div className={`mt-6 rounded-3xl border p-6 ${ac.card}`}>
          <div className="text-xs font-bold uppercase tracking-wide text-navy-400">{t("rdRecommendTitle")}</div>
          <div className="mt-3 flex items-start gap-4">
            <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${ac.badge}`}>
              <Icon name={recArea.icon} className="h-6 w-6" />
            </span>
            <div>
              <div className="font-display text-lg font-bold text-navy-900">{pick(recArea.title)}</div>
              <p className="text-sm text-navy-500">{pick(recArea.blurb)}</p>
            </div>
          </div>
          <Link to={`/prompt-hub/${recArea.id}`} className="btn-gold mt-4 w-full sm:w-auto">
            {t("rdStartThisArea")} <Icon name="arrowRight" className="h-5 w-5" />
          </Link>
        </div>
      )}

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Link to="/prompt-hub" className="btn-outline flex-1 justify-center">{t("rdSeeAllAreas")}</Link>
        {loggedIn ? (
          <Link to="/my" className="btn-ghost flex-1 justify-center">{t("rdToMySpace")}</Link>
        ) : (
          <Link to="/check-in" className="btn-ghost flex-1 justify-center">{t("rdRegisterToSave")}</Link>
        )}
      </div>
      {!loggedIn && (
        <p className="mt-3 text-center text-xs text-navy-400">{t("rdSaveNote")}</p>
      )}
    </div>
  );
}
