import type { ComponentProps } from "react";

export interface ModalButtonProps extends ComponentProps<"button"> {
  label: string;
  variant: "primary" | "secondary" | "danger";
  onAction?: () => void;
}

export function ModalButton({
  label,
  type = "button",
  variant = "secondary",
  className = "",
  disabled,
  onAction,
  ...props
}: ModalButtonProps) {

  const variants = {
    primary: "bg-main text-white",
    secondary: "bg-gray-300 text-black",
    danger: "bg-red-600 text-white",
  };

  return (
    <button
      {...props}
      type={type}
      className={`cursor-pointer rounded px-4 py-2
        ${variants[variant]}
        ${disabled ? "cursor-not-allowed opacity-50" : ""}
        ${className}`}
      onClick={onAction}
      disabled={disabled}
    >
      {label}
    </button>
  );
}
