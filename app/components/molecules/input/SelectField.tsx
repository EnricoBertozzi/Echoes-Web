import type { ChangeEvent, Ref } from "react";
import { Label } from "../../atoms/input/Label";
import { TextInput } from "../../atoms/input/TextInput";
import { SelectInput } from "~/components/atoms/input/SelectInput";

export interface SelectFieldProps {
  id: string;
  name: string;
  placeholder: string;
  label: string;
  value: string;
  options: Map<string, string>;
  error?: string;
  ref?: Ref<HTMLSelectElement>;
  onChange?: (e: ChangeEvent<HTMLSelectElement, HTMLSelectElement>) => void;
  onBlur: () => void;
}

export function SelectField({
  id,
  name,
  placeholder,
  value,
  label,
  options,
  error,
  ref,
  onChange,
  onBlur,
}: SelectFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <Label id={id} name={name} label={label} />
      <SelectInput
        id={id}
        name={name}
        placeholder={placeholder}
        options={options}
        value={value}
        error={error}
        ref={ref}
        onChange={onChange}
        onBlur={onBlur}
      />
    </div>
  );
}
