import { apiClient } from "~/api/client";
import type { Page } from "~/types/Page";
import type {
  Institution,
  InstitutionListParams,
  InstitutionPayload,
} from "~/types/Institution";

const BASE_PATH = "/api/v1/institutions";

export async function listInstitutions(
  params: InstitutionListParams,
): Promise<Page<Institution>> {
  const { data } = await apiClient.get<Page<Institution>>(BASE_PATH, {
    params,
  });
  return data;
}

export async function getInstitution(id: string): Promise<Institution> {
  const { data } = await apiClient.get<Institution>(`${BASE_PATH}/${id}`);
  return data;
}

export async function createInstitution(
  payload: InstitutionPayload,
): Promise<Institution> {
  const { data } = await apiClient.post<Institution>(BASE_PATH, payload);
  return data;
}

export async function updateInstitution(
  id: string,
  payload: InstitutionPayload,
): Promise<Institution> {
  const { data } = await apiClient.put<Institution>(
    `${BASE_PATH}/${id}`,
    payload,
  );
  return data;
}

export async function toggleInstitutionStatus(id: string): Promise<void> {
  await apiClient.patch(`${BASE_PATH}/${id}/toggle-status`);
}

export async function deleteInstitution(id: string): Promise<void> {
  await apiClient.delete(`${BASE_PATH}/${id}`);
}
