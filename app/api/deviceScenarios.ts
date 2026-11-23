import type {
  ClinicalPreset,
  ClinicalPresetRequest,
  DeviceConfig,
} from "~/types/deviceScenario";
import { api } from "./axios";

// O DeviceScenarioController usa /api/v1/devices, diferente de /devices.
const BASE = "/api/v1/devices";

export async function findDeviceConfig(deviceId: string): Promise<DeviceConfig> {
  const response = await api.get<DeviceConfig>(`${BASE}/${deviceId}/scenario`);

  return response.data;
}

export async function selectPointScenario(
  deviceId: string,
  pointId: string,
  scenarioId: string,
): Promise<void> {
  await api.put(`${BASE}/${deviceId}/points/${pointId}/scenario`, {
    scenarioId,
  });
}

export async function findPresets(
  deviceId: string,
): Promise<ClinicalPreset[]> {
  const response = await api.get<ClinicalPreset[]>(
    `${BASE}/${deviceId}/scenario-presets`,
  );

  return response.data;
}

export async function createPreset(
  deviceId: string,
  data: ClinicalPresetRequest,
): Promise<ClinicalPreset> {
  const response = await api.post<ClinicalPreset>(
    `${BASE}/${deviceId}/scenario-presets`,
    data,
  );

  return response.data;
}

export async function deletePreset(
  deviceId: string,
  presetId: string,
): Promise<void> {
  await api.delete(`${BASE}/${deviceId}/scenario-presets/${presetId}`);
}

export async function activatePreset(
  deviceId: string,
  presetId: string,
): Promise<void> {
  await api.put(`${BASE}/${deviceId}/scenario-presets/${presetId}/activate`);
}
