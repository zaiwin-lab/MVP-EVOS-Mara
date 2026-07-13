// Circular progress ring for the total readiness score (0–100).

interface ScoreRingProps {
  score: number; // 0–100
  label?: string;
  size?: number;
}

export function ScoreRing({ score, label, size = 180 }: ScoreRingProps) {
  const stroke = 14;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const clamped = Math.max(0, Math.min(100, score));
  const offset = c - (clamped / 100) * c;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          className="fill-none stroke-navy-100"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          className="fill-none stroke-gold-400 transition-[stroke-dashoffset] duration-1000 ease-out"
          strokeWidth={stroke}
          strokeDasharray={c}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-extrabold text-navy-900">{clamped}</span>
        <span className="text-xs font-semibold text-navy-400">/ 100</span>
        {label && (
          <span className="mt-0.5 text-[11px] font-bold text-gold-600">{label}</span>
        )}
      </div>
    </div>
  );
}
