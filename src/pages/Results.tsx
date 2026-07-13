import { useNavigate } from "react-router-dom";
import { AppShell } from "../components/AppShell";
import { BrandFooter } from "../components/Brand";
import { Icon } from "../components/Icon";
import { ScoreRing } from "../components/ScoreRing";
import { RadarChart } from "../components/RadarChart";
import { INDICATORS } from "../content/assessment";
import { useParticipant } from "../context/ParticipantContext";

const TONE_STYLES: Record<string, string> = {
  foundation: "bg-orange-50 text-orange-700",
  developing: "bg-amber-50 text-amber-700",
  ready: "bg-sky-50 text-sky-700",
  competitive: "bg-emerald-50 text-emerald-700",
  future: "bg-green-50 text-green-700",
};

export default function Results() {
  const navigate = useNavigate();
  const { record, loading } = useParticipant();
  const result = record?.result;

  if (loading) {
    return (
      <AppShell header title="My Result">
        <div className="flex flex-1 items-center justify-center py-20 text-sm text-navy-400">
          Loading…
        </div>
      </AppShell>
    );
  }

  if (!result) {
    return (
      <AppShell header title="My Result">
        <div className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
          <Icon name="chart" className="h-10 w-10 text-navy-300" />
          <h2 className="mt-4 font-display text-lg font-extrabold text-navy-900">
            No result yet
          </h2>
          <p className="mt-1 max-w-xs text-sm text-navy-500">
            Complete the Contractor Readiness Assessment to see your personalised
            result.
          </p>
          <button onClick={() => navigate("/assessment")} className="btn-gold mt-6 w-full">
            Start Assessment
            <Icon name="arrowRight" className="h-5 w-5" />
          </button>
        </div>
      </AppShell>
    );
  }

  const toneKey =
    ["Foundation Stage", "Developing Contractor", "Opportunity Ready", "Competitive Contractor", "Future-Ready Contractor"].indexOf(
      result.readinessCategory
    );
  const tones = ["foundation", "developing", "ready", "competitive", "future"];
  const tone = TONE_STYLES[tones[toneKey] ?? "ready"];

  return (
    <AppShell
      header
      title="My Readiness Result"
      onBack={() => navigate("/journey")}
      footer={
        <button onClick={() => navigate("/action-plan")} className="btn-gold w-full">
          Build My 90-Day Action Plan
          <Icon name="arrowRight" className="h-5 w-5" />
        </button>
      }
    >
      {/* Hero score */}
      <section className="bg-navy-950 px-5 pb-8 pt-6 text-center text-white">
        <div className="text-sm font-semibold text-navy-200">
          Your Contractor Readiness Result
        </div>
        <div className="mt-0.5 font-display text-lg font-extrabold">
          {record?.participant.companyName}
        </div>
        <div className="mt-5 flex justify-center">
          <div className="rounded-full bg-white/5 p-3">
            <ScoreRing score={result.totalScore} />
          </div>
        </div>
        <div className={`mx-auto mt-5 inline-flex rounded-full px-4 py-1.5 text-sm font-bold ${tone}`}>
          {result.readinessCategory}
        </div>
      </section>

      {/* Radar */}
      <section className="px-5 py-6">
        <h3 className="section-eyebrow">Your Readiness Profile</h3>
        <div className="card mt-3 p-4">
          <RadarChart
            axes={INDICATORS.map((i) => ({
              label: i.radarLabel,
              value: result.indicatorScores[i.id] ?? 0,
              max: 20,
            }))}
          />
        </div>
      </section>

      {/* Indicator score cards */}
      <section className="px-5 pb-2">
        <h3 className="section-eyebrow">Indicator Scores</h3>
        <div className="mt-3 space-y-2.5">
          {INDICATORS.map((ind) => {
            const score = result.indicatorScores[ind.id] ?? 0;
            const pct = (score / 20) * 100;
            const isStrong = ind.title === result.strongestIndicator;
            const isPriority = ind.title === result.priorityIndicator;
            return (
              <div key={ind.id} className="card p-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-navy-50 text-navy-700">
                    <Icon name={ind.icon} className="h-5 w-5" />
                  </span>
                  <span className="flex-1 text-sm font-bold text-navy-900">{ind.title}</span>
                  <span className="text-sm font-extrabold text-navy-900">
                    {score}
                    <span className="text-xs font-semibold text-navy-400">/20</span>
                  </span>
                </div>
                <div className="mt-2.5 h-2 w-full overflow-hidden rounded-full bg-navy-100">
                  <div
                    className={`h-full rounded-full ${isPriority ? "bg-orange-400" : "bg-gold-400"}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                {(isStrong || isPriority) && (
                  <div className="mt-2">
                    <span
                      className={`chip ${
                        isStrong ? "bg-green-50 text-green-700" : "bg-orange-50 text-orange-700"
                      }`}
                    >
                      {isStrong ? "★ Strongest area" : "◆ Priority to improve"}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Strength / priority summary */}
      <section className="px-5 py-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-green-50 p-4">
            <div className="text-xs font-bold uppercase tracking-wide text-green-700">
              Strongest Area
            </div>
            <div className="mt-1 text-sm font-bold text-navy-900">
              {result.strongestIndicator}
            </div>
          </div>
          <div className="rounded-2xl bg-orange-50 p-4">
            <div className="text-xs font-bold uppercase tracking-wide text-orange-700">
              Priority to Improve
            </div>
            <div className="mt-1 text-sm font-bold text-navy-900">
              {result.priorityIndicator}
            </div>
          </div>
        </div>
      </section>

      {/* Personalised summary */}
      <section className="px-5 py-2">
        <div className="card border-l-4 border-l-gold-400 p-5">
          <h3 className="section-eyebrow">Personalised Summary</h3>
          <p className="mt-2 text-sm leading-relaxed text-navy-700">{result.summary}</p>
        </div>
      </section>

      {/* Next actions */}
      <section className="px-5 py-6">
        <h3 className="section-eyebrow">Recommended Next Three Actions</h3>
        <ol className="mt-3 space-y-2.5">
          {result.recommendations.map((rec, i) => (
            <li key={i} className="flex gap-3 rounded-xl border border-navy-100 bg-white p-4">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-navy-800 text-sm font-bold text-white">
                {i + 1}
              </span>
              <span className="text-sm font-medium leading-relaxed text-navy-700">{rec}</span>
            </li>
          ))}
        </ol>
      </section>

      <BrandFooter />
    </AppShell>
  );
}
