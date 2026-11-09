import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { approveDevice, findDevices } from "~/api/devices";
import type { DeviceInfo } from "~/types/device";

/**
 * Fila de aprovação (só ADMIN). Aprovar exige escolher a instituição:
 * PENDING nunca tem instituição e só vira ACTIVE com uma.
 */
export function usePendingDevices(enabled: boolean, onChanged?: () => void) {
  const [devices, setDevices] = useState<DeviceInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [refetchKey, setRefetchKey] = useState(0);

  useEffect(() => {
    if (!enabled) return;

    let active = true;
    setLoading(true);
    setError(null);

    findDevices({ page: 0, size: 50, status: "PENDING" })
      .then((result) => {
        if (active) setDevices(result);
      })
      .catch((err: unknown) => {
        if (active)
          setError(err instanceof Error ? err.message : "Erro na requisição");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [enabled, refetchKey]);

  const approve = useCallback(
    async (deviceId: string, institutionId: string) => {
      setApprovingId(deviceId);
      try {
        await approveDevice(deviceId, institutionId);
        toast.success("Dispositivo aprovado", { position: "bottom-right" });
        setRefetchKey((key) => key + 1);
        onChanged?.();
      } catch {
        // o interceptor do axios já mostrou o erro
      } finally {
        setApprovingId(null);
      }
    },
    [onChanged],
  );

  return { devices, loading, error, approvingId, approve };
}
