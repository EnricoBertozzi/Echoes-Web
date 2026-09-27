import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
  type RegisterOptions
} from "react-hook-form";

export interface TextInputWithLabelProps<T extends FieldValues> {
  id?: string;
  name: Path<T>;
  label: string;
  placeholder?: string;
  type: string;
  control: Control<T>;
  rules?: RegisterOptions<T, Path<T>>;
}

export function TextInputWithLabel<T extends FieldValues>({ id, name, label, placeholder, type, control, rules }: TextInputWithLabelProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      rules={{
        ...rules,
      }}
      render={({ field, fieldState: { error } }) => (
        <div className="flex flex-col gap-2">
          <label htmlFor={id || name} className="text-slate-900 text-lg">
            <span>{label}</span>
          </label>
          <div className="relative flex items-center w-full"></div>
          <input
            id={id || name}
            type={type}
            placeholder={placeholder}
            {...field}
            className={`
                w-full px-4 py-3 pr-12 rounded-lg border
                text-slate-900 placeholder-slate-400
                focus:outline-none transition-colors
                ${error ? "border-red-500 focus:border-red-600" : "border-slate-300 focus:border-slate-500"}
                `}
          />
          {error && (
            <span className="text-red-500 text-sm">{error.message}</span>
          )}
        </div>
      )}
    />
  );
}
