import axios from "axios";
import type {
  CompleteRegistrationRequest,
  CreateUserRequest,
  Page,
  PendingUser,
  UpdateUserRequest,
  User,
  UserRole,
} from "~/types/user";
import { api } from "./axios";

const SPRING_META_KEYS = ["message", "timestamp", "status", "error", "trace", "path"];

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

  const message = typeof data.message === "string" ? data.message : undefined;

  const fieldErrors: Record<string, string> = {};
  for (const [key, value] of Object.entries(data)) {
    if (!SPRING_META_KEYS.includes(key) && typeof value === "string") {
      fieldErrors[key] = value;
    }
  }

  return {
    message,
    fieldErrors: Object.keys(fieldErrors).length > 0 ? fieldErrors : undefined,
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

export async function createUser(role: UserRole, data: CreateUserRequest): Promise<PendingUser> {
  const response = await request(() => api.post<PendingUser>(`/users/${role}`, data));
  return response.data;
}

export async function completeRegistration(data: CompleteRegistrationRequest): Promise<User> {
  const response = await request(() => api.post<User>("/users/2fa", data));
  return response.data;
}

export async function findAllUsers(
  role: UserRole,
  params: { page: number; size: number; institutionId?: string }
): Promise<Page<User>> {
  const response = await request(() =>
    api.get<Page<User>>(`/users/${role}`, {
      params: {
        page: params.page,
        size: params.size,
        ...(params.institutionId !== undefined ? { institutionId: params.institutionId } : {}),
      },
    })
  );
  return response.data;
}

export async function findUser(role: UserRole, id: string): Promise<User> {
  const response = await request(() => api.get<User>(`/users/${role}/${id}`));
  return response.data;
}

export async function updateUser(role: UserRole, id: string, data: UpdateUserRequest): Promise<User> {
  const response = await request(() => api.patch<User>(`/users/${role}/${id}`, data));
  return response.data;
}

export async function deleteUser(role: UserRole, id: string): Promise<void> {
  await request(() => api.delete<void>(`/users/${role}/${id}`));
}
