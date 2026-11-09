import type {
  DevicesSummary,
  Rankings,
  UsageSummary,
} from "~/types/dashboard";
import { api } from "./axios";

const BASE = "/api/v1/dashboard";

// institutionId só vale para ADMIN; para gestor o backend usa a própria instituição.
function institutionParam(institutionId?: string) {
  return institutionId ? { institutionId } : {};
}

export async function findDashboardDevices(
  institutionId?: string,
): Promise<DevicesSummary> {
  const response = await api.get<DevicesSummary>(`${BASE}/devices`, {
    params: institutionParam(institutionId),
  });
  return response.data;
}

export async function findDashboardUsage(
  days: number,
  institutionId?: string,
): Promise<UsageSummary> {
  const response = await api.get<UsageSummary>(`${BASE}/usage`, {
    params: { days, ...institutionParam(institutionId) },
  });
  return response.data;
}

export async function findDashboardRankings(
  days: number,
  institutionId?: string,
): Promise<Rankings> {
  const response = await api.get<Rankings>(`${BASE}/rankings`, {
    params: { days, ...institutionParam(institutionId) },
  });
  return response.data;
}
