export interface ModalTextProps {
  text: string;
  className?: string
}

export function ModalText({ text, className }: ModalTextProps) {
  return (
  <p className={`text-lg text-slate-600 ${className}`}>
    {text}
  </p>
  )
}
