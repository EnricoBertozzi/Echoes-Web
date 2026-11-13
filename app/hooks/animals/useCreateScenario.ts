import { useState } from "react";
import { createScenario } from "~/api/scenario";

import type {
  ScenarioRegisterRequest,
  ScenarioRegisterForm,
} from "~/types/Scenario";

export function useCreateScenario() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleScenarioAddSubmit(data: ScenarioRegisterForm) {
    setError("");
    setLoading(true);
    setSuccess(false);

    try {
      if (!data.file) {
        setError("O arquivo de áudio é obrigatório");
        return;
      }

      const request: ScenarioRegisterRequest = {
        ...data,
        file: data.file,
      };

      await createScenario(request, request.file);

      setSuccess(true);
    } catch {
      setError("Dados inválidos");
    } finally {
      setLoading(false);
    }
  }

  return { handleScenarioAddSubmit, loading, error, success };
}