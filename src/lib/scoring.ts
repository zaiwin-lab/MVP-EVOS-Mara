// ─────────────────────────────────────────────────────────────
// SCORING — turns raw answers into indicator scores, a total,
// a readiness category, and rule-based recommendations.
// Pure functions, easy to unit-test.
// ─────────────────────────────────────────────────────────────

import {
  INDICATORS,
  RESULT_CATEGORIES,
  type Indicator,
  type ResultCategory,
} from "../content/assessment";

export interface ScoreBreakdown {
  totalScore: number;
  indicatorScores: Record<string, number>;
  category: ResultCategory;
  strongest: Indicator;
  priority: Indicator; // lowest-scoring — the priority improvement area
  recommendations: string[];
  summary: string;
}

/** Sum of the four 1–5 answers gives 0–20 per indicator (4×5 = 20). */
export function scoreIndicator(
  indicator: Indicator,
  answers: Record<string, number>
): number {
  return indicator.questions.reduce((sum, q) => sum + (answers[q.id] || 0), 0);
}

export function categoryFor(total: number): ResultCategory {
  return (
    RESULT_CATEGORIES.find((c) => total >= c.min && total <= c.max) ??
    RESULT_CATEGORIES[0]
  );
}

export function computeScore(answers: Record<string, number>): ScoreBreakdown {
  const indicatorScores: Record<string, number> = {};
  for (const ind of INDICATORS) {
    indicatorScores[ind.id] = scoreIndicator(ind, answers);
  }

  const totalScore = Object.values(indicatorScores).reduce((a, b) => a + b, 0);

  // Strongest = highest score; Priority = lowest score.
  // Ties resolve by indicator order (stable, predictable).
  const ranked = [...INDICATORS].sort(
    (a, b) => indicatorScores[b.id] - indicatorScores[a.id]
  );
  const strongest = ranked[0];
  const priority = ranked[ranked.length - 1];

  // Recommendations: pull the practical actions from the two
  // lowest-scoring indicators, capped at three.
  const weakest = [...INDICATORS]
    .sort((a, b) => indicatorScores[a.id] - indicatorScores[b.id])
    .slice(0, 2);
  const recommendations: string[] = [];
  for (const ind of weakest) {
    for (const action of ind.actions) {
      if (recommendations.length < 3 && !recommendations.includes(action)) {
        recommendations.push(action);
      }
    }
  }
  // If everything is strong, still give forward-looking guidance.
  if (recommendations.length < 3) {
    for (const action of strongest.actions) {
      if (recommendations.length < 3 && !recommendations.includes(action)) {
        recommendations.push(action);
      }
    }
  }

  const category = categoryFor(totalScore);
  const summary =
    `Your company demonstrates ${strongest.strengthPhrase}. ` +
    `Your greatest opportunity is ${priority.improvePhrase}. ` +
    `Focusing here will move you towards the next readiness level.`;

  return {
    totalScore,
    indicatorScores,
    category,
    strongest,
    priority,
    recommendations: recommendations.slice(0, 3),
    summary,
  };
}
