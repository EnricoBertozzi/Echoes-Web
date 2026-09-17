import axios from "axios";
import { toast } from "sonner";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

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

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function parseErrorBody(data: unknown): {
  message?: string;
  fieldErrors?: Record<string, string>;
} {
  if (!isRecord(data)) {
    return {};
  }

  const message =
    typeof data.message === "string"
      ? data.message
      : undefined;

  let fieldErrors: Record<string, string> | undefined;

  if (isRecord(data.fieldErrors)) {
    const errors = Object.entries(data.fieldErrors).filter(
      ([, value]) => typeof value === "string",
    );

    if (errors.length > 0) {
      fieldErrors = Object.fromEntries(errors) as Record<
        string,
        string
      >;
    }
  }

  return {
    message,
    fieldErrors,
  };
}

api.interceptors.response.use(
  (response) => response,

  (error) => {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status ?? 0;

      const { message, fieldErrors } = parseErrorBody(
        error.response?.data,
      );

      const apiError = new ApiRequestError(
        status,
        message,
        fieldErrors,
      );

      toast.error(apiError.message, { position: 'bottom-right' });

      return Promise.reject(apiError);
    }

    if (error instanceof Error) {
      toast.error(error.message);

      return Promise.reject(
        new ApiRequestError(0, error.message),
      );
    }

    const apiError = new ApiRequestError(0);

    toast.error(apiError.message, { position: 'bottom-right' });

    return Promise.reject(apiError);
  },
);
