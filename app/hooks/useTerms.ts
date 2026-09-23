import { useCallback, useEffect, useState } from "react";
import { ApiRequestError } from "~/api/axios";
import { findActiveTerm } from "~/api/terms";
import type { TermResponseDTO } from "~/types/terms";
import { termTypes } from "~/types/terms";

/**
 * Tipos sem documento PUBLISHED retornam 500 "No active terms found for type: X".
 * Esses casos são esperados: o tipo simplesmente não é apresentado.
 */
function isNoActiveTermsError(error: unknown): boolean {
  return (
    error instanceof ApiRequestError &&
    error.message.startsWith("No active terms found for type")
  );
}

export function useTerms() {
  const [terms, setTerms] = useState<TermResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  const refetch = useCallback(() => {
    setReloadKey((current) => current + 1);
  }, []);

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    setError(null);

    Promise.allSettled(termTypes.map((type) => findActiveTerm(type))).then(
      (results) => {
        if (cancelled) {
          return;
        }

        const activeTerms: TermResponseDTO[] = [];
        let firstFailure: string | null = null;

        for (const result of results) {
          if (result.status === "fulfilled") {
            activeTerms.push(result.value);
            continue;
          }

          // Tipos sem PUBLISHED são esperados e silenciosamente omitidos.
          if (isNoActiveTermsError(result.reason)) {
            continue;
          }

          // Falha real (rede, 401/403 etc.): não derruba o restante.
          firstFailure ??=
            result.reason instanceof Error
              ? result.reason.message
              : "Erro ao carregar os termos";
        }

        // Sempre monta a lista com o que carregou; só registra erro se algo falhou de verdade.
        setTerms(activeTerms);
        setError(firstFailure);
        setLoading(false);
      },
    );

    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  return {
    terms,
    loading,
    error,
    refetch,
  };
}
