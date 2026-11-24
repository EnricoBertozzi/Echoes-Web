import type { TermType } from "./terms";

export type UserRole = "admin" | "manager" | "teacher" | "student"; // lowercase = URL path segments
export type ApiRole = "ADMIN" | "MANAGER" | "TEACHER" | "STUDENT"; // uppercase = API responses

export interface User {
  id: string;
  name: string;
  // usuários criados antes do campo existir vêm com sobrenome nulo
  surname: string | null;
  email: string;
  institutionId: string | null;
  role: ApiRole;
}

export interface CreateUserRequest {
  name: string;
  surname: string;
  email: string;
  institutionId?: string;
}

export interface CreateInstitutionalUserRequest {
  name: string;
  surname: string;
  email: string;
  role: "manager" | "teacher" | "student";
  institutionId?: string;
}

export interface UpdateUserRequest {
  name?: string;
  surname?: string;
  institutionId?: string | null;
}

export interface UpdateCurrentUserRequest {
  name?: string;
  surname?: string;
}

export interface CompleteRegistrationRequest {
  password: string;
  code: string;
  email: string;
  acceptedTerms: TermType[];
}

export interface PendingUser {
  // 202 response
  name: string;
  surname: string | null;
  email: string;
  role: ApiRole;
  institutionId: string | null;
}

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export const userRoles = ["admin", "manager", "teacher", "student"] as const;

export const userRoleLabels: Record<UserRole, string> = {
  admin: "Administrador",
  manager: "Gestor",
  teacher: "Professor",
  student: "Estudante",
};

const apiRoleToUserRole: Record<ApiRole, UserRole> = {
  ADMIN: "admin",
  MANAGER: "manager",
  TEACHER: "teacher",
  STUDENT: "student",
};

export function roleToUserRole(apiRole: ApiRole): UserRole {
  return apiRoleToUserRole[apiRole];
}

// Convite de cadastro ainda válido (GET /api/v1/users/pending)
export interface PendingInvitation {
  name: string;
  surname: string | null;
  email: string;
  role: ApiRole;
  institutionId: string | null;
  invitedAt: string;
  expiresAt: string;
}

// Nome + sobrenome para exibição; tolera sobrenome ausente (cadastros antigos)
export function fullName(person: {
  name: string;
  surname?: string | null;
}): string {
  return [person.name, person.surname]
    .map((part) => part?.trim())
    .filter(Boolean)
    .join(" ");
}
