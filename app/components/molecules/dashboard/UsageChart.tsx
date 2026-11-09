import type { DailyUsage } from "~/types/dashboard";
import { formatDay, formatNumber } from "~/utils/dashboardFormat";

export interface UsageChartProps {
  days: DailyUsage[];
}

const WIDTH = 600;
const HEIGHT = 160;

/** Barras de sessões (eventos PLAY) por dia, em SVG, sem biblioteca de gráfico. */
export function UsageChart({ days }: UsageChartProps) {
  if (days.length === 0) return null;

  const max = Math.max(1, ...days.map((day) => day.plays));
  const slot = WIDTH / days.length;
  const bar = Math.max(1, slot * 0.7);
  const middle = days[Math.floor(days.length / 2)];

  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT + 22}`}
      className="h-auto w-full overflow-visible"
      role="img"
      aria-label="Sessões de ausculta por dia"
    >
      {[0, 0.5, 1].map((step) => (
        <line
          key={step}
          x1={0}
          x2={WIDTH}
          y1={HEIGHT - HEIGHT * step}
          y2={HEIGHT - HEIGHT * step}
          className="stroke-slate-200"
        />
      ))}

      {days.map((day, index) => {
        const height = (day.plays / max) * HEIGHT;
        return (
          <rect
            key={day.date}
            x={index * slot + (slot - bar) / 2}
            y={HEIGHT - height}
            width={bar}
            height={height}
            rx={2}
            className="fill-main"
          >
            <title>{`${formatDay(day.date)}: ${formatNumber(day.plays)} sessões`}</title>
          </rect>
        );
      })}

      <text x={0} y={10} className="fill-slate-500 text-[10px]">
        {formatNumber(max)}
      </text>
      <text x={0} y={HEIGHT + 16} className="fill-slate-500 text-[10px]">
        {formatDay(days[0].date)}
      </text>
      <text
        x={WIDTH / 2}
        y={HEIGHT + 16}
        textAnchor="middle"
        className="fill-slate-500 text-[10px]"
      >
        {formatDay(middle.date)}
      </text>
      <text
        x={WIDTH}
        y={HEIGHT + 16}
        textAnchor="end"
        className="fill-slate-500 text-[10px]"
      >
        {formatDay(days[days.length - 1].date)}
      </text>
    </svg>
  );
}
