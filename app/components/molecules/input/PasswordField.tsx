import { type Ref } from "react";
import { Label } from "~/components/atoms/input/Label";
import { PasswordInput } from "~/components/atoms/input/PasswordInput";

export interface PasswordFieldProps {
  id: string;
  name: string;
  placeholder: string;
  label: string;
  value: string;
  error?: string;
  ref?: Ref<HTMLInputElement>;
  onChange: (value: string) => void;
  onBlur: () => void;
}

export function PasswordField({
  id,
  name,
  placeholder,
  label,
  value,
  error,
  ref,
  onChange,
  onBlur,
}: PasswordFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <Label id={id} name={name} label={label} />
      <PasswordInput
        id={id}
        name={name}
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
