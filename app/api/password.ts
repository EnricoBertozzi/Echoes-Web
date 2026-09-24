import { api } from "./axios";

export interface ForgotRequest {
  email: string;
}

export interface ValidateCodeRequest {
  email: string;
  code: string;
}

export interface ValidateCodeResponse {
  token: string
}

export interface ResetRequest {
  email: string;
  token: string;
  newPassword: string;
}

export async function forgotPassword(payload: ForgotRequest) {
  const response = await api.post<void>("/api/v1/password/forgot", payload);
  return response;
}

export async function validatePasswordCode(payload: ValidateCodeRequest) {
  const response = await api.post<ValidateCodeResponse>("/api/v1/password/validate", payload);
  return response;
}

export async function resetPassword(payload: ResetRequest) {
  const response = await api.post<void>("/api/v1/password/reset", payload);
  return response;
}

