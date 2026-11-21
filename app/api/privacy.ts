import { api } from "./axios";

/**
 * GET /api/v1/users/me/export — baixa, como arquivo JSON, todos os dados
 * vinculados ao usuário autenticado (LGPD art. 18).
 */
export async function exportMyData(): Promise<void> {
  const response = await api.get<Blob>("/api/v1/users/me/export", {
    responseType: "blob",
  });

  const url = URL.createObjectURL(response.data);
  const link = document.createElement("a");
  link.href = url;
  link.download = "meus-dados-echoes.json";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

/**
 * POST /terms/revoke — revoga o consentimento dos termos obrigatórios (RF17).
 * A sessão é derrubada pelo backend; o titular precisa aceitar novamente
 * os termos para voltar a usar o sistema.
 */
export async function revokeMyConsent(): Promise<void> {
  await api.post("/terms/revoke");
}
