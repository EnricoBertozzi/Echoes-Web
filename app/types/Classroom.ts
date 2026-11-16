import type { ApiRole } from "./user";

export interface Classroom {
  id: string;
  title: string;
  description: string | null;
  period: string; // AAAA/SS, ex.: 2026/01
  archived: boolean;
  institutionId: string;
  createdAt: string;
  // só vem na consulta por id e só para professor da turma
  joinCode: string | null;
}

export interface ClassroomRequest {
  title: string;
  description: string;
  period: string;
}

export interface ClassroomMember {
  userId: string;
  name: string;
  email: string;
  role: ApiRole;
  joinedAt: string;
}

// POST /api/v1/classrooms/join (somente STUDENT)
export interface ClassroomJoinRequest {
  code: string;
}

// POST /api/v1/classrooms/{id}/code (somente TEACHER da turma)
export interface ClassroomCodeResponse {
  code: string;
  expiresInSeconds: number;
}
