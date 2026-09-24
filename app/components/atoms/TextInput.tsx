import type { InputHTMLAttributes } from "react";

export interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
}

export function TextInput(props: TextInputProps) {
  return (
    <label className='border border-zinc-400 bg-white rounded px-4 py-2'>
      <input className='w-72 h-full text-slate-900 bg-none caret-black outline-none placeholder-gray-500' {...props}/>
    </label>
  )
}
