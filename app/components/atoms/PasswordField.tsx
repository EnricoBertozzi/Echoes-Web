import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

export interface PaswordFieldProps {
  label: string;
  value: string;
  placeholder?: string;
  id?: string;
  name: string;
  onChange: (value: string) => void;
}
export function PasswordField({ label, value, placeholder, id, name, onChange}: PaswordFieldProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-slate-900 text-lg">
        <span>{label}</span>
      </label>

      <div className="relative flex items-center w-full">
        <input type={showPassword ? "text" : "password"} id={id} name={name} value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} 
        className="w-full px-4 py-2 pr-12 rounded border border-slate-500 text-slate-900 placeholder-slate-400 focus:border-gray-900 focus:outline-none  transition-colors"/>

        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 text-slate-500 hover:text-slate-700 focus:outline-none flex items-center justify-center">
          {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
        </button>
      </div>
    </div>
  );
}
