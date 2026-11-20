import { api } from "./axios";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface MfaRequest {
  email: string;
  code: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export async function login(payload: LoginRequest) {
  const response = await api.post<void>("/api/v1/auth/login", payload);
  return response.status;
}

// o servidor grava o cookie de sessão na resposta; nada é devolvido no corpo (S10)
export async function validMfa(payload: MfaRequest) {
  const response = await api.post<void>("/api/v1/auth/mfa", payload);
  return response;
}

export async function logout() {
  const response = await api.post<void>("/api/v1/auth/logout");
  return response;
}

export async function changePassword(
  payload: ChangePasswordRequest,
): Promise<void> {
  await api.patch<void>("/api/v1/auth/password/change", payload);
}
