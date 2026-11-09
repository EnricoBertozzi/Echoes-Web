import { useCallback, useEffect, useRef, useState } from "react";
import {
  findDashboardDevices,
  findDashboardRankings,
  findDashboardUsage,
} from "~/api/dashboard";
import type { DevicesSummary, Rankings, UsageSummary } from "~/types/dashboard";

export function useDashboard(days: number, institutionId?: string) {
  const [devices, setDevices] = useState<DevicesSummary | null>(null);
  const [usage, setUsage] = useState<UsageSummary | null>(null);
  const [rankings, setRankings] = useState<Rankings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refetchKey, setRefetchKey] = useState(0);

  const latestRequestIdRef = useRef(0);

  useEffect(() => {
    const requestId = ++latestRequestIdRef.current;

    setLoading(true);
    setError(null);

    Promise.all([
      findDashboardDevices(institutionId),
      findDashboardUsage(days, institutionId),
      findDashboardRankings(days, institutionId),
    ])
      .then(([devicesResult, usageResult, rankingsResult]) => {
        if (latestRequestIdRef.current !== requestId) return; // resposta antiga
        setDevices(devicesResult);
        setUsage(usageResult);
        setRankings(rankingsResult);
        setLoading(false);
      })
      .catch((err: unknown) => {
        if (latestRequestIdRef.current !== requestId) return;
        setError(err instanceof Error ? err.message : "Erro na requisição");
        setLoading(false);
      });
  }, [days, institutionId, refetchKey]);

  const refetch = useCallback(() => setRefetchKey((key) => key + 1), []);

  return { devices, usage, rankings, loading, error, refetch };
}
