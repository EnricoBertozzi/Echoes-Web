import { api } from "~/api/axios";
import type { DeviceInfo } from "~/types/device";

function devicesPath(classroomId: string) {
  return `/api/v1/classrooms/${classroomId}/devices`;
}

export async function findClassroomDevices(
  classroomId: string,
): Promise<DeviceInfo[]> {
  const response = await api.get<DeviceInfo[]>(devicesPath(classroomId));

  return response.data;
}

export async function assignClassroomDevice(
  classroomId: string,
  deviceId: string,
): Promise<void> {
  await api.put(`${devicesPath(classroomId)}/${deviceId}`);
}

export async function removeClassroomDevice(
  classroomId: string,
  deviceId: string,
): Promise<void> {
  await api.delete(`${devicesPath(classroomId)}/${deviceId}`);
}
