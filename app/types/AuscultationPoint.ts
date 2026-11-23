export interface AuscultationPoint {
  id: string;
  position: string;
  animalId: string;
  active: boolean;
}

export interface AuscultationPointRegisterRequest {
  position: string;
  animalId: string
}

export interface AuscultationPointUpdateRequest {
  pointId: string;
  position: string;
}
