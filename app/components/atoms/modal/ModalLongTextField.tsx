interface ModalLongTextFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}

export function ModalLongTextField({id, label, value, onChange, required = false}: ModalLongTextFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-slate-900">
        {label}
      </label>

      <textarea
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="min-h-32 resize-none rounded-lg border border-slate-300 p-3 text-slate-900 outline-none focus:border-slate-500"
        required={required}
      />
    </div>
  );
}
