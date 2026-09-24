export class ApiRequestError extends Error {
  readonly status: number;
  readonly fieldErrors?: Record<string, string>;

  constructor(
    status: number,
    message = "Erro na requisição",
    fieldErrors?: Record<string, string>,
  ) {
    super(message);
    this.name = "ApiRequestError";
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function parseErrorBody(data: unknown): {
  message?: string;
  fieldErrors?: Record<string, string>;
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

  return {
    message,
    fieldErrors,
  };
}
