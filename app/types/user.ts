export type UserRole = 'admin' | 'manager' | 'teacher' | 'student'; // lowercase = URL path segments
export type ApiRole = 'ADMIN' | 'MANAGER' | 'TEACHER' | 'STUDENT'; // uppercase = API responses

export interface User {
  id: string;
  name: string;
  email: string;
  institutionId: string | null;
  role: ApiRole;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  institutionId?: string;
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  institutionId?: string | null;
}

export interface CompleteRegistrationRequest {
  password: string;
  code: string;
  email: string;
}

export interface PendingUser { // 202 response
  name: string;
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
  admin: 'Administrador',
  manager: 'Gestor',
  teacher: 'Professor',
  student: 'Estudante',
};

const apiRoleToUserRole: Record<ApiRole, UserRole> = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  TEACHER: 'teacher',
  STUDENT: 'student',
};

export function roleToUserRole(apiRole: ApiRole): UserRole {
  return apiRoleToUserRole[apiRole];
}
