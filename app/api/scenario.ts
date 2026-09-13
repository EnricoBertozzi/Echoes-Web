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
  const response = await api.get<Scenario[]>("/scenarios", {
    params: {
      id: pointId,
      page,
      size,
    },
  });

  return response.data;
}

export async function findScenarioById(id: string): Promise<Scenario> {
  const response = await api.get<Scenario>(`/scenarios/${id}`);

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

  const response = await api.post<void>("/scenarios", formData);

  return response.status;
}

export async function updateScenario(id: string, data: ScenarioUpdateRequest) {
  await api.patch(`/scenarios/${id}`, data);
}

export async function deleteScenario(id: string) {
  await api.delete(`/scenarios/${id}`);
}
