import type { Page } from "~/types/user";
import type {
  DeviceLog,
  DeviceLogCategory,
  DeviceLogLevel,
} from "~/types/deviceLog";
import { api } from "./axios";

const BASE = "/api/v1/devices";

export interface DeviceLogParams {
  page: number;
  size: number;
  /** Esse nível e os mais graves (WARN = avisos e erros). */
  minLevel?: DeviceLogLevel;
  category?: DeviceLogCategory;
}

export async function findDeviceLogs(
  deviceId: string,
  params: DeviceLogParams,
): Promise<Page<DeviceLog>> {
  const response = await api.get<Page<DeviceLog>>(
    `${BASE}/${deviceId}/logs`,
    { params },
  );
  return response.data;
}
