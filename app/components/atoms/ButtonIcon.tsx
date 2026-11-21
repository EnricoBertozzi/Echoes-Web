import type { ComponentProps, ReactNode } from "react";

export interface ButtonIconProps
  extends Pick<ComponentProps<"button">, "disabled" | "onClick"> {
  children: ReactNode;
  label: string;
}

export function ButtonIcon({ children, label, ...props }: ButtonIconProps) {
  return (
    <button
      {...props}
      type="button"
      aria-label={label}
      title={label}
      className="grid size-11 shrink-0 cursor-pointer place-items-center rounded-lg hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-main disabled:cursor-not-allowed disabled:opacity-40"
    >
      {children}
    </button>
  );
}
