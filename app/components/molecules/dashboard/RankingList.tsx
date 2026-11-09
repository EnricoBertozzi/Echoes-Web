import { formatNumber } from "~/utils/dashboardFormat";

export interface RankingItem {
  id: string;
  label: string;
  value: number;
  detail?: string;
}

export interface RankingListProps {
  items: RankingItem[];
  emptyMessage: string;
}

export function RankingList({ items, emptyMessage }: RankingListProps) {
  if (items.length === 0) {
    return <p className="text-slate-500">{emptyMessage}</p>;
  }

  const max = Math.max(1, ...items.map((item) => item.value));

  return (
    <ol className="flex flex-col gap-3">
      {items.map((item) => (
        <li key={item.id} className="flex flex-col gap-1">
          <div className="flex items-baseline justify-between gap-4">
            <span className="line-clamp-1 text-slate-900">{item.label}</span>
            <span className="shrink-0 tabular-nums text-slate-500">
              {formatNumber(item.value)}
              {item.detail ? ` · ${item.detail}` : ""}
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-slate-100">
            <span
              className="block h-full bg-main"
              style={{ width: `${(item.value / max) * 100}%` }}
            />
          </div>
        </li>
      ))}
    </ol>
  );
}
