import { Icon } from "./Icon";

export interface JourneyStep {
  key: string;
  label: string;
  done: boolean;
  current?: boolean;
}

/** Compact stepper used across the participant journey. */
export function JourneyProgress({ steps }: { steps: JourneyStep[] }) {
  const doneCount = steps.filter((s) => s.done).length;
  const pct = Math.round((doneCount / steps.length) * 100);

  return (
    <div className="px-5 py-4">
      <div className="mb-2 flex items-center justify-between text-xs font-semibold text-navy-500">
        <span>Your journey</span>
        <span>{pct}% complete</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-navy-100">
        <div
          className="h-full rounded-full bg-gold-400 transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <ol className="mt-4 grid grid-cols-5 gap-1">
        {steps.map((s) => (
          <li key={s.key} className="flex flex-col items-center gap-1 text-center">
            <span
              className={`flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-bold ${
                s.done
                  ? "bg-navy-800 text-white"
                  : s.current
                    ? "bg-gold-400 text-navy-900 ring-4 ring-gold-100"
                    : "bg-navy-100 text-navy-400"
              }`}
            >
              {s.done ? <Icon name="check" className="h-4 w-4" /> : null}
            </span>
            <span
              className={`text-[9px] font-semibold leading-tight ${
                s.current ? "text-navy-800" : "text-navy-400"
              }`}
            >
              {s.label}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}
