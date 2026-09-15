import { Text } from "../Text";

export interface ModalButtonProps {
  label: string;
  type?: "button" | "submit";
  className: string;
  onAction?: () => void;
}

export function ModalButton({ label, type="button", className, onAction }: ModalButtonProps) {
  return (
    <button
      type={type}
      className={`cursor-pointer rounded-lg px-6 py-3 ${className}`}
      onClick={onAction}
    >
      <p className="text-slate-900 text-xl line-clamp-3 wrap-break-word">
        {label}
      </p>
    </button>
  );
}
