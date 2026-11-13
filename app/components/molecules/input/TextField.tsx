import type { Ref } from "react";
import { Label } from "../../atoms/input/Label";
import { TextInput } from "../../atoms/input/TextInput";

export interface TextFieldProps {
  id: string;
  name: string;
  placeholder: string;
  type: string;
  label: string;
  value: string;
  error?: string;
  ref?: Ref<HTMLInputElement>;
  readOnly?: boolean;
  onChange: (value: string) => void;
  onBlur: () => void;
}

export function TextField({
  id,
  name,
  placeholder,
  value,
  type,
  label,
  error,
  ref,
  readOnly,
  onChange,
  onBlur,
}: TextFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <Label id={id} name={name} label={label} />
      <TextInput
        id={id}
        readOnly={readOnly}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        error={error}
        ref={ref}
        onChange={onChange}
        onBlur={onBlur}
      />
    </div>
  );
}
