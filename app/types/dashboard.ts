export interface InstitutionDevices {
  institutionId: string;
  institutionName: string;
  institutionActive: boolean;
  active: number;
  inactive: number;
  operating: number;
}

export interface DevicesSummary {
  pending: number;
  active: number;
  inactive: number;
  operating: number;
  blockedByInstitution: number;
  institutions: InstitutionDevices[];
}

export interface DailyUsage {
  date: string; // yyyy-MM-dd
  connections: number;
  plays: number;
  pauses: number;
  stops: number;
}

export interface UsageSummary {
  from: string;
  to: string;
  connections: number;
  plays: number;
  pauses: number;
  stops: number;
  previousPlays: number;
  activeDevices: number;
  days: DailyUsage[];
}

export interface ScenarioUsage {
  scenarioId: string;
  name: string;
  plays: number;
  devices: number;
}

export interface DeviceUsage {
  deviceId: string;
  name: string;
  plays: number;
  lastEventAt: string | null;
}

export interface Rankings {
  scenarios: ScenarioUsage[];
  devices: DeviceUsage[];
}

export const dashboardPeriods = [7, 30, 90] as const;
export type DashboardPeriod = (typeof dashboardPeriods)[number];
