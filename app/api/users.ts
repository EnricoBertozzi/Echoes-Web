import type {
  CompleteRegistrationRequest,
  CreateUserRequest,
  Page,
  PendingUser,
  UpdateUserRequest,
  User, UserRole,
} from "~/types/user";
import { api } from "./axios";

export async function createUser(role: UserRole, data: CreateUserRequest): Promise<PendingUser> {
  const response = await api.post<PendingUser>(`/users/${role}`, data);
  return response.data;
}

export async function completeRegistration(data: CompleteRegistrationRequest): Promise<User> {
  const response = await api.post<User>("/users/2fa", data);
  return response.data;
}

export async function findAllUsers(
  role: UserRole,
  params: { page: number; size: number; institutionId?: string }
): Promise<Page<User>> {
  const response = await api.get<Page<User>>(`/users/${role}`, {
    params: {
      page: params.page,
      size: params.size,
      ...(params.institutionId !== undefined ? { institutionId: params.institutionId } : {}),
    },
  });
  return response.data;
}

export async function findUser(role: UserRole, id: string): Promise<User> {
  const response = await api.get<User>(`/users/${role}/${id}`);
  return response.data;
}

export async function updateUser(role: UserRole, id: string, data: UpdateUserRequest): Promise<User> {
  const response = await api.patch<User>(`/users/${role}/${id}`, data);
  return response.data;
}

export async function deleteUser(role: UserRole, id: string): Promise<void> {
  await api.delete<void>(`/users/${role}/${id}`);
}
