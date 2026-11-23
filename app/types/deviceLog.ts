export type DeviceLogLevel = "DEBUG" | "INFO" | "WARN" | "ERROR";

export type DeviceLogCategory =
  | "WIFI"
  | "NET"
  | "MQTT"
  | "REGISTER"
  | "SYNC"
  | "AUDIO"
  | "SYSTEM";

export interface DeviceLog {
  id: string;
  occurredAt: string;
  level: DeviceLogLevel;
  category: DeviceLogCategory;
  code: string;
  message: string;
  occurrences: number;
  bootId: string;
}
