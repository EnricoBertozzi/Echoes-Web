export interface Scenario {
  id: string;
  name: string;
  description: string;
  audioPath: string;
}

export interface ScenarioRegisterRequest {
  name: string;
  description: string;
  pointId: string;
  file: File
}

export type ScenarioRegisterForm = Omit<ScenarioRegisterRequest, "file"> & {
  file: File | null;
};

export interface ScenarioUpdateRequest {
  name: string;
  description: string;
}