import { useState } from "react";
import { updatePoint } from "~/api/points";
import type { AuscultationPointUpdateRequest } from "~/types/AuscultationPoint";

export function useEditPoint() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handlePointEditSubmit(data: AuscultationPointUpdateRequest) {
    setLoading(false);
    setError("");
    setSuccess(false);

    try {
      await updatePoint(data);
      setSuccess(true);
    } catch (error) {
      setError("Erro ao cadastrar animal");
    } finally {
      setLoading(false);
    }
  }

  return {
    loading,
    error,
    success,
    handlePointEditSubmit,
  };
}
