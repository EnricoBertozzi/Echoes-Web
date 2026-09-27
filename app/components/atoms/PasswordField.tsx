import { useState } from "react";
import { Controller, type Control, type FieldValues, type Path, type RegisterOptions } from "react-hook-form";
import { FiEye, FiEyeOff } from "react-icons/fi"  ;

export interface PasswordFieldProps<T extends FieldValues> {
  id?: string;
  name: Path<T>;
  label: string;
  placeholder?: string;
  control: Control<T>;
  rules?: Omit<RegisterOptions<T, Path<T>>, "required">;
}

export function PasswordField<T extends FieldValues>({ label, name, control, placeholder, id, rules}: PasswordFieldProps<T>) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Controller
      name={name}
      control={control}
      rules={{
        required: "Senha é obrigatória",
        ...rules 
      }}
      render={({ field, fieldState: { error } }) => (
        <div className="flex flex-col gap-2">
          <label htmlFor={id || name} className="text-slate-900 text-lg">
            {label}
          </label>

          <div className="relative flex items-center w-full">
            <input 
              id={id || name}
              type={showPassword ? "text" : "password"}
              placeholder={placeholder}
              {...field /** Equiavalente a passar cada propriedade */} 
              className={`
                w-full px-4 py-3 pr-12 rounded-lg border
                text-slate-900 placeholder-slate-400
                focus:outline-none transition-colors
                ${error? "border-red-500 focus:border-red-600" : "border-slate-300 focus:border-slate-500"}
              `}/>

            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              tabIndex={-1}
              className="
                absolute right-4
                text-slate-500 hover:text-slate-700
                focus:outline-none
                flex items-center justify-center
              ">
              {showPassword ? (<FiEye size={20} />) : (<FiEyeOff size={20} />)}
            </button>
          </div>

          {error && (<span className="text-red-500 text-sm">{error.message}</span>)}
        </div>
      )}
    />
  );
}