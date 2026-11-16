import type { ApiRole } from "./user";

export interface Classroom {
  id: string;
  title: string;
  description: string | null;
  period: string; // AAAA/SS, ex.: 2026/01
  archived: boolean;
  institutionId: string;
  createdAt: string;
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
