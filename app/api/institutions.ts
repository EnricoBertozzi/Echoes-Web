import axios from "axios";
import type {
  Institution,
  InstitutionPage,
  InstitutionRegisterRequest,
  InstitutionUpdateRequest,
} from "~/types/Institution";
import { api } from "./axios";

const BASE_PATH = "/api/v1/institutions";

const META_KEYS = ["message", "detail", "title", "timestamp", "status", "error", "trace", "path"];

interface FieldError {
  field: string;
  message: string;
}

interface InstitutionErrorBody {
  message?: string;
  detail?: string;
  title?: string;
  errors?: FieldError[];
}

export class ApiRequestError extends Error {
  readonly status: number;
  readonly fieldErrors?: Record<string, string>;

  constructor(status: number, message?: string, fieldErrors?: Record<string, string>) {
    super(message ?? "Erro na requisição");
    this.name = "ApiRequestError";
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function parseErrorBody(data: unknown): { message?: string; fieldErrors?: Record<string, string> } {
  if (!isRecord(data)) {
    return {};
  }

  const body = data as InstitutionErrorBody;

  let fieldErrors = body.errors?.reduce<Record<string, string>>((acc, fieldError) => {
    acc[fieldError.field] = fieldError.message;
    return acc;
  }, {});

  if (!fieldErrors || Object.keys(fieldErrors).length === 0) {
    const flat: Record<string, string> = {};
    for (const [key, value] of Object.entries(data)) {
      if (!META_KEYS.includes(key) && typeof value === "string") {
        flat[key] = value;
      }
    }
    fieldErrors = Object.keys(flat).length > 0 ? flat : undefined;
  }

  return {
    message: body.message ?? body.detail ?? body.title,
    fieldErrors,
  };
}

function toApiRequestError(error: unknown): ApiRequestError {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status ?? 0;
    const { message, fieldErrors } = parseErrorBody(error.response?.data);
    return new ApiRequestError(status, message, fieldErrors);
  }
  if (error instanceof Error) {
    return new ApiRequestError(0, error.message);
  }
  return new ApiRequestError(0);
}

async function request<T>(run: () => Promise<T>): Promise<T> {
  try {
    return await run();
  } catch (error) {
    throw toApiRequestError(error);
  }
}

export async function findAllInstitutions(params: {
  name?: string;
  page: number;
  size: number;
}): Promise<InstitutionPage> {
  const response = await request(() =>
    api.get<InstitutionPage>(BASE_PATH, { params }),
  );
  return response.data;
}

export async function findInstitutionById(id: string): Promise<Institution> {
  const response = await request(() => api.get<Institution>(`${BASE_PATH}/${id}`));
  return response.data;
}

export async function createInstitution(
  data: InstitutionRegisterRequest,
): Promise<Institution> {
  const response = await request(() => api.post<Institution>(BASE_PATH, data));
  return response.data;
}

export async function updateInstitution(
  id: string,
  data: InstitutionUpdateRequest,
): Promise<Institution> {
  const response = await request(() =>
    api.put<Institution>(`${BASE_PATH}/${id}`, data),
  );
  return response.data;
}

export async function toggleInstitutionStatus(id: string): Promise<void> {
  await request(() => api.patch<void>(`${BASE_PATH}/${id}/toggle-status`));
}

export async function deleteInstitution(id: string): Promise<void> {
  await request(() => api.delete<void>(`${BASE_PATH}/${id}`));
}
