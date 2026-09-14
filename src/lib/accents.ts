// Pastel accent classes per work area. Full literal class strings so
// Tailwind's JIT keeps them (no dynamic class construction).

export interface Accent {
  card: string; // border + pastel bg for a card
  badge: string; // icon badge bg + text
  text: string; // accent text
  bar: string; // solid accent bar (progress / rails)
  soft: string; // very soft chip bg
}

const ACCENTS: Record<string, Accent> = {
  violet: { card: "border-violet-100 bg-violet-50/60", badge: "bg-violet-100 text-violet-700", text: "text-violet-700", bar: "bg-violet-500", soft: "bg-violet-100 text-violet-700" },
  blue: { card: "border-sky-100 bg-sky-50/60", badge: "bg-sky-100 text-sky-700", text: "text-sky-700", bar: "bg-sky-500", soft: "bg-sky-100 text-sky-700" },
  rose: { card: "border-rose-100 bg-rose-50/60", badge: "bg-rose-100 text-rose-700", text: "text-rose-700", bar: "bg-rose-500", soft: "bg-rose-100 text-rose-700" },
  emerald: { card: "border-emerald-100 bg-emerald-50/60", badge: "bg-emerald-100 text-emerald-700", text: "text-emerald-700", bar: "bg-emerald-500", soft: "bg-emerald-100 text-emerald-700" },
  amber: { card: "border-amber-100 bg-amber-50/60", badge: "bg-amber-100 text-amber-700", text: "text-amber-700", bar: "bg-amber-500", soft: "bg-amber-100 text-amber-800" },
  indigo: { card: "border-indigo-100 bg-indigo-50/60", badge: "bg-indigo-100 text-indigo-700", text: "text-indigo-700", bar: "bg-indigo-500", soft: "bg-indigo-100 text-indigo-700" },
};

export function areaAccent(key: string): Accent {
  return ACCENTS[key] ?? ACCENTS.blue;
}
