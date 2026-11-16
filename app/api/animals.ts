import type {
  Animal,
  AnimalDataRequest,
  AnimalUpdateRequest,
} from "~/types/Animal";
import { api } from "./axios";

export async function findAllAnimals(
  page: number,
  size: number,
): Promise<Animal[]> {
  const response = await api.get<Animal[]>("/animals", {
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
  const response = await api.get<Animal[]>("/animals/search", {
    params: {
      name,
      page,
      size,
    },
  });

  return response.data;
}

export async function findAnimalById(id?: string) {
  const response = await api.get(`/animals/${id}`);

  return response.data;
}

export async function createAnimal(data: AnimalDataRequest) {
  const response = await api.post<void>("/animals", data);

  return response.status;
}

export async function updateAnimal(data: AnimalUpdateRequest) {
  await api.patch(`/animals/${data.id}`, data);
}

export async function deleteAnimal(id: string) {
  await api.delete(`/animals/${id}`);
}
