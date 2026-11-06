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

export async function createUser(
  role: UserRole,
  data: CreateUserRequest,
): Promise<PendingUser> {
  const response = await api.post<PendingUser>(`/api/v1/users/${role}`, data);
  return response.data;
}

export async function completeRegistration(
  data: CompleteRegistrationRequest,
): Promise<User> {
  const response = await api.post<User>("/api/v1/users/2fa", data);
  return response.data;
}

export async function findAllUsers(
  role: UserRole,
  params: { page: number; size: number; institutionId?: string },
) {
  const response = await api.get<Page<User>>(`/api/v1/users/${role}`, {
    params: {
      page: params.page,
      size: params.size,
      ...(params.institutionId !== undefined
        ? { institutionId: params.institutionId }
        : {}),
    },
  });
  return response;
}

export async function findUser(role: UserRole, id: string): Promise<User> {
  const response = await api.get<User>(`/api/v1/users/${role}/${id}`);
  return response.data;
}

export async function findUsersByName(
  role: UserRole, 
  name: string,
  params: { page: number; size: number },
) {
  const response = await api.get<Page<User>>(`/api/v1/users/${role}/search/${name}`, {
    params: {
      page: params.page,
      size: params.size
    }
  });
  return response;
}

export async function updateUser(
  role: UserRole,
  id: string,
  data: UpdateUserRequest,
): Promise<User> {
  const response = await api.patch<User>(`/api/v1/users/${role}/${id}`, data);
  return response.data;
}

export async function deleteUser(role: UserRole, id: string): Promise<void> {
  await api.delete<void>(`/api/v1/users/${role}/${id}`);
}

export async function fetchCurrentUser() {
  const response = await api.get<User>("/api/v1/users/me");
  return response;
}