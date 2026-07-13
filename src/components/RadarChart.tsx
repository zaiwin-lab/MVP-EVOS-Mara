// Dependency-free SVG radar chart for the five readiness indicators.
// Values are 0–20 (per indicator). Kept simple and legible on mobile.

interface RadarChartProps {
  axes: { label: string; value: number; max: number }[];
  size?: number;
}

export function RadarChart({ axes, size = 260 }: RadarChartProps) {
  const padX = 40; // horizontal breathing room so edge labels aren't clipped
  const cx = size / 2;
  const cy = size / 2;
  const radius = size / 2 - 48;
  const n = axes.length;

  const angleFor = (i: number) => (Math.PI * 2 * i) / n - Math.PI / 2;

  const point = (i: number, r: number) => {
    const a = angleFor(i);
    return [cx + Math.cos(a) * r, cy + Math.sin(a) * r] as const;
  };

  const rings = [0.25, 0.5, 0.75, 1];

  const valuePoints = axes.map((ax, i) => {
    const ratio = Math.max(0, Math.min(1, ax.value / ax.max));
    return point(i, radius * ratio);
  });

  const polygon = valuePoints.map((p) => p.join(",")).join(" ");

  return (
    <svg
      viewBox={`${-padX} 0 ${size + padX * 2} ${size}`}
      className="mx-auto h-auto w-full max-w-[320px]"
      role="img"
      aria-label="Readiness radar chart"
    >
      {/* grid rings */}
      {rings.map((ring, ri) => (
        <polygon
          key={ri}
          points={axes
            .map((_, i) => point(i, radius * ring).join(","))
            .join(" ")}
          className="fill-none stroke-navy-100"
          strokeWidth={1}
        />
      ))}

      {/* spokes */}
      {axes.map((_, i) => {
        const [x, y] = point(i, radius);
        return (
          <line
            key={i}
            x1={cx}
            y1={cy}
            x2={x}
            y2={y}
            className="stroke-navy-100"
            strokeWidth={1}
          />
        );
      })}

      {/* value area */}
      <polygon
        points={polygon}
        className="fill-gold-400/25 stroke-gold-500"
        strokeWidth={2}
        strokeLinejoin="round"
      />

      {/* value dots */}
      {valuePoints.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={3.5} className="fill-navy-800" />
      ))}

      {/* labels */}
      {axes.map((ax, i) => {
        const [x, y] = point(i, radius + 20);
        const anchor = Math.abs(x - cx) < 6 ? "middle" : x > cx ? "start" : "end";
        return (
          <text
            key={i}
            x={x}
            y={y}
            textAnchor={anchor}
            dominantBaseline="middle"
            className="fill-navy-600 text-[9px] font-semibold"
          >
            {ax.label}
          </text>
        );
      })}
    </svg>
  );
}
