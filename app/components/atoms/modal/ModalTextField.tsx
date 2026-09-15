interface ModalTextFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}

export function ModalTextField({id, label, value, onChange, required = false}: ModalTextFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-slate-900">
        {label}
      </label>

      <input
        id={id}
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="rounded-lg border border-slate-300 p-3 text-slate-900 outline-none focus:border-slate-500"
        required={required}
      />
    </div>
  );
}
