import type { Animal } from "~/types/Animal";
import { api } from "./axios";

export async function findAllAnimals(page: number, size: number): Promise<Animal[]> {
  const response = await api.get<Animal[]>("/animals", {
    params: {
      page,
      size
    }
  });

  return response.data;
}