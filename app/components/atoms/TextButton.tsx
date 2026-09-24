
export interface TextButtonProps {
  text: string;
  className: string;
  onClick: () => void;
}

export function TextButton({ text, className, onClick }: TextButtonProps) {
  return (
    <button onClick={onClick} className={`${className} text-left text-xl hover:underline cursor-pointer`} >
      {text}
    </button>
  );
}
