import { useState } from "react";
import { updateScenario } from "~/api/scenario";
import type { ScenarioUpdateRequest } from "~/types/Scenario";

export function useEditScenario() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleEditScenarioSubmit(data: ScenarioUpdateRequest) {
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      await updateScenario(data);
      setSuccess(true);
    } catch (error) {
      setError("Dados inválidos");
    } finally {
      setLoading(false);
    }
  }
  return {
    loading,
    error,
    success,
    handleEditScenarioSubmit,
  };
}
