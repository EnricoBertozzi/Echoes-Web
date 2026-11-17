import { FiEdit, FiTrash2, FiMusic, FiFile } from "react-icons/fi";

import { ButtonIcon } from "../atoms/ButtonIcon";

export interface ScenarioHeaderProps {
  name: string;
  description: string;
  audioUrl: string;
  onEdit: () => void;
  onDelete: () => void;
}

export function ScenarioHeader({
  name,
  description,
  audioUrl,
  onEdit,
  onDelete,
}: ScenarioHeaderProps) {
  const fileName = audioUrl.substring(audioUrl.indexOf("_") + 1);

  return (
    <div className="flex w-full min-w-0 flex-col gap-4">
      <header className="flex w-full min-w-0 flex-wrap items-start justify-between gap-4">
        <div className="flex min-w-0 flex-[1_1_12rem] items-start gap-4">
          <div className="flex flex-1 flex-col items-start gap-1 text-left">
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
            <p className="text-sm font-bold text-slate-500">{`Arquivo: ${fileName}`}</p>
          </div>
        </div>

        <div className="ml-auto flex max-w-full shrink-0 flex-wrap items-center gap-8">
          <ButtonIcon onClick={onEdit}>
            <FiEdit size={22} className="text-slate-900" />
          </ButtonIcon>

          <ButtonIcon onClick={onDelete}>
            <FiTrash2 size={22} className="text-red-900" />
          </ButtonIcon>
        </div>
      </header>
    </div>
  );
}
