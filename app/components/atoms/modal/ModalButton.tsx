import { Text } from "../Text";

export interface ModalButtonProps {
  label: string;
  type?: "button" | "submit";
  className: string;
  disabled?: boolean;
  onAction?: () => void;
}

export function ModalButton({ label, disabled, type="button", className, onAction }: ModalButtonProps) {
  return (
    <button
      type={type}
      className={`cursor-pointer rounded-lg px-6 py-3 ${className}`}
      onClick={onAction}
      disabled={disabled}
    >
      <p className="text-slate-900 text-xl line-clamp-3 wrap-break-word">
        {label}
      </p>
    </button>
  );
}
