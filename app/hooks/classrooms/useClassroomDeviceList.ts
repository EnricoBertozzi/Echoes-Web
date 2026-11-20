import { useCallback, useEffect, useState } from "react";

import { findClassroomDevices } from "~/api/classroomDesvices";
import type { DeviceInfo } from "~/types/device";

export function useClassroomDeviceList(classroomId: string, enabled: boolean) {
  const [devices, setDevices] = useState<DeviceInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refetchKey, setRefetchKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    if (!enabled || !classroomId) {
      setDevices([]);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    findClassroomDevices(classroomId)
      .then((result) => {
        if (cancelled) return;

        setDevices(result);
      })
      .catch((cause: unknown) => {
        if (cancelled) return;

        setDevices([]);
        setError(
          cause instanceof Error
            ? cause.message
            : "Erro ao carregar dispositivos da turma.",
        );
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [classroomId, enabled, refetchKey]);

  const refetch = useCallback(() => {
    setRefetchKey((key) => key + 1);
  }, []);

  return { devices, loading, error, refetch };
}
