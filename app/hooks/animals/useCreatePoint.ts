import { useState } from "react";
import { createPoint } from "~/api/points";
import type { AuscultationPointRegisterRequest } from "~/types/AuscultationPoint";

export function useCreatePoint() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handlePointAddSubmit(data: AuscultationPointRegisterRequest) {
    setError("");
    setLoading(true);
    setSuccess(false);

    try {
      await createPoint(data);
      setSuccess(true);
    } catch (error) {
      setError("Erro ao cadastrar ponto");
    } finally {
      setLoading(false);
    }
  }

  return { handlePointAddSubmit, loading, error, success };
}
