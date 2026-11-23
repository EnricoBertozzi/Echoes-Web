import type { AuditLog } from "~/types/audit";

export interface EntityLabel {
  label: string;
  article: string;
  noun: string;
}

export const actionLabels: Record<string, string> = {
  ACCEPT_TERM: "Aceite de termo",
  ACTIVATE: "Ativação",
  ADD_DEVICE: "Dispositivo adicionado à turma",
  ADD_MEMBER: "Membro adicionado à turma",
  APPROVE: "Aprovação",
  ARCHIVE: "Arquivamento",
  CHANGE_INSTITUTION: "Troca de instituição",
  CLEAR_STUDENTS: "Alunos removidos da turma",
  COMPLETE_REGISTRATION: "Cadastro finalizado",
  CREATE: "Criação",
  DEACTIVATE: "Inativação",
  DELETE: "Exclusão",
  DELETION_RESTORE_REQUESTED: "Solicitação de restauração",
  DELETION_RESTORE_APPROVED: "Aprovação de restauração",
  DELETION_RESTORED: "Restauração concluída",
  DOWNLOAD: "Download",
  GENERATED: "Código gerado",
  GENERATE_CODE: "Código da turma gerado",
  JOIN: "Entrada na turma",
  LEAVE: "Saída da turma",
  LOGIN_ATTEMPT: "Tentativa de login",
  LOGIN_SUCCESS: "Login",
  "LOGIN_SUCCESS)": "Login",
  LOGOUT: "Logout",
  REMOVE_DEVICE: "Dispositivo removido da turma",
  REMOVE_MEMBER: "Membro removido da turma",
  REPLACE_FILE: "Arquivo substituído",
  RESET_PASSWORD: "Senha redefinida",
  TOGGLE_STATUS: "Alteração de status",
  UNARCHIVE: "Desarquivamento",
  UPDATE: "Alteração",
  UPDATE_CONTENT: "Conteúdo alterado",
  UPDATE_STATUS: "Status alterado",
  UPLOAD: "Envio de arquivo",
  VIEW_EMAIL: "E-mail visualizado",
};

const genericActionVerbs: Record<string, string> = {
  ACTIVATE: "ativou",
  APPROVE: "aprovou",
  ARCHIVE: "arquivou",
  CREATE: "criou",
  DEACTIVATE: "inativou",
  DELETE: "excluiu",
  UNARCHIVE: "desarquivou",
  UPDATE: "alterou",
};

export const actionPhrases: Record<string, string> = {
  ACCEPT_TERM: "aceitou um termo",
  ADD_DEVICE: "adicionou um dispositivo à turma",
  ADD_MEMBER: "adicionou um membro à turma",
  CHANGE_INSTITUTION: "trocou a instituição do dispositivo",
  CLEAR_STUDENTS: "removeu todos os alunos da turma",
  COMPLETE_REGISTRATION: "finalizou o cadastro",
  DELETION_RESTORE_REQUESTED: "solicitou a restauração",
  DELETION_RESTORE_APPROVED: "aprovou a restauração",
  DELETION_RESTORED: "concluiu a restauração",
  DOWNLOAD: "baixou o arquivo",
  GENERATED: "gerou um código de verificação",
  GENERATE_CODE: "gerou o código de acesso da turma",
  JOIN: "entrou na turma",
  LEAVE: "saiu da turma",
  LOGIN_ATTEMPT: "tentou entrar no sistema",
  LOGIN_SUCCESS: "entrou no sistema",
  "LOGIN_SUCCESS)": "entrou no sistema",
  LOGOUT: "saiu do sistema",
  REMOVE_DEVICE: "removeu um dispositivo da turma",
  REMOVE_MEMBER: "removeu um membro da turma",
  REPLACE_FILE: "substituiu o arquivo",
  RESET_PASSWORD: "redefiniu a senha",
  TOGGLE_STATUS: "alterou o status da instituição",
  UPDATE_CONTENT: "alterou o conteúdo do termo",
  UPDATE_STATUS: "alterou o status do termo",
  UPLOAD: "enviou o arquivo",
  VIEW_EMAIL: "visualizou o e-mail do usuário",
  ...genericActionVerbs,
};

