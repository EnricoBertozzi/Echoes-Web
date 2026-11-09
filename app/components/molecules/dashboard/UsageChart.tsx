import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import type { DailyUsage } from "~/types/dashboard";
import { formatDay, formatNumber } from "~/utils/dashboardFormat";

interface UsageChartProps {
  days: DailyUsage[];
}

export function UsageChart({ days }: UsageChartProps) {
  if (days.length === 0) {
    return <p className="text-slate-500">Nenhum dado disponível.</p>;
  }

  const data = days.map((day) => ({
    date: formatDay(day.date),
    plays: day.plays,
  }));

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 16, right: 12, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />

          <XAxis dataKey="date" tick={{ fontSize: 12 }} minTickGap={24} />

          <YAxis allowDecimals={false} tick={{ fontSize: 12 }} width={36} />

          <Tooltip
            formatter={(value) => [
              formatNumber(Number(value ?? 0)),
              "Reproduções",
            ]}
          />

          <Bar
            dataKey="plays"
            fill="#0d9488"
            radius={[4, 4, 0, 0]}
            maxBarSize={40}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
