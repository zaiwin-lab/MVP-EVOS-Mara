// ─────────────────────────────────────────────────────────────
// PROMPT LIBRARY — translation layer
//
// promptLibrary.ts holds the Bahasa Melayu wording and the English
// mission titles. This file carries the English one-line descriptions
// for the parts participants BROWSE.
//
// The prompt TEMPLATE text (role, task, deliverables) stays in Bahasa
// Melayu on purpose: it is what gets pasted into ChatGPT, Claude or
// Gemini, and the programme teaches it in BM.
//
// Where a key is missing, pick() falls back to Bahasa Melayu, so
// deleting a doubtful line is always safe.
// ─────────────────────────────────────────────────────────────

import type { Localized } from "../context/I18nContext";

export const AREA_I18N: Record<string, { title?: Localized; blurb?: Localized }> = {
  leadership: { blurb: { en: "Decide with more confidence; run a tidier office." } },
  people:     { blurb: { en: "Build and lead the right team." } },
  operations: { blurb: { en: "Smoother work, better-managed time." } },
  marketing:  { blurb: { en: "A clearer brand and sharper marketing." } },
  sales:      { blurb: { en: "More sales from the same effort." } },
  finance:    { blurb: { en: "Numbers you understand, decisions you trust." } },
};

export const MISSION_I18N: Record<string, { title?: Localized; desc?: Localized }> = {
  A1: { desc: { en: "Make a major decision with more confidence." } },
  A2: { desc: { en: "Turn meeting notes into a summary and action list." } },
  A3: { desc: { en: "Build a clear action plan for your management team." } },
  A4: { desc: { en: "Draft a professional, precise official letter." } },
  A5: { desc: { en: "Turn a working process into a written SOP." } },
  A6: { desc: { en: "Find the real cause, not the symptom." } },
  A7: { desc: { en: "Assemble a monthly report people actually read." } },
  A8: { desc: { en: "Structure a presentation that convinces." } },
  A9: { desc: { en: "Decide what actually comes first." } },
  A10: { desc: { en: "Turn a goal into a 90-day plan." } },
  B1: { desc: { en: "Draft a clear, attractive job description." } },
  B2: { desc: { en: "Prepare questions that reveal real capability." } },
  B3: { desc: { en: "Compare candidates fairly and systematically." } },
  B4: { desc: { en: "Build KPIs that are measurable and fair." } },
  B5: { desc: { en: "Prepare a constructive performance review." } },
  B6: { desc: { en: "Plan growth for a promising team member." } },
  B7: { desc: { en: "Identify the training that is actually needed." } },
  B8: { desc: { en: "Draft a clear internal announcement." } },
  B9: { desc: { en: "Practical ideas to lift team morale." } },
  B10: { desc: { en: "Address underperformance firmly and fairly." } },
  C1: { desc: { en: "Cut the steps that waste time." } },
  C2: { desc: { en: "Write an SOP for daily work." } },
  C3: { desc: { en: "Build a short operational checklist." } },
  C4: { desc: { en: "Find where the work gets stuck." } },
  C5: { desc: { en: "Spot the work that can be automated." } },
  C6: { desc: { en: "Compare suppliers systematically." } },
  C7: { desc: { en: "Plan stock without over- or under-buying." } },
  C8: { desc: { en: "Build quality control that is easy to run." } },
  C9: { desc: { en: "Assemble the weekly operations report." } },
  C10: { desc: { en: "Find ways the team can work smarter." } },
  D1: { desc: { en: "Build a marketing plan you can actually run." } },
  D2: { desc: { en: "Understand your customer more precisely." } },
  D3: { desc: { en: "Produce a campaign concept that stands out." } },
  D4: { desc: { en: "Produce a month of content in one go." } },
  D5: { desc: { en: "Write ad copy that earns a click." } },
  D6: { desc: { en: "Lay out a month of content." } },
  D7: { desc: { en: "Clarify where your brand stands." } },
  D8: { desc: { en: "Understand your competitors properly." } },
  D9: { desc: { en: "Plan a promotion without wrecking margin." } },
  D10: { desc: { en: "Judge what worked and what did not." } },
  E1: { desc: { en: "Build a sales script that does not sound pushy." } },
  E2: { desc: { en: "Draft follow-up messages that get replies." } },
  E3: { desc: { en: "Identify which leads are worth your time." } },
  E4: { desc: { en: "Structure a proposal that wins." } },
  E5: { desc: { en: "Prepare answers for common objections." } },
  E6: { desc: { en: "Keep the relationship alive after the sale." } },
  E7: { desc: { en: "Suggest upgrades that make sense." } },
  E8: { desc: { en: "Pair products that belong together." } },
  E9: { desc: { en: "See where deals are getting stuck." } },
  E10: { desc: { en: "Win back customers who went quiet." } },
  F1: { desc: { en: "See where the money actually goes." } },
  F2: { desc: { en: "Understand and plan your cash flow." } },
  F3: { desc: { en: "Price in a way that reflects value." } },
  F4: { desc: { en: "Work out when the business starts earning." } },
  F5: { desc: { en: "Identify which products really earn." } },
  F6: { desc: { en: "Build a budget you can live with." } },
  F7: { desc: { en: "Cut costs without cutting quality." } },
  F8: { desc: { en: "Forecast revenue with clear assumptions." } },
  F9: { desc: { en: "Compare investment options systematically." } },
  F10: { desc: { en: "Decide which numbers to watch." } },
};
