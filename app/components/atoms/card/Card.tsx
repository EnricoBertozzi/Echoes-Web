import clsx from "clsx";

export interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className }: CardProps) {
  return (
    <div
      className={clsx(
        "flex min-w-0 flex-col gap-4 rounded-2xl bg-white p-8 shadow-sm",
        className,
      )}
    >
      {children}
    </div>
  );
}
