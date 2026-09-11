export interface Animal {
  id: string;
  name: string;
  description: string;
  model: string
}

export interface AnimalRegisterRequest {
  name: string;
  description: string;
  model: string
}