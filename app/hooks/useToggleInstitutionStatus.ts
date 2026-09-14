import { useState } from "react";
import { ApiRequestError, toggleInstitutionStatus } from "~/api/institutions";
import type { Institution } from "~/types/Institution";

export function useToggleInstitutionStatus(
  institution: Institution,
  onToggled?: () => void,
) {
  const [toggling, setToggling] = useState(false);
  const [toggleError, setToggleError] = useState<string | null>(null);

  async function handleToggle() {
    setToggleError(null);

    const confirmMessage = institution.active
      ? `Desativar a instituição ${institution.name}?`
      : `Ativar a instituição ${institution.name}?`;

    const confirmed = window.confirm(confirmMessage);
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
