import { TextInput } from "./TextInput";

export interface TextInputWithLabelProps {
    label: string,
    value: string,
    placeholder?: string,
    id?: string,
    type: string,
    name: string
    onChange: (value: string) => void,
}

export function TextInputWithLabel({label, value, placeholder, id, type, name, onChange}: TextInputWithLabelProps) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-slate-900 text-lg">
        <span>{label}</span>
      </label>
      <TextInput placeholder={placeholder} id={id} value={value} type={type} name={name} onChange={(event) => onChange(event.target.value)}/>
    </div>
  );
}
