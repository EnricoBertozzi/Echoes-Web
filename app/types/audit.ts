
import type { Page } from "~/types/user";

export type AuditStatus = "SUCCESS" | "FAILED";

export interface AuditLog {
  id: string;
  userId: string | null;
  actorName: string | null;
  actorRole: string | null;
  actorInstitutionName: string | null;
  action: string;
  entity: string;
  entityName: string | null;
  status: AuditStatus;
  details: string | null;
  ip: string | null;
  entityId: string | null;
  institutionId: string | null;
  institutionName?: string | null;
  timestamp: string;
}

export type AuditPage = Page<AuditLog>;

export interface AuditFilters {
  page: number;
  size: number;
  institutionId?: string;
  entity?: string;
  action?: string;
  status?: AuditStatus;
}

export const AUDIT_ENTITY_LABELS: Readonly<Record<string, string>> = {
  Admin: "Administrador",
  Animal: "Animal",
  Point: "Ponto de ausculta",
  Scenario: "Cenário",
  Institution: "Instituição",
  Device: "Dispositivo",
  DeviceScenario: "Cenário do dispositivo",
  Classroom: "Turma",
  DeletionRecovery: "Restauração",
  ClassroomDevice: "Vínculo Turma-Dispositivo",
  Teacher: "Professor",
  Student: "Estudante",
  Manager: "Gestor",
  User: "Usuário",
  Term: "Termo",
  MFA: "Autenticação multifator",
};

export const AUDIT_ACTION_LABELS: Readonly<Record<string, string>> = {
  CREATE: "Criação",
  UPDATE: "Atualização",
  DELETE: "Exclusão",
  DELETION_RESTORE_REQUESTED: "Solicitação de restauração",
  DELETION_RESTORE_APPROVED: "Aprovação de restauração",
  DELETION_RESTORED: "Restauração concluída",
  APPROVE: "Aprovação",
  CHANGE_INSTITUTION: "Alteração de instituição",
  ACTIVATE: "Ativação",
  DEACTIVATE: "Desativação",
  ARCHIVE: "Arquivamento",
  UNARCHIVE: "Desarquivamento",
  CLEAR_STUDENTS: "Remoção de estudantes",
  GENERATE_CODE: "Geração de código",
  GENERATED: "Geração",
  JOIN: "Entrada em turma",
  LEAVE: "Saída da turma",
  REMOVE_MEMBER: "Remoção de membro",
  ADD_MEMBER: "Inclusão de membro",
  ADD_DEVICE: "Vínculo de dispositivo",
  REMOVE_DEVICE: "Desvínculo de dispositivo",
  TOGGLE_STATUS: "Alteração de status",
  COMPLETE_REGISTRATION: "Conclusão de cadastro",
  ACCEPT_TERM: "Aceite de termo",
  LOGIN_ATTEMPT: "Tentativa de acesso",
  LOGIN_SUCCESS: "Acesso realizado",
  LOGOUT: "Encerramento de sessão",
};

export const AUDIT_STATUS_LABELS: Record<AuditStatus, string> = {
  SUCCESS: "Sucesso",
  FAILED: "Falha",
};

export function auditEntityLabel(entity: string): string {
  return AUDIT_ENTITY_LABELS[entity] ?? entity;
}

export function auditActionLabel(action: string): string {
  return AUDIT_ACTION_LABELS[action] ?? action.replaceAll("_", " ");
}

export function formatAuditTimestamp(iso: string): string {
  const date = new Date(iso);

  if (Number.isNaN(date.getTime())) {
    return iso;
  }

  return date.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}
