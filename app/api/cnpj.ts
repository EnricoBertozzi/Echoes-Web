import axios from "axios";
import type { CnpjData } from "~/types/Cnpj";
import { api } from "./axios";

/**
 * Erro tipado para consulta de CNPJ.
 * - status 400 → CNPJ inválido (rejeitado pela BrasilAPI ou validação local)
 * - status 404 → CNPJ não existe na Receita
 * - status 503 → todos os provedores indisponíveis
 * - status 0   → falha de rede / resposta malformada
 */
export class CnpjRequestError extends Error {
  readonly status: number;

  constructor(status: number, message?: string) {
    super(message ?? "Erro ao consultar CNPJ");
    this.name = "CnpjRequestError";
    this.status = status;
  }
}

/**
 * Consulta um CNPJ no backend Echoes-Server.
 * O parâmetro deve ser enviado já normalizado (apenas 14 dígitos).
 */
export async function fetchCnpj(cnpj: string): Promise<CnpjData> {
  try {
    const response = await api.get<CnpjData>(`/api/v1/cnpj/${cnpj}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status ?? 0;
      const body = error.response?.data;
      const message =
        typeof body?.message === "string" ? body.message : undefined;
      throw new CnpjRequestError(status, message);
    }
    if (error instanceof Error) {
      throw new CnpjRequestError(0, error.message);
    }
    throw new CnpjRequestError(0);
  }
}
