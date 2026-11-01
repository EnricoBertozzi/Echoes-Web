import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
  type RegisterOptions,
} from "react-hook-form";
import { TextField } from "../input/TextField";

export interface ControlledEmailFieldProps<T extends FieldValues> {
  id: string;
  name: Path<T>;
  label: string;
  placeholder: string;
  control: Control<T>;
  rules?: RegisterOptions<T, Path<T>>;
}

export function ControlledEmailField<T extends FieldValues>({
  id,
  name,
  label,
  placeholder,
  control,
  rules,
}: ControlledEmailFieldProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      rules={{
        pattern: {
          value: /^(?!.*[A-Z])[^\s@]+@[^\s@]+\.[^\s@]+$/,
          message: "Informe um e-mail válido",
        },
        ...rules
      }}
      render={({ field, fieldState: { error } }) => (
        <TextField
          id={id}
          name={field.name}
          label={label}
          placeholder={placeholder}
          type="email"
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
