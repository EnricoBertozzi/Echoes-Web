import { FiEdit, FiTrash2 } from "react-icons/fi";

import { ButtonIcon } from "../atoms/ButtonIcon";
import { InactiveBadge } from "../atoms/InactiveBadge";
import { ToggleActiveButton } from "./ToggleActiveButton";

export interface ScenarioHeaderProps {
  name: string;
  description: string;
  audioUrl: string;
  active: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onToggleActive: () => void;
}

export function ScenarioHeader({
  name,
  description,
  audioUrl,
  active,
  onEdit,
  onDelete,
  onToggleActive,
}: ScenarioHeaderProps) {
  const fileName = audioUrl.substring(audioUrl.indexOf("_") + 1);

  return (
    <div className="flex w-full min-w-0 flex-col gap-4">
      <header className="flex w-full min-w-0 items-start gap-3">
        <div className="flex min-w-0 flex-1 items-start gap-4">
          <div className="flex min-w-0 flex-1 flex-col items-start gap-1 text-left">
            <h3
              title={name}
              className="w-full wrap-anywhere text-lg font-bold text-slate-900"
            >
              {name}
            </h3>

            <p
              title={description}
              className="w-full wrap-anywhere text-lg text-slate-500"
            >
              {description}
            </p>
            <p className="text-sm font-bold text-slate-500 wrap-anywhere">{`Arquivo: ${fileName}`}</p>
            {!active && <InactiveBadge />}
          </div>
        </div>

        <div className="flex shrink-0 gap-1">
          <ButtonIcon label={`Editar cenário ${name}`} onClick={onEdit}>
            <FiEdit size={22} className="text-slate-900" aria-hidden="true" />
          </ButtonIcon>

          <ToggleActiveButton
            active={active}
            subject={`cenário ${name}`}
            onToggle={onToggleActive}
          />

          <ButtonIcon label={`Excluir cenário ${name}`} onClick={onDelete}>
            <FiTrash2 size={22} className="text-red-900" aria-hidden="true" />
          </ButtonIcon>
        </div>
      </header>
    </div>
  );
}
