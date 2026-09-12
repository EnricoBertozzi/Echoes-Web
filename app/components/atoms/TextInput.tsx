import clsx from "clsx";
import type { InputHTMLAttributes } from "react";

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function TextInput({
  label,
  error,
  id,
  className,
  ...props
}: TextInputProps) {
  return (
    <label className="flex flex-col gap-1 text-sm text-zinc-700" htmlFor={id}>
      {label && <span className="font-medium">{label}</span>}
      <input
        id={id}
        className={clsx(
          "rounded border border-zinc-400 bg-white px-4 py-2 text-black outline-none",
          "focus:border-main",
          error && "border-red-600",
          className,
        )}
        {...props}
      />
      {error && <span className="text-xs text-red-600">{error}</span>}
    </label>
  );
}
