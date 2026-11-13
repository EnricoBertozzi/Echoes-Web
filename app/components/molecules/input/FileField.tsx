import type { Ref } from "react";
import { FileInput } from "~/components/atoms/input/FileInput";
import { Label } from "~/components/atoms/input/Label";

export interface FileFieldProps {
  id: string;
  name: string;
  label: string;
  value: string;
  error?: string;
  ref?: Ref<HTMLInputElement>;
  readOnly?: boolean;
  accept?: string;
  onChange: (file: File | null) => void;
  onBlur?: () => void;
  disabled?: boolean;
}

export function FileField({
  id,
  name,
  value,
  error,
  ref,
  readOnly,
  accept,
  onChange,
  onBlur,
  label,
  disabled
}: FileFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <Label id={id} name={name} label={label} />
      <FileInput
        id={id}
        name={name}
        error={error}
        ref={ref}
        readOnly={readOnly}
        accept={accept}
        onBlur={onBlur}
        value={value}
        onChange={onChange}
        disabled={disabled}
      />
    </div>
  );
}
