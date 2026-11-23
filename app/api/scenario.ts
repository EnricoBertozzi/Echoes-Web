import { api } from "./axios";

import type {
  Scenario,
  ScenarioRegisterRequest,
  ScenarioUpdateRequest,
} from "~/types/Scenario";

export async function findScenariosByPointId(
  pointId: string,
  page: number,
  size: number,
): Promise<Scenario[]> {
  const response = await api.get<Scenario[]>("/api/v1/scenarios", {
    params: {
      id: pointId,
      page,
      size,
    },
  });

  return response.data;
}

export async function findScenarioById(id: string): Promise<Scenario> {
  const response = await api.get<Scenario>(`/api/v1/scenarios/${id}`);

  return response.data;
}

export async function createScenario(
  data: ScenarioRegisterRequest,
  file: File,
) {
  const formData = new FormData();

  formData.append(
    "dto",
    new Blob([JSON.stringify(data)], {
      type: "application/json",
    }),
  );

  formData.append("file", file);

  const response = await api.post<void>("/api/v1/scenarios", formData);

  return response.status;
}

export async function updateScenario(data: ScenarioUpdateRequest) {
  await api.patch(`/api/v1/scenarios/${data.id}`, data);
}

export async function deleteScenario(id: string) {
  await api.delete(`/api/v1/scenarios/${id}`);
}

export async function deactivateScenario(id: string): Promise<Scenario> {
  const response = await api.patch<Scenario>(
    `/api/v1/scenarios/${id}/deactivate`,
  );

  return response.data;
}

export async function activateScenario(id: string): Promise<Scenario> {
  const response = await api.patch<Scenario>(
    `/api/v1/scenarios/${id}/activate`,
  );

  return response.data;
}

// carrega todas as páginas de cenários de um ponto (50 por página)
export async function findAllScenariosByPoint(
  pointId: string,
): Promise<Scenario[]> {
  const all: Scenario[] = [];

  for (let page = 0; ; page++) {
    const batch = await findScenariosByPointId(pointId, page, 50);
    all.push(...batch);

    if (batch.length < 50) return all;
  }
}
