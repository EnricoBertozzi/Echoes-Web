import { useCallback, useEffect, useRef, useState } from "react";

import { findDeviceLogs } from "~/api/deviceLogs";
import type {
  DeviceLog,
  DeviceLogCategory,
  DeviceLogLevel,
} from "~/types/deviceLog";

const PAGE_SIZE = 20;
const REFRESH_MS = 15000;

/**
 * Logs de um dispositivo, com filtros, paginação e atualização automática
 * (pausada com a aba oculta ou com o modal fechado).
 */
export function useDeviceLogs(deviceId: string, enabled: boolean) {
  const [logs, setLogs] = useState<DeviceLog[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [minLevel, setMinLevel] = useState<DeviceLogLevel | "">("");
  const [category, setCategory] = useState<DeviceLogCategory | "">("");
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refetchKey, setRefetchKey] = useState(0);

  const latestRequestIdRef = useRef(0);
  // A atualização automática não pisca a tela de "carregando"
  const silentRef = useRef(false);

  useEffect(() => {
    if (!enabled) return;

    const requestId = ++latestRequestIdRef.current;
    let cancelled = false;

    if (!silentRef.current) setLoading(true);
    silentRef.current = false;
    setError(null);

    findDeviceLogs(deviceId, {
      page,
      size: PAGE_SIZE,
      minLevel: minLevel || undefined,
      category: category || undefined,
    })
      .then((result) => {
        if (cancelled || latestRequestIdRef.current !== requestId) return;

        const lastPage = Math.max(0, result.totalPages - 1);
        if (page > lastPage) {
          setPage(lastPage);
          return;
        }
        setLogs(result.content);
        setTotalPages(result.totalPages);
        setTotalElements(result.totalElements);
      })
      .catch((err: unknown) => {
        if (cancelled || latestRequestIdRef.current !== requestId) return;
        setLogs([]);
        setTotalPages(0);
        setTotalElements(0);
        setError(
          err instanceof Error ? err.message : "Erro ao consultar os logs.",
        );
      })
      .finally(() => {
        if (!cancelled && latestRequestIdRef.current === requestId) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [deviceId, enabled, page, minLevel, category, refetchKey]);

  useEffect(() => {
    if (!enabled || !autoRefresh) return;

    const timer = window.setInterval(() => {
      if (document.visibilityState !== "visible") return;
      silentRef.current = true;
      setRefetchKey((key) => key + 1);
    }, REFRESH_MS);

    return () => window.clearInterval(timer);
  }, [enabled, autoRefresh]);

  const filterByLevel = useCallback((value: DeviceLogLevel | "") => {
    setMinLevel(value);
    setPage(0);
  }, []);

  const filterByCategory = useCallback((value: DeviceLogCategory | "") => {
    setCategory(value);
    setPage(0);
  }, []);

  const refetch = useCallback(() => setRefetchKey((key) => key + 1), []);

  const nextPage = useCallback(
    () => setPage((p) => Math.min(p + 1, Math.max(0, totalPages - 1))),
    [totalPages],
  );
  const prevPage = useCallback(() => setPage((p) => Math.max(0, p - 1)), []);

  return {
    logs,
    loading,
    error,
    page,
    totalPages,
    totalElements,
    minLevel,
    category,
    autoRefresh,
    setAutoRefresh,
    filterByLevel,
    filterByCategory,
    refetch,
    nextPage,
    prevPage,
  };
}
