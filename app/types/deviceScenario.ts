export interface ScenarioRef {
  id: string;
  name: string;
  description: string;
  audioUri: string;
  audioRevision: string | null;
}

export interface PointConfig {
  pointId: string;
  position: string;
  sensorIndex: number | null;
  scenario: ScenarioRef | null;
  active: boolean;
}

export interface DeviceConfig {
  deviceId: string;
  points: PointConfig[];
}

export interface PresetPoint {
  pointId: string;
  scenarioId: string;
}

export interface ClinicalPreset {
  id: string;
  name: string;
  description: string | null;
  points: PresetPoint[];
}

export interface ClinicalPresetRequest {
  name: string;
  description?: string;
  points: PresetPoint[];
}
