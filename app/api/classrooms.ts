import type {
  Classroom,
  ClassroomMember,
  ClassroomRequest,
} from "~/types/Classroom";
import type { Page } from "~/types/user";
import { api } from "./axios";

const BASE = "/api/v1/classrooms";

// institutionId só vale para ADMIN; para o gestor o backend usa a própria instituição
export async function findClassrooms(params: {
  name?: string;
  page: number;
  size: number;
  institutionId?: string;
}): Promise<Page<Classroom>> {
  const response = await api.get<Page<Classroom>>(BASE, {
    params: {
      name: params.name ?? "",
      page: params.page,
      size: params.size,
      ...(params.institutionId ? { institutionId: params.institutionId } : {}),
    },
  });
  return response.data;
}

export async function findClassroomById(id: string): Promise<Classroom> {
  const response = await api.get<Classroom>(`${BASE}/${id}`);
  return response.data;
}

export async function createClassroom(
  data: ClassroomRequest,
): Promise<Classroom> {
  const response = await api.post<Classroom>(BASE, data);
  return response.data;
}

export async function updateClassroom(
  id: string,
  data: ClassroomRequest,
): Promise<Classroom> {
  const response = await api.put<Classroom>(`${BASE}/${id}`, data);
  return response.data;
}

export async function deleteClassroom(id: string): Promise<void> {
  await api.delete<void>(`${BASE}/${id}`);
}

export async function archiveClassroom(id: string): Promise<void> {
  await api.patch<void>(`${BASE}/${id}/archive`);
}

export async function unarchiveClassroom(id: string): Promise<void> {
  await api.patch<void>(`${BASE}/${id}/unarchive`);
}

export async function findClassroomMembers(
  id: string,
  page: number,
  size: number,
): Promise<Page<ClassroomMember>> {
  const response = await api.get<Page<ClassroomMember>>(
    `${BASE}/${id}/members`,
    { params: { page, size } },
  );
  return response.data;
}

export async function addClassroomMember(
  id: string,
  userId: string,
): Promise<void> {
  await api.post<void>(`${BASE}/${id}/members/${userId}`);
}

export async function removeClassroomMember(
  id: string,
  userId: string,
): Promise<void> {
  await api.delete<void>(`${BASE}/${id}/members/${userId}`);
}

// remove todos os alunos de uma vez (virada de semestre)
export async function clearClassroomStudents(id: string): Promise<void> {
  await api.delete<void>(`${BASE}/${id}/students`);
}
