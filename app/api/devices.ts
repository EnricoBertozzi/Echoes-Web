import type { DeviceInfo, DeviceStatus } from "~/types/device";
import { api } from "./axios";

// O DeviceController ainda está em "/devices" (sem /api/v1). Se for migrado, troque só aqui.
const BASE = "/devices";

export async function findDevices(params: {
  page: number;
  size: number;
  status?: DeviceStatus;
}): Promise<DeviceInfo[]> {
  const response = await api.get<DeviceInfo[]>(BASE, { params });
  return response.data;
}

export async function approveDevice(
  deviceId: string,
  institutionId: string,
): Promise<DeviceInfo> {
  const response = await api.post<DeviceInfo>(`${BASE}/${deviceId}/approve`, {
    institutionId,
  });
  return response.data;
}
