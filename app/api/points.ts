import type { AuscultationPoint, AuscultationPointRegisterRequest, AuscultationPointUpdateRequest } from "~/types/AuscultationPoint";
import { api } from "./axios";

export async function findAllPointsByAnimalId(page: number, size: number, animalId?: string): Promise<AuscultationPoint[]> {
  const response = await api.get<AuscultationPoint[]>("/points", {
    params: {
      page,
      size,
      animalId
    }
  });

  return response.data;
}

export async function createPoint(point: AuscultationPointRegisterRequest) {
  const response = await api.post<void>("/points", point);

  return response.status;
}

export async function updatePoint(id: string, point: AuscultationPointUpdateRequest) {
  const response = await api.patch<void>(`/points/${id}`, point);

  return response.status;
}

export async function deletePoint(id: string) {
  await api.delete<void>(`/points/${id}`)
}
