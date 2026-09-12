import clsx from "clsx";
import type { ThHTMLAttributes } from "react";

interface TableHeadColumnProps extends ThHTMLAttributes<HTMLTableCellElement> {
  align?: "left" | "center" | "right";
}

export function TableHeadColumn({
  align = "left",
  className,
  children,
  ...props
}: TableHeadColumnProps) {
  return (
    <th
      className={clsx(
        "px-4 py-3 text-sm font-semibold text-zinc-600",
        align === "left" && "text-left",
        align === "center" && "text-center",
        align === "right" && "text-right",
        className,
      )}
      {...props}
    >
      {children}
    </th>
  );
}
