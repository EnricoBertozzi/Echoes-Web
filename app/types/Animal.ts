export type AnimalSpecies = "canine";

export interface Animal {
  id: string;
  name: string;
  species: AnimalSpecies;
  breed: string;
  ageMonths: number;
}
