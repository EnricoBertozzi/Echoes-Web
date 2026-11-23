export interface Animal {
  id: string;
  name: string;
  description: string;
  model: string;
  active: boolean;
}

export interface AnimalDataRequest {
  name: string;
  description: string;
  model: string
}

export interface AnimalUpdateRequest {
  id: string;
  name: string;
  description: string;
  model: string
}
