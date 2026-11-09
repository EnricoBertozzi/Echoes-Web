import type { Ref } from "react";

export interface TextInputProps {
  id: string;
  name: string;
  type: string;
  placeholder: string;
  value: string;
  error?: string;
  ref?: Ref<HTMLInputElement>;
  onChange: (value: string) => void;
  onBlur?: () => void;
}

export function TextInput({
  id,
  name,
  type,
  placeholder,
  error,
  ref,
  onChange,
  onBlur,
}: TextInputProps) {
  return (
    <div className="flex flex-col gap-2">
      <input
        id={id}
        name={name}
        type={type}
        onChange={(event) => onChange(event.target.value)}
        onBlur={onBlur}
        placeholder={placeholder}
        ref={ref}
        className={`
                  w-full px-4 py-3 pr-12 rounded-lg border
                  text-slate-900 placeholder-slate-400
                  focus:outline-none transition-colors
                  ${error ? "border-red-500 focus:border-red-600" : "border-slate-300 focus:border-slate-500"}
                  `}
      />
      {error && <span className="text-red-500 text-sm">{error}</span>}
    </div>
  );
}
