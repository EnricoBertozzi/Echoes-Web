import type { DeviceStatus } from "~/types/device";

export const deviceStatusLabels: Record<DeviceStatus, string> = {
  PENDING: "Pendente",
  ACTIVE: "Ativo",
  INACTIVE: "Inativo",
};

export const deviceStatusTextStyles: Record<DeviceStatus, string> = {
  PENDING: "text-amber-700",
  ACTIVE: "text-green-700",
  INACTIVE: "text-red-700",
};
