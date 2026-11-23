import type { DeviceLogCategory, DeviceLogLevel } from "~/types/deviceLog";

export const deviceLogLevelLabels: Record<DeviceLogLevel, string> = {
  DEBUG: "Depuração",
  INFO: "Info",
  WARN: "Aviso",
  ERROR: "Erro",
};

export const deviceLogLevelStyles: Record<DeviceLogLevel, string> = {
  DEBUG: "bg-slate-100 text-slate-600",
  INFO: "bg-sky-100 text-sky-800",
  WARN: "bg-amber-100 text-amber-800",
  ERROR: "bg-red-100 text-red-700",
};

export const deviceLogCategoryLabels: Record<DeviceLogCategory, string> = {
  WIFI: "Wi-Fi",
  NET: "Rede / API",
  MQTT: "MQTT",
  REGISTER: "Cadastro",
  SYNC: "Sincronização",
  AUDIO: "Áudio",
  SYSTEM: "Sistema",
};

export function formatDeviceLogTime(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}
