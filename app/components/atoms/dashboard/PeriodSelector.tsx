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
      className="inline-flex w-full overflow-hidden rounded-lg border border-slate-300 bg-white sm:w-auto"
    >
      {dashboardPeriods.map((period) => (
        <button
          key={period}
          type="button"
          aria-pressed={value === period}
          onClick={() => onChange(period)}
          className={clsx(
            "min-h-11 flex-1 cursor-pointer px-2 py-3 text-sm whitespace-nowrap transition-colors sm:px-4",
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
