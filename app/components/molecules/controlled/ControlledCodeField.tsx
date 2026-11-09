import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
  type RegisterOptions,
} from "react-hook-form";
import { TextField } from "../input/TextField";
import { CodeField } from "../input/CodeField";

export interface ControlledCodeFieldProps<T extends FieldValues> {
  id: string;
  name: Path<T>;
  label: string;
  control: Control<T>;
  length: number,
  rules?: RegisterOptions<T, Path<T>>;
  onSubmit: () => void
}

export function ControlledCodeField<T extends FieldValues>({
  id,
  name,
  label,
  length,
  control,
  rules,
  onSubmit
}: ControlledCodeFieldProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      rules={{
        ...rules,
      }}
      render={({ field, fieldState: { error } }) => (
        <CodeField
          id={id}
          name={field.name}
          label={label}
          value={field.value}
          onChange={field.onChange}
          length={length}
          error={error?.message}
          onSubmit={() => onSubmit()}
        />
      )}
    />
  );
}
