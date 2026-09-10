export interface ButtonProps {
  label: string;
  onClick?: () => any;
}

export function Button(props: ButtonProps) {
  return (
    <button onClick={props.onClick} className='bg-main w-full py-3 rounded cursor-pointer flex justify-center items-center'>
      <span className='text-white'>{props.label}</span>
    </button>
  )
}
