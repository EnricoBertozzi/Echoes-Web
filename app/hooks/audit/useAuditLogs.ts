
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { findAuditLogs } from "~/api/audit";
import { ApiRequestError } from "~/api/errors";
import { useAuth } from "~/context/AuthContext";

import type {
  AuditLog,
  AuditStatus,
} from "~/types/audit";

const DEFAULT_SIZE = 20;

export function useAuditLogs() {
  const { user, loading: authLoading } = useAuth();

  const [page, setPageState] = useState(0);
  const [size, setSizeState] = useState(DEFAULT_SIZE);

  const [institutionFilter, setInstitutionFilterState] =
    useState("all");

  const [entityFilter, setEntityFilterState] =
    useState("all");

  const [actionFilter, setActionFilterState] =
    useState("all");

  const [statusFilter, setStatusFilterState] =
    useState<"all" | AuditStatus>("all");

  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [refetchKey, setRefetchKey] = useState(0);

  const latestRequestRef = useRef(0);

  const isAdmin = user?.role === "ADMIN";
  const isManager = user?.role === "MANAGER";

  const scopedInstitutionId = isManager
    ? user.institutionId
    : null;

  useEffect(() => {
    const requestId = ++latestRequestRef.current;

    if (authLoading) {
      setLoading(true);
      return;
    }

    if (!isAdmin && !isManager) {
      setLogs([]);
      setTotalPages(0);
      setTotalElements(0);
      setLoading(false);

      setError(
        "Seu perfil não possui acesso à Auditoria.",
      );

      return;
    }

    if (isManager && !scopedInstitutionId) {
      setLogs([]);
      setTotalPages(0);
      setTotalElements(0);
      setLoading(false);

      setError(
        "Gestor sem instituição vinculada. Contate um administrador.",
      );

      return;
    }

    setLoading(true);
    setError(null);

    // Evita mostrar registros do escopo anterior.
    setLogs([]);
    setTotalElements(0);
    setTotalPages(0);

    void findAuditLogs({
      page,
      size,

      institutionId: isAdmin
        ? institutionFilter === "all"
          ? undefined
          : institutionFilter
        : scopedInstitutionId ?? undefined,

      entity:
        entityFilter === "all"
          ? undefined
          : entityFilter,

      action:
        actionFilter === "all"
          ? undefined
          : actionFilter,

      status:
        statusFilter === "all"
          ? undefined
          : statusFilter,
    })
      .then((response) => {
        if (latestRequestRef.current !== requestId) {
          return;
        }

        // Proteção complementar de interface.
        // A autorização real é responsabilidade do backend.
        setLogs(
          isManager
            ? response.content.filter(
                (log) =>
                  log.institutionId === scopedInstitutionId,
              )
            : response.content,
        );

        setTotalPages(response.totalPages);
        setTotalElements(response.totalElements);
      })
      .catch((caught: unknown) => {
        if (latestRequestRef.current !== requestId) {
          return;
        }

        if (
          caught instanceof ApiRequestError &&
          caught.status === 403
        ) {
          setError(
            "A API não autorizou esta consulta. Verifique as permissões de auditoria no backend.",
          );
        } else {
          setError(
            caught instanceof Error
              ? caught.message
              : "Erro ao consultar auditoria.",
          );
        }
      })
      .finally(() => {
        if (latestRequestRef.current === requestId) {
          setLoading(false);
        }
      });
  }, [
    authLoading,
    isAdmin,
    isManager,
    scopedInstitutionId,
    page,
    size,
    institutionFilter,
    entityFilter,
    actionFilter,
    statusFilter,
    refetchKey,
  ]);

  const setPage = useCallback((nextPage: number) => {
    setPageState(Math.max(0, nextPage));
  }, []);

  const setSize = useCallback((nextSize: number) => {
    setSizeState(Math.max(1, nextSize));
    setPageState(0);
  }, []);

  const setInstitutionFilter = useCallback(
    (value: string) => {
      setInstitutionFilterState(value);
      setPageState(0);
    },
    [],
  );

  const setEntityFilter = useCallback((value: string) => {
    setEntityFilterState(value);
    setPageState(0);
  }, []);

  const setActionFilter = useCallback((value: string) => {
    setActionFilterState(value);
    setPageState(0);
  }, []);

  const setStatusFilter = useCallback(
    (value: "all" | AuditStatus) => {
      setStatusFilterState(value);
      setPageState(0);
    },
    [],
  );

  const refetch = useCallback(() => {
    setRefetchKey((key) => key + 1);
  }, []);

  return {
    logs,
    loading,
    error,
    totalPages,
    totalElements,
    page,
    size,

    institutionFilter,
    entityFilter,
    actionFilter,
    statusFilter,

    setPage,
    setSize,
    setInstitutionFilter,
    setEntityFilter,
    setActionFilter,
    setStatusFilter,
    refetch,
  };
}

