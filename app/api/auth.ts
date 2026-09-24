import { api } from "./axios";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface MfaRequest {
  email: string;
  code: string;
}

export interface LoginResponse {
  token: string;
}

export async function login(payload: LoginRequest) {
  const response = await api.post<void>("/api/v1/auth/login", payload);
  return response.status;
}

export async function validMfa(payload: MfaRequest) {
  const response = await api.post<LoginResponse>("/api/v1/auth/mfa", payload);
  return response;
}

export async function logout() {
  const response = await api.post<void>("/api/v1/auth/logout");
  return response;
}
// TODO adicionar para auth gerenciar o token e não localStorage
