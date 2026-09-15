export interface AuscultationPoint {
  id: string;
  position: string;
  animalId: string;
}

export interface AuscultationPointRegisterRequest {
  position: string;
  animalId: string
}

export interface AuscultationPointUpdateRequest {
  position: string;
}
