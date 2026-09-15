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
}

export interface ScenarioUpdateRequest {
  name: string;
  description: string;
}