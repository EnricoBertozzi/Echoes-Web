import type {
  AcceptTermRequest,
  CreateTermRequest,
  TermResponseDTO,
  TermStatus,
  TermType,
} from "~/types/terms";
import { api } from "./axios";

/**
 * GET /terms — histórico completo para a administração (ROLE_ADMIN).
 * `type` e `status` são filtros opcionais.
 */
export async function findTerms(params?: {
  type?: TermType;
  status?: TermStatus;
}): Promise<TermResponseDTO[]> {
  const response = await api.get<TermResponseDTO[]>("/terms", { params });
  return response.data;
}

/**
 * GET /terms/pending — tipos obrigatórios cujo PUBLISHED atual ainda não foi aceito.
 */
export async function findPendingTerms(): Promise<TermType[]> {
  const response = await api.get<TermType[]>("/terms/pending");
  return response.data;
}

/**
 * POST /terms/accept — registra o aceite do PUBLISHED atual do tipo.
 */
export async function acceptTerm(
  data: AcceptTermRequest,
): Promise<TermResponseDTO> {
  const response = await api.post<TermResponseDTO>("/terms/accept", data);
  return response.data;
}

/**
 * POST /terms — cria um termo (ROLE_ADMIN).
 */
export async function createTerm(
  data: CreateTermRequest,
): Promise<TermResponseDTO> {
  const response = await api.post<TermResponseDTO>("/terms", data);
  return response.data;
}

/**
 * PATCH /terms/{id}/content — edita o conteúdo de um termo DRAFT (ROLE_ADMIN).
 */
export async function updateTermContent(
  id: number,
  content: string,
): Promise<TermResponseDTO> {
  const response = await api.patch<TermResponseDTO>(`/terms/${id}/content`, {
    content,
  });
  return response.data;
}

/**
 * PATCH /terms/{id}/status — altera o status de um termo (ROLE_ADMIN).
 */
export async function updateTermStatus(
  id: number,
  status: TermStatus,
): Promise<TermResponseDTO> {
  const response = await api.patch<TermResponseDTO>(`/terms/${id}/status`, {
    status,
  });
  return response.data;
}

/**
 * GET /terms/{type}/json — termo ativo em DTO estruturado.
 * Erro 500 "No active terms found for type: X" quando não há PUBLISHED do tipo.
 */
export async function findActiveTerm(type: TermType): Promise<TermResponseDTO> {
  const response = await api.get<TermResponseDTO>(`/terms/${type}/json`);
  return response.data;
}

/**
 * GET /terms/{type}/accepted — se o usuário do JWT já aceitou o termo ativo do tipo.
 * Erro 500 "User not found" quando o e-mail do token não existe na base.
 */
export async function hasAcceptedTerm(type: TermType): Promise<boolean> {
  const response = await api.get<boolean>(`/terms/${type}/accepted`);
  return response.data;
}

