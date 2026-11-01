import type { ChangeEvent, Ref } from "react";

export interface SelectInputProps {
  id: string;
  name: string;
  placeholder: string;
  options: Map<string, string>; 
  error?: string;
  value: string
  ref?: Ref<HTMLSelectElement>;
  onChange?: (e: ChangeEvent<HTMLSelectElement, HTMLSelectElement>) => void;
  onBlur?: () => void;
}

export function SelectInput({
  id,
  name,
  placeholder,
  options,
  error,
  ref,
  value,
  onChange,
  onBlur,
}: SelectInputProps) {
  return (
    <div className="flex flex-col gap-2">
      <select
        id={id}
        name={name}
        ref={ref}
        onBlur={onBlur}
        value={value}
        onChange={onChange}
        className={`
                  w-full px-4 py-3 pr-12 rounded-lg border
                  text-slate-900 placeholder-slate-400 bg-transparent appearance-none
                  focus:outline-none transition-colors cursor-pointer
                  ${error ? "border-red-500 focus:border-red-600" : "border-slate-300 focus:border-slate-500"}
                  `}
      >
        <option disabled selected value="">
          <span className="text-slate-400">{placeholder}</span>
        </option>
        {Array.from(options.entries()).map((value, label) => (
          <option value={value}>{label}</option>  
        ))}
        
      </select>
      {error && <span className="text-red-500 text-sm">{error}</span>}
    </div>
  );
}
