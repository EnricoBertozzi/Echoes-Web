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

export function parseErrorBody(data: unknown): {
  message?: string;
  fieldErrors?: Record<string, string>;
  pendingTerms?: TermType[];
} {
  if (!isRecord(data)) {
    return {};
  }

  const message = typeof data.message === "string" ? data.message : undefined;

  let fieldErrors: Record<string, string> | undefined;

  if (isRecord(data.fieldErrors)) {
    const errors = Object.entries(data.fieldErrors).filter(
      ([, value]) => typeof value === "string",
    );

    if (errors.length > 0) {
      fieldErrors = Object.fromEntries(errors) as Record<string, string>;
    }
  }

  const pendingTerms = Array.isArray(data.pendingTerms)
    ? data.pendingTerms.filter((value): value is TermType =>
        typeof value === "string" && termTypes.includes(value as TermType),
      )
    : undefined;

  return {
    message,
    fieldErrors,
    pendingTerms: pendingTerms && pendingTerms.length > 0
      ? pendingTerms
      : undefined,
  };
}
