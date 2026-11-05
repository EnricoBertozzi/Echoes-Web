import type { ComponentProps } from "react";

export interface ButtonProps extends ComponentProps<"button"> {
  label: string;
}

export function Button({label, ...props }: ButtonProps) {
  return (
    <button {...props} className='bg-main w-full py-3 rounded cursor-pointer flex justify-center items-center'>
      <span className='text-white'>{label}</span>
    </button>
  )
}
