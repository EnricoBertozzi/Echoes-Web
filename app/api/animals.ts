import type { Animal, AnimalRegisterRequest } from "~/types/Animal";
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

export async function createAnimal(data: AnimalRegisterRequest) {
  const response = await api.post<void>(
    "http://localhost:8080/animals",
    data,
  );

  return response.status;
}
