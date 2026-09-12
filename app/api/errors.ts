import { isAxiosError } from "axios";

interface FieldError {
  field: string;
  message: string;
}

interface ApiErrorBody {
  message?: string;
  detail?: string;
  title?: string;
  errors?: FieldError[];
}

const FALLBACK_MESSAGE = "Não foi possível concluir a operação. Tente novamente.";

/**
 * Traduz um erro (tipicamente vindo do axios) em uma mensagem amigável em pt-BR,
 * priorizando erros de validação por campo, depois message/detail/title do backend.
 */
export function extractErrorMessage(error: unknown): string {
  if (isAxiosError<ApiErrorBody>(error)) {
    const body = error.response?.data;

    if (body?.errors && body.errors.length > 0) {
      return body.errors.map((e) => e.message).join(" ");
    }

    if (body?.message) return body.message;
    if (body?.detail) return body.detail;
    if (body?.title) return body.title;

    if (error.response?.status === 404) {
      return "Registro não encontrado.";
    }

    if (!error.response) {
      return "Não foi possível conectar ao servidor. Verifique sua conexão.";
    }

    return FALLBACK_MESSAGE;
  }

  if (error instanceof Error) return error.message;

  return FALLBACK_MESSAGE;
}
