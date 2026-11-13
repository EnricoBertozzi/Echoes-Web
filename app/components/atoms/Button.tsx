import type { ComponentProps } from "react";

export interface ButtonProps extends ComponentProps<"button"> {
  label: string;
  variant: "primary" | "muted" | "danger";
}

export function Button({ label, variant = "primary", ...props }: ButtonProps) {
  const styles = {
    primary: "bg-main text-white",
    muted: "bg-gray-300 text-black",
    danger: "bg-red-600 text-white",
  };

  return (
    <button
      {...props}
      className={` ${styles[variant]} w-full py-3 rounded cursor-pointer flex justify-center items-center disabled:opacity-50 disabled:cursor-progress`}
    >
      {label}
    </button>
  );
}
