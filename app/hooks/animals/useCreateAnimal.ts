import { useState } from "react";
import { createAnimal } from "~/api/animals";
import type { AnimalDataRequest } from "~/types/Animal";

export function useCreateAnimal() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleCreateAnimalSubmit(data: AnimalDataRequest) {
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      await createAnimal(data);
      setSuccess(true);
    } catch (error) {
      setError("Dados inválidos");
    } finally {
      setLoading(false);
    }
  }

  return { loading, error, success, handleCreateAnimalSubmit };
}
