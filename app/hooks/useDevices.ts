import { useCallback, useEffect, useRef, useState } from "react";

import { toast } from "sonner";

import {
  activateDevice,
  approveDevice,
  deactivateDevice,
  deleteDevice,
  findDevices,
  updateDevice,
} from "~/api/devices";

import type {
  DeviceInfo,
  DeviceStatus,
  DeviceUpdateRequest,
} from "~/types/device";

const DEFAULT_PAGE_SIZE = 12;

export function useDevices() {
  // Dados
  const [devices, setDevices] = useState<DeviceInfo[]>([]);

  // Paginação
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(DEFAULT_PAGE_SIZE);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // Filtros
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<DeviceStatus | "">("");
  const [institutionId, setInstitutionId] = useState("");

  // Controle de requisições
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actingId, setActingId] = useState<string | null>(null);
  const [refetchKey, setRefetchKey] = useState(0);

  const latestRequestIdRef = useRef(0);

  // Busca paginada com filtros
  useEffect(() => {
    const requestId = ++latestRequestIdRef.current;
    let cancelled = false;

    setLoading(true);
    setError(null);

    findDevices({
      page,
      size,
      name: query || undefined,
      status: status || undefined,
      institutionId: institutionId || undefined,
    })
      .then((result) => {
        if (cancelled || latestRequestIdRef.current !== requestId) {
          return;
        }

        setTotalPages(result.totalPages);
        setTotalElements(result.totalElements);

        // Corrige a página caso uma alteração
        // reduza a quantidade de resultados.
        const lastPage = Math.max(0, result.totalPages - 1);

        if (page > lastPage) {
          setPage(lastPage);
          return;
        }

        setDevices(result.content);
      })
      .catch((err: unknown) => {
        if (cancelled || latestRequestIdRef.current !== requestId) {
          return;
        }

        setDevices([]);
        setTotalPages(0);
        setTotalElements(0);

        setError(
          err instanceof Error
            ? err.message
            : "Erro ao consultar dispositivos.",
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
  }, [page, size, query, status, institutionId, refetchKey]);

  // Busca por nome
  const search = useCallback((value: string) => {
    setQuery(value.trim());
    setPage(0);
  }, []);

  // Filtro por status
  const filterByStatus = useCallback((value: DeviceStatus | "") => {
    setStatus(value);
    setPage(0);
  }, []);

  // Filtro por instituição
  const filterByInstitution = useCallback((value: string) => {
    setInstitutionId(value);
    setPage(0);
  }, []);

  // Quantidade por página
  const changeSize = useCallback((value: number) => {
    setSize(value);
    setPage(0);
  }, []);

  // Limpa todos os filtros
  const clearFilters = useCallback(() => {
    setQuery("");
    setStatus("");
    setInstitutionId("");
    setPage(0);
  }, []);

  // Paginação
  const nextPage = useCallback(() => {
    setPage((current) => Math.min(current + 1, Math.max(0, totalPages - 1)));
  }, [totalPages]);

  const prevPage = useCallback(() => {
    setPage((current) => Math.max(0, current - 1));
  }, []);

  // Recarrega os dispositivos
  const refetch = useCallback(() => {
    setRefetchKey((key) => key + 1);
  }, []);

  // Executa operações sobre dispositivos
  const runAction = useCallback(
    async (
      deviceId: string,
      action: () => Promise<unknown>,
      message: string,
    ): Promise<boolean> => {
      setActingId(deviceId);

      try {
        await action();

        toast.success(message, {
          position: "bottom-right",
        });

        refetch();

        return true;
      } catch {
        // O interceptor do Axios já exibe o erro.
        return false;
      } finally {
        setActingId(null);
      }
    },
    [refetch],
  );

  // Aprovação
  const approve = useCallback(
    (deviceId: string, institutionId: string) =>
      runAction(
        deviceId,
        () => approveDevice(deviceId, institutionId),
        "Dispositivo aprovado",
      ),
    [runAction],
  );

  // Ativação e desativação
  const toggleStatus = useCallback(
    (device: DeviceInfo) =>
      runAction(
        device.id,
        () =>
          device.status === "ACTIVE"
            ? deactivateDevice(device.id)
            : activateDevice(device.id),
        device.status === "ACTIVE"
          ? "Dispositivo desativado"
          : "Dispositivo ativado",
      ),
    [runAction],
  );

  // Atualização
  const update = useCallback(
    (deviceId: string, data: DeviceUpdateRequest) =>
      runAction(
        deviceId,
        () => updateDevice(deviceId, data),
        "Dispositivo atualizado",
      ),
    [runAction],
  );

  // Exclusão
  const remove = useCallback(
    (device: DeviceInfo) =>
      runAction(
        device.id,
        () => deleteDevice(device.id),
        "Dispositivo excluído",
      ),
    [runAction],
  );

  return {
    devices,
    loading,
    error,
    actingId,
    page,
    size,
    totalPages,
    totalElements,
    nextPage,
    prevPage,
    changeSize,
    hasNextPage: page + 1 < totalPages,
    hasPrevPage: page > 0,
    query,
    status,
    institutionId,
    search,
    filterByStatus,
    filterByInstitution,
    clearFilters,
    refetch,
    approve,
    toggleStatus,
    update,
    remove,
    setSize
  };
}
