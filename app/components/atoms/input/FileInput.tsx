import type { Ref } from "react";

export interface FileInputProps {
  id: string;
  name: string;
  value: string;
  error?: string;
  ref?: Ref<HTMLInputElement>;
  readOnly?: boolean;
  accept?: string;
  onChange: (file: File | null) => void;
  onBlur?: () => void;
  disabled?: boolean;
}

export function FileInput({
  id,
  name,
  error,
  ref,
  readOnly,
  accept,
  onChange,
  onBlur,
  disabled
}: FileInputProps) {
  return (
    <div className="flex flex-col gap-2">
      <input
        id={id}
        name={name}
        readOnly={readOnly}
        ref={ref}
        disabled={disabled}
        type="file"
        onChange={(event) => onChange(event.target.files?.[0] ?? null)}
        accept={accept}
        onBlur={onBlur}
        className="rounded-lg border border-slate-300 p-3 text-slate-900 outline-none file:mr-4 file:rounded-lg file:border-0 file:bg-slate-200 file:px-4 file:py-2 file:text-slate-900"
      />
      {error && <span className="text-red-500 text-sm">{error}</span>}
    </div>
  );
}
