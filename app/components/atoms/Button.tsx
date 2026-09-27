export interface ButtonProps {
  label: string;
  type?: string
  onClick?: () => any;
}

export function Button({label, type, onClick}: ButtonProps) {
  return (
    <button onClick={onClick} className='bg-main w-full py-3 rounded cursor-pointer flex justify-center items-center'>
      <span className='text-white'>{label}</span>
    </button>
  )
}
