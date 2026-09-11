import { AnimalHeader } from "../molecules/AnimalHeader";

export interface AnimalCardProps {
  name: string;
  model: string;
  description: string;
  onEdit: () => void;
  onDelete: () => void;
  onOpen: () => void
}

export function AnimalCard({name, model, description, onEdit, onDelete, onOpen}: AnimalCardProps) {
  return (
    <div className="flex flex-col gap-8 p-8 bg-white rounded-2xl min-w-135">
      <AnimalHeader
        onEdit={onEdit}
        onDelete={onDelete} 
        name={name} 
        model={model} />
      
      <div>
        <p className="h-22 text-slate-900 text-xl line-clamp-3 wrap-break-word">
          {description}
        </p>
      </div>

      <button
        onClick={onOpen}
        className="text-indigo-700 text-left text-xl hover:underline cursor-pointer">
        Gerenciar pontos de ausculta...
      </button>
    </div>
  )
}