import clsx from "clsx";

export interface TableHeadColumnProps {
  children?: any;
  className?: string;
}

export function TableHeadColumn({ children, className }: TableHeadColumnProps) {
  return (
    <th scope="col" className={clsx('px-6 py-3 font-medium', className)}>{children}</th>
  )
}
