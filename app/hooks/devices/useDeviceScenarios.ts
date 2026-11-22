import { useCallback, useEffect, useRef, useState } from "react";

import { toast } from "sonner";

import {
  activatePreset as activatePresetRequest,
  createPreset as createPresetRequest,
  findDeviceConfig,
  findPresets,
  selectPointScenario,
} from "~/api/deviceScenarios";
import { findAllScenariosByPoint } from "~/api/scenario";
import type { DeviceInfo } from "~/types/device";
import type {
  ClinicalPreset,
  ClinicalPresetRequest,
  DeviceConfig,
} from "~/types/deviceScenario";
import type { Scenario } from "~/types/Scenario";

export function useDeviceScenarios(
  deviceId: string,
  loadDevice: () => Promise<DeviceInfo>,
) {
  const [device, setDevice] = useState<DeviceInfo | null>(null);
  const [config, setConfig] = useState<DeviceConfig | null>(null);
  const [scenariosByPoint, setScenariosByPoint] = useState<
    Map<string, Scenario[]>
  >(new Map());
  const [presets, setPresets] = useState<ClinicalPreset[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyPointId, setBusyPointId] = useState<string | null>(null);
  const [busyPresetId, setBusyPresetId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [refetchKey, setRefetchKey] = useState(0);

  const latestRequestRef = useRef(0);

  useEffect(() => {
    const requestId = ++latestRequestRef.current;
    let cancelled = false;

    setLoading(true);
    setError(null);

    void Promise.all([
      loadDevice(),
      findDeviceConfig(deviceId),
      findPresets(deviceId),
    ])
      .then(async ([deviceResult, configResult, presetsResult]) => {
        const scenarios = new Map<string, Scenario[]>();

        await Promise.all(
          configResult.points.map(async (point) => {
            const items = await findAllScenariosByPoint(point.pointId);
            scenarios.set(point.pointId, items);
          }),
        );

        if (cancelled || latestRequestRef.current !== requestId) return;

        setDevice(deviceResult);
        setConfig(configResult);
        setPresets(presetsResult);
        setScenariosByPoint(scenarios);
      })
      .catch((caught: unknown) => {
        if (cancelled || latestRequestRef.current !== requestId) return;

        setDevice(null);
        setConfig(null);
        setPresets([]);
        setScenariosByPoint(new Map());
        setError(
          caught instanceof Error
            ? caught.message
            : "Erro ao carregar configuração do dispositivo.",
        );
      })
      .finally(() => {
        if (!cancelled && latestRequestRef.current === requestId) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [deviceId, loadDevice, refetchKey]);

  const refetch = useCallback(() => {
    setRefetchKey((key) => key + 1);
  }, []);

  const selectScenario = useCallback(
    async (pointId: string, scenarioId: string): Promise<boolean> => {
      if (busyPointId !== null) return false;

      const requestId = latestRequestRef.current;
      setBusyPointId(pointId);

      try {
        await selectPointScenario(deviceId, pointId, scenarioId);

        toast.success("Cenário aplicado", {
          position: "bottom-right",
        });

        try {
          const updated = await findDeviceConfig(deviceId);

          if (latestRequestRef.current === requestId) {
            setConfig(updated);
          }
        } catch {
          // O interceptor do Axios já exibe o erro.
        }

        return true;
      } catch {
        // O interceptor do Axios já exibe o erro.
        return false;
      } finally {
        setBusyPointId(null);
      }
    },
    [busyPointId, deviceId],
  );

  const createPreset = useCallback(
    async (data: ClinicalPresetRequest): Promise<boolean> => {
      if (creating) return false;

      const requestId = latestRequestRef.current;
      setCreating(true);

      try {
        await createPresetRequest(deviceId, data);

        toast.success("Cenário clínico salvo", {
          position: "bottom-right",
        });

        try {
          const updated = await findPresets(deviceId);

          if (latestRequestRef.current === requestId) {
            setPresets(updated);
          }
        } catch {
          // O interceptor do Axios já exibe o erro.
        }

        return true;
      } catch {
        // O interceptor do Axios já exibe o erro.
        return false;
      } finally {
        setCreating(false);
      }
    },
    [creating, deviceId],
  );

  const activatePreset = useCallback(
    async (presetId: string): Promise<boolean> => {
      if (busyPresetId !== null) return false;

      const requestId = latestRequestRef.current;
      setBusyPresetId(presetId);

      try {
        await activatePresetRequest(deviceId, presetId);

        toast.success("Cenário clínico ativado", {
          position: "bottom-right",
        });

        try {
          const updated = await findDeviceConfig(deviceId);

          if (latestRequestRef.current === requestId) {
            setConfig(updated);
          }
        } catch {
          // O interceptor do Axios já exibe o erro.
        }

        return true;
      } catch {
        // O interceptor do Axios já exibe o erro.
        return false;
      } finally {
        setBusyPresetId(null);
      }
    },
    [busyPresetId, deviceId],
  );

  return {
    device,
    config,
    scenariosByPoint,
    presets,
    loading,
    error,
    busyPointId,
    busyPresetId,
    creating,
    selectScenario,
    createPreset,
    activatePreset,
    refetch,
  };
}
