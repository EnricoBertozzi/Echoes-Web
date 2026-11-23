import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { acceptTerm, findActiveTerm, findPendingTerms } from "~/api/terms";
import type { TermResponseDTO, TermType } from "~/types/terms";

/**
 * Verifica os termos obrigatórios pendentes do usuário autenticado e carrega o
 * conteúdo publicado de cada um. Usado pelo `TermsGate`, que bloqueia a
 * aplicação enquanto a lista não estiver vazia.
 */
export function usePendingTerms() {
  const [pendingTypes, setPendingTypes] = useState<TermType[]>([]);
  const [terms, setTerms] = useState<TermResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [acceptingType, setAcceptingType] = useState<TermType | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  const latestRequestRef = useRef(0);

  const reload = useCallback(() => {
    setReloadKey((current) => current + 1);
  }, []);

  useEffect(() => {
    const requestId = ++latestRequestRef.current;

    setLoading(true);
    setError(null);

    async function load() {
      try {
        const types = await findPendingTerms();

        if (latestRequestRef.current !== requestId) {
          return;
        }

        setPendingTypes(types);

        if (types.length === 0) {
          setTerms([]);
          return;
        }

        const results = await Promise.allSettled(
          types.map((type) => findActiveTerm(type)),
        );

        if (latestRequestRef.current !== requestId) {
          return;
        }

        const loadedTerms = results.flatMap((result) =>
          result.status === "fulfilled" ? [result.value] : [],
        );

        setTerms(loadedTerms);

        if (loadedTerms.length !== types.length) {
          setError(
            "Não foi possível carregar o conteúdo de todos os termos pendentes.",
          );
        }
      } catch (requestError) {
        if (latestRequestRef.current !== requestId) {
          return;
        }

        setTerms([]);
        setError(
          requestError instanceof Error
            ? requestError.message
            : "Erro ao verificar os termos pendentes.",
        );
      } finally {
        if (latestRequestRef.current === requestId) {
          setLoading(false);
        }
      }
    }

    void load();
  }, [reloadKey]);

  const accept = useCallback(async (type: TermType) => {
    setAcceptingType(type);

    try {
      await acceptTerm({ type });

      setPendingTypes((current) => current.filter((item) => item !== type));
      setTerms((current) => current.filter((term) => term.type !== type));

      toast.success("Termo aceito", { position: "bottom-right" });

      return true;
    } catch {
      // o interceptor do axios já exibiu o erro
      return false;
    } finally {
      setAcceptingType(null);
    }
  }, []);

  return {
    pendingTypes,
    terms,
    loading,
    error,
    acceptingType,
    accept,
    reload,
  };
}
