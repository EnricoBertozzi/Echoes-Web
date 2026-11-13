import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
  type RegisterOptions,
} from "react-hook-form";
import { TextField } from "../input/TextField";

export interface ControlledTextFieldProps<T extends FieldValues> {
  id: string;
  name: Path<T>;
  label: string;
  placeholder: string;
  control: Control<T>;
  rules: RegisterOptions<T, Path<T>>;
  readOnly?: boolean;
}

export function ControlledTextField<T extends FieldValues>({
  id,
  name,
  label,
  placeholder,
  control,
  rules,
  readOnly
}: ControlledTextFieldProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState: { error } }) => (
        <TextField
          id={id}
          name={field.name}
          label={label}
          readOnly={readOnly}
          placeholder={placeholder}
          type="text"
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
