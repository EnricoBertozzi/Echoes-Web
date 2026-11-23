import type {
  Animal,
  AnimalDataRequest,
  AnimalUpdateRequest,
} from "~/types/Animal";
import { api } from "./axios";

const BASE = "/api/legacy/animals";

export async function findAllAnimals(
  page: number,
  size: number,
): Promise<Animal[]> {
  const response = await api.get<Animal[]>(BASE, {
    params: {
      page,
      size,
    },
  });

  return response.data;
}

export async function findAnimalsByName(
  name: string,
  page: number,
  size: number,
) {
  const response = await api.get<Animal[]>(`${BASE}/search`, {
    params: {
      name,
      page,
      size,
    },
  });

  return response.data;
}

export async function findAnimalById(id?: string) {
  const response = await api.get(`${BASE}/${id}`);

  return response.data;
}

export async function createAnimal(data: AnimalDataRequest) {
  const response = await api.post<void>(BASE, data);

  return response.status;
}

export async function updateAnimal(data: AnimalUpdateRequest) {
  await api.patch(`${BASE}/${data.id}`, data);
}

export async function deleteAnimal(id: string) {
  await api.delete(`${BASE}/${id}`);
}

export async function deactivateAnimal(id: string): Promise<Animal> {
  const response = await api.patch<Animal>(`${BASE}/${id}/deactivate`);

  return response.data;
}

export async function activateAnimal(id: string): Promise<Animal> {
  const response = await api.patch<Animal>(`${BASE}/${id}/activate`);

  return response.data;
}