export const entityLabels: Record<string, EntityLabel> = {
  Admin: {
    label: "Administrador",
    article: "o",
    noun: "administrador",
  },
  Animal: { label: "Animal", article: "o", noun: "animal" },
  Classroom: { label: "Turma", article: "a", noun: "turma" },
  DeletionRecovery: { label: "Restauração", article: "a", noun: "restauração" },
  ClassroomMaterial: {
    label: "Material da turma",
    article: "o",
    noun: "material",
  },
  ClinicalPreset: {
    label: "Caso clínico",
    article: "o",
    noun: "caso clínico",
  },
  Device: { label: "Dispositivo", article: "o", noun: "dispositivo" },
  DeviceScenario: {
    label: "Cenários do dispositivo",
    article: "a",
    noun: "configuração de cenários do dispositivo",
  },
  Institution: {
    label: "Instituição",
    article: "a",
    noun: "instituição",
  },
  Manager: { label: "Gestor", article: "o", noun: "gestor" },
  MFA: {
    label: "Verificação em duas etapas",
    article: "o",
    noun: "código de verificação",
  },
  Point: {
    label: "Ponto de ausculta",
    article: "o",
    noun: "ponto de ausculta",
  },
  Scenario: { label: "Cenário", article: "o", noun: "cenário" },
  Student: { label: "Aluno", article: "o", noun: "aluno" },
  Teacher: { label: "Professor", article: "o", noun: "professor" },
  Term: { label: "Termo", article: "o", noun: "termo" },
  User: { label: "Usuário", article: "o", noun: "usuário" },
};

export const roleLabels: Record<string, string> = {
  ADMIN: "Administrador",
  MANAGER: "Gestor",
  TEACHER: "Professor",
  STUDENT: "Aluno",
  DEVICE: "Dispositivo",
};

export const statusLabels: Record<string, string> = {
  SUCCESS: "Sucesso",
  FAILED: "Falha",
};

export const statusStyles: Record<string, string> = {
  SUCCESS: "text-green-700 bg-green-50",
  FAILED: "text-red-700 bg-red-50",
};

export const actionOptions = Object.entries(actionLabels)
  .map(([value, label]) => ({ value, label }))
  .sort((a, b) => a.label.localeCompare(b.label, "pt-BR"));

export const entityOptions = Object.entries(entityLabels)
  .map(([value, { label }]) => ({ value, label }))
  .sort((a, b) => a.label.localeCompare(b.label, "pt-BR"));

function describePhrase(log: AuditLog): string {
  const suffix = log.entityName ? ` ${log.entityName}` : "";
  const verb = genericActionVerbs[log.action];

  if (verb) {
    const entity = entityLabels[log.entity];

    if (!entity) {
      const rawEntity = log.entity
        ? ` ${log.entity.toLowerCase()}`
        : "";

      return `${verb}${rawEntity}${suffix}`;
    }

    return `${verb} ${entity.article} ${entity.noun}${suffix}`;
  }

  const phrase = actionPhrases[log.action];

  if (phrase) {
    return `${phrase}${suffix}`;
  }

  return `${log.action.toLowerCase()}${suffix}`;
}

export function describeActor(log: AuditLog): string {
  if (!log.actorName) {
    return log.userId ? `Usuário ${log.userId.slice(0, 8)}` : "Sistema";
  }

  if (!log.actorRole) {
    return log.actorName;
  }

  const role = roleLabels[log.actorRole] ?? log.actorRole;

  return `${log.actorName} (${role})`;
}

export function describeAuditLog(log: AuditLog): string {
  return `${describeActor(log)} ${describePhrase(log)}`;
}
