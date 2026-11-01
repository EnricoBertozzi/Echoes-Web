import { useState, type Ref } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

export interface PasswordInputProps {
  id: string;
  name: string;
  placeholder: string;
  value: string;
  error?: string;
  ref?: Ref<HTMLInputElement>;
  onChange: (value: string) => void;
  onBlur?: () => void;
}

export function PasswordInput({
  id,
  name,
  placeholder,
  error,
  ref,
  onChange,
  onBlur,
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);


  return (
    <div className="flex flex-col gap-2">
      <div className="relative flex items-center w-full">
        <input
          id={id}
          name={name}
          type={showPassword ? "text" : "password"}
          onChange={(event) => onChange(event.target.value)}
          onBlur={onBlur}
          placeholder={placeholder}
          ref={ref}
          className={`
                    w-full px-4 py-3 pr-12 rounded-lg border
                    text-slate-900 placeholder-slate-400
                    focus:outline-none transition-colors
                    ${error ? "border-red-500 focus:border-red-600" : "border-slate-300 focus:border-slate-500"}
                  `}
        />

        <button
          type="button"
          onClick={() => setShowPassword((value) => !value)}
          tabIndex={-1}
          className="
                    absolute right-4
                    text-slate-500 hover:text-slate-700
                    focus:outline-none
                    flex items-center justify-center
                  "
        >
          {showPassword ? <FiEye size={20} /> : <FiEyeOff size={20} />}
        </button>
      </div>

      {error && <span className="text-red-500 text-sm">{error}</span>}
    </div>
  );
}
