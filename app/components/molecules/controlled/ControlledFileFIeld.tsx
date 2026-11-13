import {
  Controller,
  type Control,
  type FieldValues,
  type FieldPathByValue,
  type UseControllerProps,
} from "react-hook-form";

import { FileField } from "../input/FileField";

export interface ControlledFileFieldProps<
  T extends FieldValues,
  N extends FieldPathByValue<T, File | null>,
> {
  id: string;
  name: N;
  label: string;
  control: Control<T>;
  rules?: UseControllerProps<T, N>["rules"];
  accept?: string;
  disabled?: boolean;
}

export function ControlledFileField<
  T extends FieldValues,
  N extends FieldPathByValue<T, File | null>,
>({
  id,
  name,
  label,
  control,
  rules,
  accept,
  disabled,
}: ControlledFileFieldProps<T, N>) {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      disabled={disabled}
      render={({ field, fieldState: { error } }) => (
        <FileField
          id={id}
          name={field.name}
          label={label}
          onChange={field.onChange}
          onBlur={field.onBlur}
          ref={field.ref}
          error={error?.message}
          accept={accept}
          disabled={field.disabled}
          value={field.value}
        />
      )}
    />
  );
}
