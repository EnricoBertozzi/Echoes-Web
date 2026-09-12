import clsx from "clsx";
import type { ButtonHTMLAttributes, ReactNode } from "react";

interface NavbarButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  label: string;
  active?: boolean;
}

export function NavbarButton({
  icon,
  label,
  active = false,
  className,
  ...props
}: NavbarButtonProps) {
  return (
    <button
      className={clsx(
        "flex w-full cursor-pointer items-center gap-3 rounded px-3 py-2 text-left text-sm text-white/80 transition-colors",
        active ? "bg-white/10 text-white" : "hover:bg-white/5 hover:text-white",
        className,
      )}
      {...props}
    >
      <span className="text-lg">{icon}</span>
      <span>{label}</span>
    </button>
  );
}
