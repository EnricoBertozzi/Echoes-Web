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

export async function createAnimal(data: AnimalDataRequest) {
  const response = await api.post<void>(
    "http://localhost:8080/animals",
    data,
  );

  return response.status;
}

export async function updateAnimal(
  id: string,
  data: AnimalDataRequest
) {
  await api.patch(
    `http://localhost:8080/animals/${id}`,
    data
  );
}
