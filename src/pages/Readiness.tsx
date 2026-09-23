import { useState } from "react";
import { Link } from "react-router-dom";
import {
  READINESS_AREAS,
  computeReadiness,
  type ReadinessOutcome,
} from "../content/readiness";
import { getWorkArea } from "../content/promptLibrary";
import { SiteLayout, SITE_WRAP, PageHero } from "../components/SiteChrome";
import { Icon } from "../components/Icon";
import { areaAccent } from "../lib/accents";
import { useParticipant } from "../context/ParticipantContext";
import { useI18n, pick as pickLang } from "../context/I18nContext";
import { store } from "../data/store";
import type { AssessmentResult } from "../data/types";

/** Saved results stay in one language (BM) so the admin export is consistent,
 *  no matter which language the participant took the assessment in. */
const bm = (v: Parameters<typeof pickLang>[0]) => pickLang(v, "bm");

/**
 * Five questions that end in one suggestion: a work area to start with.
 *
 * The scoring engine is unchanged and still saved, because the organiser's
 * export reads it. What changed is what the participant is shown. A score out
 * of 100, a readiness band and a radar chart made five questions look like an
 * audit of the co-operative, which is not what they are and not a claim this
 * programme should make in one day. They now see the recommendation, and an
 * invitation to ignore it.
 */
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
      <PageHero size="sm" eyebrow={t("rdShortEyebrow")} title={t("rdShortTitle")} lede={t("rdShortIntro")}>
        <div className="mt-7 flex items-center gap-1.5">
          {READINESS_AREAS.map((a, i) => (
            <div key={a.id} className="flex flex-1 flex-col items-center gap-1.5">
              <div className={`h-1.5 w-full rounded-full transition ${i < step || isResult ? "bg-gold-400" : i === step ? "bg-white/70" : "bg-white/15"}`} />
              <span className="hidden text-[9px] font-bold uppercase tracking-wide text-white/40 sm:block">{pick(a.radarLabel)}</span>
            </div>
          ))}
        </div>
      </PageHero>

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
          <Result outcome={outcome} />
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

function Result({ outcome }: { outcome: ReadinessOutcome }) {
  const { t, pick } = useI18n();
  const recArea = getWorkArea(outcome.recommendWorkArea);
  const ac = recArea ? areaAccent(recArea.accent) : areaAccent("blue");

  return (
    <div className="mx-auto max-w-2xl">
      <div className="text-center">
        <span className="icon-tile mx-auto h-12 w-12 bg-gold-100 text-gold-700 ring-1 ring-inset ring-gold-200">
          <Icon name="spark" className="h-6 w-6" />
        </span>
        <h2 className="h-section mt-5 text-[22px] sm:text-[27px]">{t("rdSuggestTitle")}</h2>
      </div>

      {recArea && (
        <div className={`mt-7 rounded-3xl border p-6 sm:p-7 ${ac.card}`}>
          <div className="flex items-start gap-4">
            <span className={`icon-tile h-14 w-14 shrink-0 rounded-2xl ${ac.badge}`}>
              <Icon name={recArea.icon} className="h-7 w-7" />
            </span>
            <div className="min-w-0">
              <div className="font-display text-[20px] font-extrabold tracking-[-0.02em] text-navy-950 sm:text-[24px]">
                {pick(recArea.title)}
              </div>
              <p className="mt-1.5 text-[14px] leading-relaxed text-slate2-mut">{pick(recArea.blurb)}</p>
            </div>
          </div>
          <Link to={`/prompt-hub/${recArea.id}`} className="btn-gold mt-6 w-full py-3.5">
            {t("rdStartThisArea")} <Icon name="arrowRight" className="h-5 w-5" />
          </Link>
        </div>
      )}

      <p className="mt-6 text-center text-[14px] text-slate2-mut">{t("rdAlsoExplore")}</p>
      <div className="mt-4">
        <Link to="/prompt-hub" className="btn-outline w-full justify-center">{t("rdSeeAllAreas")}</Link>
      </div>

      <p className="mt-6 text-center text-xs text-slate2-dim">{t("rdGuideNote")}</p>
    </div>
  );
}
