export interface TextProps{
  text: string
}

export function Text({text}: TextProps) {
  return (
    <p className="h-22 text-slate-900 text-xl line-clamp-3 wrap-break-word">
      {text}
    </p>
  )
}