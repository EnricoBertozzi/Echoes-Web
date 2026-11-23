import { useState } from "react";
import { ApiRequestError } from "~/api/axios";
import { toggleInstitutionStatus } from "~/api/institutions";
import { useConfirmation } from "~/context/ConfirmationContext";
import type { Institution } from "~/types/Institution";

export function useToggleInstitutionStatus(
  institution: Institution,
  onToggled?: () => void,
) {
  const confirmAction = useConfirmation();
  const [toggling, setToggling] = useState(false);
  const [toggleError, setToggleError] = useState<string | null>(null);

  async function handleToggle() {
    setToggleError(null);

    const action = institution.active ? "Desativar" : "Ativar";
    const confirmed = await confirmAction({
      title: `${action} instituição`,
      description: `${action} a instituição ${institution.name}?`,
      confirmLabel: action,
      variant: institution.active ? "danger" : "primary",
    });
    if (!confirmed) {
      return;
    }

    setToggling(true);
    try {
      await toggleInstitutionStatus(institution.id);
      onToggled?.();
    } catch (error) {
      if (error instanceof ApiRequestError) {
        setToggleError(error.message);
      } else {
        setToggleError("Erro ao alterar status da instituição");
      }
    } finally {
      setToggling(false);
    }
  }

  return {
    toggling,
    toggleError,
    handleToggle,
  };
}
