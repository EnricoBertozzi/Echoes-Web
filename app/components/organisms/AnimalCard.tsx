import { Text } from "../atoms/Text";
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
      <AnimalHeader onEdit={onEdit} onDelete={onDelete}  name={name} model={model} />
      
      <Text text={description} />

      <button
        onClick={onOpen}
        className="text-main text-left text-xl hover:underline cursor-pointer">
        Gerenciar pontos de ausculta...
      </button>
    </div>
  )
}