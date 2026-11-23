import type { TermType } from "~/types/terms";
import { termTypes } from "~/types/terms";

export class ApiRequestError extends Error {
  readonly status: number;
  readonly fieldErrors?: Record<string, string>;
  readonly pendingTerms?: TermType[];

  constructor(
    status: number,
    message = "Erro na requisição",
    fieldErrors?: Record<string, string>,
    pendingTerms?: TermType[],
  ) {
    super(message);
    this.name = "ApiRequestError";
    this.status = status;
    this.fieldErrors = fieldErrors;
    this.pendingTerms = pendingTerms;
  }
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function toStringRecord(
  value: unknown,
): Record<string, string> | undefined {
  if (!isRecord(value)) {
    return undefined;
  }

  const entries = Object.entries(value).filter(
    ([, entry]) => typeof entry === "string",
  );

  return entries.length > 0
    ? (Object.fromEntries(entries) as Record<string, string>)
    : undefined;
}

// Chaves usadas pelo envelope de erro; não são nomes de campos de formulário.
const ERROR_ENVELOPE_KEYS = new Set([
  "code",
  "detail",
  "error",
  "fieldErrors",
  "instance",
  "message",
  "path",
  "pendingTerms",
  "status",
  "timestamp",
  "title",
  "trace",
  "type",
]);

export function parseErrorBody(data: unknown): {
  message?: string;
  fieldErrors?: Record<string, string>;
  pendingTerms?: TermType[];
} {
  if (!isRecord(data)) {
    return {};
  }

  const message =
    typeof data.message === "string"
      ? data.message
      : typeof data.detail === "string"
        ? data.detail
        : undefined;

  let fieldErrors = toStringRecord(data.fieldErrors);

  // Alguns handlers do backend devolvem os erros de validação diretamente no
  // corpo, sem o envelope `fieldErrors` (ex.: { "email": "E-mail inválido" }).
  if (!fieldErrors) {
    const entries = Object.entries(data).filter(
      ([key, value]) =>
        !ERROR_ENVELOPE_KEYS.has(key) && typeof value === "string",
    );

    if (entries.length > 0) {
      fieldErrors = Object.fromEntries(entries) as Record<string, string>;
    }
  }

  const pendingTerms = Array.isArray(data.pendingTerms)
    ? data.pendingTerms.filter((value): value is TermType =>
        typeof value === "string" && termTypes.includes(value as TermType),
      )
    : undefined;

  return {
    message:
      message ??
      (fieldErrors ? "Verifique os campos informados." : undefined),
    fieldErrors,
    pendingTerms: pendingTerms && pendingTerms.length > 0
      ? pendingTerms
      : undefined,
  };
}
