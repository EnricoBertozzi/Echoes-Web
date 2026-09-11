export interface Animal {
  id: string;
  name: string;
  description: string;
  model: string
}

export interface AnimalDataRequest {
  name: string;
  description: string;
  model: string
}