import clsx from "clsx";

import type { TermStatus } from "~/types/terms";
import { termStatusLabels } from "~/types/terms";

const badgeStyles: Record<TermStatus, string> = {
  PUBLISHED: "bg-emerald-100 text-emerald-800",
  APPROVED: "bg-lime-100 text-lime-800",
  IN_REVIEW: "bg-yellow-100 text-yellow-800",
  DRAFT: "bg-slate-100 text-slate-700",
  ARCHIVED: "bg-zinc-200 text-zinc-600",
};

export interface TermStatusBadgeProps {
  status: TermStatus;
  className?: string;
}

export function TermStatusBadge({ status, className }: TermStatusBadgeProps) {
  return (
    <span
      className={clsx(
        "w-fit rounded px-2 py-0.5 text-xs font-semibold",
        badgeStyles[status],
        className,
      )}
    >
      {termStatusLabels[status]}
    </span>
  );
}
