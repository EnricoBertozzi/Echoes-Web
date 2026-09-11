import type { Animal, AnimalDataRequest } from "~/types/Animal";
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
  size: number
) {
  const response = await api.get<Animal[]>("/animals/search", {
      params: {
        name,
        page,
        size,
      },
    }
  );

  return response.data;
}

export async function createAnimal(data: AnimalDataRequest) {
  const response = await api.post<void>("/animals", data);

  return response.status;
}

export async function updateAnimal(
  id: string,
  data: AnimalDataRequest
) {
  await api.patch(`/animals/${id}`, data);
}

export async function deleteAnimal(id: string) {
  await api.delete(`/animals/${id}`);
}
