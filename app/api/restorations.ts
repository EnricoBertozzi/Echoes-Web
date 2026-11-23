import type { Page } from "~/types/user";
import { api } from "./axios";

export const restorationTypes = {
  CLASSROOM: "Turma",
  INSTITUTION: "Instituição",
} as const;

export const restorationStatuses = {
  AVAILABLE: "Disponível",
  PENDING_APPROVAL: "Aguardando aprovação",
  APPROVED: "Aprovada",
  EXECUTED: "Restaurada",
} as const;

export type RestorationType = keyof typeof restorationTypes;
export type RestorationStatus = keyof typeof restorationStatuses;

export interface RestorationSummary {
  type: RestorationType;
  id: string;
  name: string;
  deletedAt: string | null;
  status: RestorationStatus;
  rosterRecorded: boolean;
}

export interface SkippedMember {
  membershipId: string;
  reason: string;
}

export interface RestorationDetail {
  target: RestorationSummary;
  canApprove: boolean;
  canExecute: boolean;
  blockedReason: string | null;
  recoverableMembers: number;
  skippedMembers: SkippedMember[];
  restoredAt: string | null;
}

export interface RestorationResult {
  restoredAt: string;
  recoveredMembers: number;
  skippedMembers: SkippedMember[];
}

const BASE = "/api/v1/admin/restorations";

export async function listRestorations(params: {
  page: number;
  size: number;
  type?: string;
  status?: string;
}) {
  return (await api.get<Page<RestorationSummary>>(BASE, { params })).data;
}

export async function getRestoration(type: string, id: string) {
  return (await api.get<RestorationDetail>(`${BASE}/${encodeURIComponent(type)}/${encodeURIComponent(id)}`)).data;
}

export async function reviewRestoration(target: RestorationSummary, action: "request" | "approve") {
  await api.post(`${BASE}/${target.type}/${target.id}/${action}`);
}

export async function executeRestoration(target: RestorationSummary) {
  return (await api.post<RestorationResult>(`${BASE}/${target.type}/${target.id}/execute`)).data;
}
