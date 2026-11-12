import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
  activateDevice,
  approveDevice,
  deactivateDevice,
  findDevices,
  findDevicesByName,
} from "~/api/devices";
import type { DeviceInfo } from "~/types/device";

const PAGE_SIZE = 12;

export function useDevices() {
  const [devices, setDevices] = useState<DeviceInfo[]>([]);
  const [page, setPage] = useState(0);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actingId, setActingId] = useState<string | null>(null);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [refetchKey, setRefetchKey] = useState(0);

  const latestRequestIdRef = useRef(0);

  useEffect(() => {
    const requestId = ++latestRequestIdRef.current;

    setLoading(true);
    setError(null);

    const request = query
      ? findDevicesByName({ name: query, page, size: PAGE_SIZE + 1 })
      : findDevices({ page, size: PAGE_SIZE + 1 });

    request
      .then((result) => {
        if (latestRequestIdRef.current !== requestId) return;

        setDevices(result.slice(0, PAGE_SIZE));
        setHasNextPage(result.length > PAGE_SIZE);
      })
      .catch((err: unknown) => {
        if (latestRequestIdRef.current !== requestId) return;

        setError(err instanceof Error ? err.message : "Erro na requisição");
      })
      .finally(() => {
        if (latestRequestIdRef.current === requestId) setLoading(false);
      });
  }, [page, query, refetchKey]);

  const search = useCallback((value: string) => {
    setQuery(value);
    setPage(0);
  }, []);

  const nextPage = useCallback(() => setPage((current) => current + 1), []);

  const prevPage = useCallback(
    () => setPage((current) => Math.max(0, current - 1)),
    [],
  );

  const runAction = useCallback(
    async (
      deviceId: string,
      action: () => Promise<unknown>,
      message: string,
    ) => {
      setActingId(deviceId);

      try {
        await action();
        toast.success(message, { position: "bottom-right" });
        setRefetchKey((key) => key + 1);
      } catch {
        // o interceptor do axios já exibiu o erro
      } finally {
        setActingId(null);
      }
    },
    [],
  );

  const approve = useCallback(
    (deviceId: string, institutionId: string) =>
      runAction(
        deviceId,
        () => approveDevice(deviceId, institutionId),
        "Dispositivo aprovado",
      ),
    [runAction],
  );

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

  return {
    devices,
    loading,
    error,
    page,
    actingId,
    hasNextPage,
    hasPrevPage: page > 0,
    search,
    nextPage,
    prevPage,
    approve,
    toggleStatus,
  };
}
