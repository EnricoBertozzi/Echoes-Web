import clsx from "clsx";
import { dashboardPeriods, type DashboardPeriod } from "~/types/dashboard";

export interface PeriodSelectorProps {
  value: DashboardPeriod;
  onChange: (value: DashboardPeriod) => void;
}

export function PeriodSelector({ value, onChange }: PeriodSelectorProps) {
  return (
    <div
      role="group"
      aria-label="Período"
      className="inline-flex overflow-hidden rounded-lg border border-slate-300 bg-white"
    >
      {dashboardPeriods.map((period) => (
        <button
          key={period}
          type="button"
          aria-pressed={value === period}
          onClick={() => onChange(period)}
          className={clsx(
            "cursor-pointer px-4 py-3 text-sm transition-colors",
            value === period
              ? "bg-main text-white"
              : "text-slate-700 hover:bg-slate-100",
          )}
        >
          {period} dias
        </button>
      ))}
    </div>
  );
}
