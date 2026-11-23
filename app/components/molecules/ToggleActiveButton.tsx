import { FiCheckCircle, FiSlash } from "react-icons/fi";

import { ButtonIcon } from "../atoms/ButtonIcon";

export interface ToggleActiveButtonProps {
  active: boolean;
  subject: string;
  onToggle: () => void;
}

export function ToggleActiveButton({
  active,
  subject,
  onToggle,
}: ToggleActiveButtonProps) {
  return (
    <ButtonIcon
      label={active ? `Desativar ${subject}` : `Ativar ${subject}`}
      onClick={onToggle}
    >
      {active ? (
        <FiSlash size={22} className="text-amber-700" aria-hidden="true" />
      ) : (
        <FiCheckCircle size={22} className="text-green-700" aria-hidden="true" />
      )}
    </ButtonIcon>
  );
}
