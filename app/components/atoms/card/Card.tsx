export interface CardProps {
  children: React.ReactNode
}

export function Card({children}: CardProps) {
  <div className="flex flex-col gap-8 p-8 bg-white rounded-2xl w-full">
    {children}
  </div>
}