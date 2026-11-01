import type { Ref } from "react";
import { Label } from "../../atoms/input/Label";
import { TextInput } from "../../atoms/input/TextInput";
import { CodeInput } from "~/components/atoms/input/CodeInput";

export interface CodeFieldProps {
    id: string
    name: string,
    label: string,
    value: string,
    length: number,
    error?: string,
    onSubmit: (code: string) => void,
    onChange: (value: string) => void
}

export function CodeField({
    id,
    name,
    label,
    value,
    error,
    length,
    onSubmit,
    onChange
}: CodeFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <Label id={id} name={name} label={label} />
      <div className="flex w-full justify-center">
        <CodeInput length={length} error={error} value={value} onSubmit={onSubmit} onChange={onChange} />
      </div>
    </div>
  );
}
