import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppShell } from "../components/AppShell";
import { Icon } from "../components/Icon";
import {
  ANSWER_SCALE,
  ASSESSMENT,
  INDICATORS,
  TOTAL_QUESTIONS,
} from "../content/assessment";
import { computeScore } from "../lib/scoring";
import { store } from "../data/store";
import { useParticipant } from "../context/ParticipantContext";
import { useI18n } from "../context/I18nContext";

// Flatten questions with their indicator for a single linear flow.
const FLAT = INDICATORS.flatMap((ind) =>
  ind.questions.map((q) => ({ ...q, indicator: ind }))
);

export default function Assessment() {
  const navigate = useNavigate();
  const { participantId, refresh, loading } = useParticipant();
  const { lang } = useI18n();
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [idx, setIdx] = useState(0);
  const [saving, setSaving] = useState(false);

  const current = FLAT[idx];
  const answered = Object.keys(answers).length;
  const pct = Math.round((answered / TOTAL_QUESTIONS) * 100);

  const questionText = useMemo(
    () => (lang === "bm" && current?.textLocal ? current.textLocal : current?.text),
    [current, lang]
  );

  if (!loading && !participantId) {
    return (
      <AppShell header title="Assessment">
        <div className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
          <Icon name="lock" className="h-10 w-10 text-navy-300" />
          <h2 className="mt-4 font-display text-lg font-extrabold text-navy-900">
            Please check in first
          </h2>
          <button onClick={() => navigate("/check-in")} className="btn-gold mt-6 w-full">
            Check In Now
          </button>
        </div>
      </AppShell>
    );
  }

  function choose(value: number) {
    const next = { ...answers, [current.id]: value };
    setAnswers(next);
    // auto-advance for a smooth flow
    setTimeout(() => {
      if (idx < FLAT.length - 1) setIdx((i) => i + 1);
    }, 220);
  }

  async function finish() {
    if (!participantId) return;
    setSaving(true);
    try {
      const breakdown = computeScore(answers);
      await store.saveResult({
        participantId,
        totalScore: breakdown.totalScore,
        indicatorScores: breakdown.indicatorScores,
        answers,
        readinessCategory: breakdown.category.label,
        strongestIndicator: breakdown.strongest.title,
        priorityIndicator: breakdown.priority.title,
        recommendations: breakdown.recommendations,
        summary: breakdown.summary,
        completedAt: new Date().toISOString(),
      });
      await refresh();
      navigate("/result");
    } finally {
      setSaving(false);
    }
  }

  const isLast = idx === FLAT.length - 1;
  const currentAnswered = answers[current.id] !== undefined;
  const allAnswered = answered === TOTAL_QUESTIONS;

  return (
    <AppShell
      header
      title={ASSESSMENT.publicLabel}
      onBack={() => (idx === 0 ? navigate("/journey") : setIdx((i) => i - 1))}
      footer={
        <div className="flex gap-3">
          {idx > 0 && (
            <button onClick={() => setIdx((i) => i - 1)} className="btn-outline flex-1">
              <Icon name="arrowLeft" className="h-4 w-4" />
              Back
            </button>
          )}
          {isLast ? (
            <button
              onClick={finish}
              disabled={!allAnswered || saving}
              className="btn-gold flex-[2]"
            >
              {saving ? "Calculating…" : "See My Result"}
              {!saving && <Icon name="arrowRight" className="h-5 w-5" />}
            </button>
          ) : (
            <button
              onClick={() => setIdx((i) => i + 1)}
              disabled={!currentAnswered}
              className="btn-primary flex-[2]"
            >
              Next
              <Icon name="arrowRight" className="h-5 w-5" />
            </button>
          )}
        </div>
      }
    >
      {/* progress */}
      <div className="px-5 pt-5">
        <div className="flex items-center justify-between text-xs font-semibold text-navy-500">
          <span>
            Question {idx + 1} of {TOTAL_QUESTIONS}
          </span>
          <span>{pct}% answered</span>
        </div>
        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-navy-100">
          <div className="h-full rounded-full bg-gold-400 transition-all" style={{ width: `${pct}%` }} />
        </div>
      </div>

      <div className="flex flex-1 flex-col px-5 py-6">
        {/* indicator chip */}
        <div className="mb-4 flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gold-50 text-gold-600">
            <Icon name={current.indicator.icon} className="h-5 w-5" />
          </span>
          <span className="text-xs font-bold uppercase tracking-wide text-navy-400">
            Indicator {current.indicator.index} · {current.indicator.titleShort}
          </span>
        </div>

        <h2 className="font-display text-xl font-bold leading-snug text-navy-900">
          {questionText}
        </h2>

        {/* answer scale */}
        <div className="mt-6 space-y-2.5" key={current.id}>
          {ANSWER_SCALE.map((opt) => {
            const active = answers[current.id] === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => choose(opt.value)}
                className={`flex w-full items-center gap-3 rounded-xl border p-3.5 text-left transition ${
                  active
                    ? "border-navy-800 bg-navy-800 text-white shadow-card"
                    : "border-navy-100 bg-white text-navy-700 hover:border-navy-300"
                }`}
              >
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                    active ? "bg-gold-400 text-navy-900" : "bg-navy-50 text-navy-500"
                  }`}
                >
                  {opt.value}
                </span>
                <span className="text-sm font-semibold">
                  {lang === "bm" && opt.labelLocal ? opt.labelLocal : opt.label}
                </span>
                {active && <Icon name="check" className="ml-auto h-5 w-5 text-gold-300" />}
              </button>
            );
          })}
        </div>

        <p className="mt-5 text-center text-xs text-navy-400">
          Answer honestly — there are no wrong answers. This helps us give you the
          most useful recommendations.
        </p>
      </div>
    </AppShell>
  );
}
