export interface LabelProps {
    id: string
    name: string,
    label: string
}

export function Label({id, name, label}: LabelProps) {
    return (
        <label htmlFor={id || name} className="text-slate-900 text-lg">
            <span>{label}</span>
        </label>
    );
}