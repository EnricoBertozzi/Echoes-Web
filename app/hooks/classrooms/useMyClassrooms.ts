import { useCallback, useEffect, useRef, useState } from "react";

import { findClassrooms } from "~/api/classrooms";
import { ApiRequestError } from "~/api/errors";
import { useAuth } from "~/context/AuthContext";
import type { Classroom } from "~/types/Classroom";

// Professor e aluno participam de poucas turmas: uma página basta e a busca
// e o filtro ativas/arquivadas ficam no cliente, sem nova ida à API.
const PAGE_SIZE = 100;

export function useMyClassrooms() {
  const { user, loading: authLoading } = useAuth();

  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refetchKey, setRefetchKey] = useState(0);

  const latestRequestRef = useRef(0);

  const isMember = user?.role === "TEACHER" || user?.role === "STUDENT";

  useEffect(() => {
    const requestId = ++latestRequestRef.current;

    if (authLoading) {
      setLoading(true);
      return;
    }

    if (!isMember) {
      setClassrooms([]);
      setLoading(false);
      setError("Seu perfil não possui turmas nesta área.");
      return;
    }

    setLoading(true);
    setError(null);

    void findClassrooms({ page: 0, size: PAGE_SIZE })
      .then((response) => {
        if (latestRequestRef.current !== requestId) return;
        setClassrooms(response.content);
      })
      .catch((caught: unknown) => {
        if (latestRequestRef.current !== requestId) return;

        setClassrooms([]);
        setError(
          caught instanceof ApiRequestError || caught instanceof Error
            ? caught.message
            : "Erro ao consultar suas turmas.",
        );
      })
      .finally(() => {
        if (latestRequestRef.current === requestId) {
          setLoading(false);
        }
      });
  }, [authLoading, isMember, refetchKey]);

  const refetch = useCallback(() => {
    setRefetchKey((key) => key + 1);
  }, []);

  return { classrooms, loading, error, refetch };
}
