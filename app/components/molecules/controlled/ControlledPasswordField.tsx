import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
  type RegisterOptions,
} from "react-hook-form";
import { PasswordField } from "../input/PasswordField";

export interface ControlledPasswordFieldProps<T extends FieldValues> {
  id: string;
  name: Path<T>;
  label: string;
  placeholder: string;
  control: Control<T>;
  rules: RegisterOptions<T, Path<T>>;
}

export function ControlledPasswordField<T extends FieldValues>({
  id,
  name,
  label,
  placeholder,
  control,
  rules
}: ControlledPasswordFieldProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState: { error } }) => (
        <PasswordField
          id={id}
          name={field.name}
          label={label}
          placeholder={placeholder}
          value={field.value}
          error={error?.message}
          onChange={field.onChange}
          onBlur={field.onBlur}
          ref={field.ref}
        />
      )}
    />
  );
}
