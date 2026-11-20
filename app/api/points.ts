import type { AuscultationPoint, AuscultationPointRegisterRequest, AuscultationPointUpdateRequest } from "~/types/AuscultationPoint";
import { api } from "./axios";

const BASE = "/api/legacy/points";

export async function findAllPointsByAnimalId(page: number, size: number, animalId?: string): Promise<AuscultationPoint[]> {
  const response = await api.get<AuscultationPoint[]>(BASE, {
    params: {
      page,
      size,
      animalId
    }
  });

  return response.data;
}

export async function createPoint(point: AuscultationPointRegisterRequest) {
  const response = await api.post<void>(BASE, point);

  return response.status;
}

export async function updatePoint(point: AuscultationPointUpdateRequest) {
  const response = await api.patch<void>(`${BASE}/${point.pointId}`, point);

  return response.status;
}

export async function deletePoint(id: string) {
  await api.delete<void>(`${BASE}/${id}`)
}
