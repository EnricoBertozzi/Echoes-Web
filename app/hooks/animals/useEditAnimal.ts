import { useState } from "react";
import { updateAnimal } from "~/api/animals";
import type { AnimalUpdateRequest } from "~/types/Animal";

export function useEditAnimal() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleEditScenarioSubmit(data: AnimalUpdateRequest) {
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      await updateAnimal(data);
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
