export type DeviceStatus = "PENDING" | "ACTIVE" | "INACTIVE";

export interface DeviceUpdateRequest {
  name?: string;
  institutionId?: string;
  animalId?: string;
}

export interface DeviceInfo {
  id: string;
  name: string;
  hardwareId: string;
  status: DeviceStatus;
  institutionId: string | null;
  institutionName: string | null;
  animalId: string | null;
  animalName: string | null;
  classroomId: string | null;
  createdAt: string | null;
  lastSeenAt: string | null;
}