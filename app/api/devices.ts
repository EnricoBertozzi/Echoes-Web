import type {
  DeviceInfo,
  DeviceStatus,
  DeviceUpdateRequest,
} from "~/types/device";
import { api } from "./axios";
import type { Page } from "~/types/user";

// O DeviceController ainda está em "/devices" (sem /api/v1). Se for migrado, troque só aqui.
const BASE = "/api/legacy/devices";

export interface DeviceSearchParams {
  page: number;
  size: number;
  name?: string;
  status?: DeviceStatus;
  institutionId?: string;
}

export async function findDevices(
  params: DeviceSearchParams,
): Promise<Page<DeviceInfo>> {
  const response = await api.get<Page<DeviceInfo>>(BASE, { params });

  return response.data;
}

export async function findDevicesByName(params: {
  page: number;
  size: number;
  name: string;
}): Promise<DeviceInfo[]> {
  const response = await api.get<DeviceInfo[]>(`${BASE}/search`, { params });
  return response.data;
}

export async function findDeviceById(deviceId: string): Promise<DeviceInfo> {
  const response = await api.get<DeviceInfo>(`${BASE}/${deviceId}`);
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

export async function changeDeviceInstitutionid(
  deviceId: string,
  institutionId: string,
): Promise<DeviceInfo> {
  const response = await api.patch(`${BASE}/${deviceId}/institution`, {
    institutionId,
  });
  return response.data;
}

export async function deactivateDevice(deviceId: string): Promise<DeviceInfo> {
  const response = await api.patch(`${BASE}/${deviceId}/deactivate`);
  return response.data;
}

export async function activateDevice(deviceId: string): Promise<DeviceInfo> {
  const response = await api.patch(`${BASE}/${deviceId}/activate`);
  return response.data;
}

export async function updateDevice(
  deviceId: string,
  params: DeviceUpdateRequest,
): Promise<DeviceInfo> {
  const response = await api.patch<DeviceInfo>(`${BASE}/${deviceId}`, params);
  return response.data;
}

export async function deleteDevice(deviceId: string): Promise<void> {
  await api.delete(`${BASE}/${deviceId}`);
}
