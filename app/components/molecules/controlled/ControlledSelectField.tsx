import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
  type RegisterOptions,
} from "react-hook-form";
import { TextField } from "../input/TextField";
import { SelectField } from "../input/SelectField";

export interface ControlledSelectFieldProps<T extends FieldValues> {
  id: string;
  name: Path<T>;
  label: string;
  options: Map<string, string>;
  placeholder: string;
  control: Control<T>;
  rules: RegisterOptions<T, Path<T>>;
}

export function ControlledSelectField<T extends FieldValues>({
  id,
  name,
  label,
  placeholder,
  options,
  control,
  rules,
}: ControlledSelectFieldProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState: { error } }) => (
        <SelectField
          id={id}
          name={field.name}
          placeholder={placeholder}
          label={label}
          error={error?.message}
          value={field.value}
          options={options}
          onBlur={field.onBlur}
          onChange={field.onChange}
        />
      )}
    />
  );
}
