interface ModalFileFieldProps {
  id: string;
  label: string;
  onChange: (file: File | null) => void;
  required?: boolean;
  accept?: string;
}

export function ModalFileField({id, label, onChange, required = false, accept}: ModalFileFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-slate-900">
        {label}
      </label>

      <input
        id={id}
        type="file"
        onChange={(event) => onChange(event.target.files?.[0] ?? null)}
        accept={accept}
        required={required}
        className="rounded-lg border border-slate-300 p-3 text-slate-900 outline-none file:mr-4 file:rounded-lg file:border-0 file:bg-slate-200 file:px-4 file:py-2 file:text-slate-900"
      />
    </div>
  );
}
