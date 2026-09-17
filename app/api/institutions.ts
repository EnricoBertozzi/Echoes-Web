import type {
  Institution,
  InstitutionPage,
  InstitutionRegisterRequest,
  InstitutionUpdateRequest,
} from "~/types/Institution";
import { api } from "./axios";

export async function findAllInstitutions(params: {
  name?: string;
  page: number;
  size: number;
}): Promise<InstitutionPage> {
  const response = await api.get<InstitutionPage>('/api/v1/institutions', { params });
  return response.data;
}

export async function findInstitutionById(id: string): Promise<Institution> {
  const response = await api.get<Institution>(`/api/v1/institutions/${id}`);
  return response.data;
}

export async function createInstitution(
  data: InstitutionRegisterRequest,
): Promise<Institution> {
  const response = await api.post<Institution>('/api/v1/institutions', data);
  return response.data;
}

export async function updateInstitution(
  id: string,
  data: InstitutionUpdateRequest,
): Promise<Institution> {
  const response = await api.put<Institution>(`/api/v1/institutions/${id}`, data);
  return response.data;
}

export async function toggleInstitutionStatus(id: string): Promise<void> {
  await api.patch<void>(`/api/v1/institutions/${id}/toggle-status`);
}

export async function deleteInstitution(id: string): Promise<void> {
  await api.delete<void>(`/api/v1/institutions/${id}`);
}
