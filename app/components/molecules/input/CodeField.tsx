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
    onChange: (value: string) => void
}

export function CodeField({
    id,
    name,
    label,
    value,
    error,
    length,
    onChange
}: CodeFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <Label id={id} name={name} label={label} />
      <div className="flex w-full justify-center">
        <CodeInput length={length} error={error} value={value} onChange={onChange} />
      </div>
    </div>
  );
}
