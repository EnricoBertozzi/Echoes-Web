import type { ComponentProps } from "react";

export interface ButtonProps extends ComponentProps<"button"> {
  label: string;
  variant?: "primary" | "muted" | "danger";
}

export function Button({ label, variant = "primary", className, ...props }: ButtonProps) {
  const styles = {
    primary: "bg-main text-white",
    muted: "bg-gray-300 text-black",
    danger: "bg-red-600 text-white",
  };

  return (
    <button
      {...props}
      className={`${styles[variant]} flex w-full cursor-pointer items-center justify-center rounded py-3 disabled:cursor-progress disabled:opacity-50 ${className ?? ""}`}
    >
      {label}
    </button>
  );
}
