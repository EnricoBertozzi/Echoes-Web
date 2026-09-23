import type { AcceptTermRequest, TermResponseDTO, TermType } from "~/types/terms";
import { api } from "./axios";

/**
 * GET /terms/{type} — conteúdo bruto do termo ativo (corpo = Markdown).
 * A API responde com Content-Type text/html, mas o corpo é o Markdown armazenado.
 */
export async function findActiveTermContent(type: TermType): Promise<string> {
  const response = await api.get<string>(`/terms/${type}`, {
    responseType: "text",
  });
  return response.data;
}

/**
 * GET /terms/{type}/json — termo ativo em DTO estruturado.
 * Erro 500 "No active terms found for type: X" quando não há PUBLISHED do tipo.
 */
export async function findActiveTerm(type: TermType): Promise<TermResponseDTO> {
  const response = await api.get<TermResponseDTO>(`/terms/${type}/json`, {
  });
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

/**
 * POST /terms/accept — registra o aceite do termo ativo para o usuário do JWT.
 * O campo `email` do body não é utilizado pelo backend: o usuário é sempre
 * resolvido pelo principal do token; apenas `type` é efetivamente lido.
 */
export async function acceptTerm(data: AcceptTermRequest): Promise<TermResponseDTO> {
  const response = await api.post<TermResponseDTO>("/terms/accept", data);
  return response.data;
}
