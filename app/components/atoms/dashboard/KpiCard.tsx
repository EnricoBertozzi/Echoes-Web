import clsx from "clsx";

export interface KpiCardProps {
  label: string;
  value: string;
  /** Texto pequeno abaixo do valor (ex.: variação). */
  detail?: string;
  tone?: "default" | "good" | "bad" | "muted";
}

const toneStyles = {
  default: "text-slate-500",
  good: "text-green-700",
  bad: "text-red-700",
  muted: "text-slate-500",
};

export function KpiCard({ label, value, detail, tone = "default" }: KpiCardProps) {
  return (
    <div className="flex min-w-0 flex-col gap-1 rounded-2xl bg-white p-6 shadow-sm">
      <span className="text-sm font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </span>
      <span className="text-4xl font-bold tabular-nums text-slate-900">
        {value}
      </span>
      {detail != null && (
        <span className={clsx("text-sm", toneStyles[tone])}>{detail}</span>
      )}
    </div>
  );
}
