export type TermType =
  | 'TERMS_OF_USE'
  | 'PRIVACY_POLICY'
  | 'DATA_DELETION_POLICY'
  | 'MARKETING_CONSENT'
  | 'COOKIES_POLICY';

export type TermStatus = 'ARCHIVED' | 'PUBLISHED' | 'DRAFT' | 'IN_REVIEW' | 'APPROVED';

export interface TermResponseDTO {
  id: number;
  version: string;
  content: string; // Markdown
  type: TermType;
  status: TermStatus;
  timestamp: string; // Instant, ISO-8601
}

export interface AcceptTermRequest {
  email: string;
  type: TermType;
}

export const termTypes: TermType[] = [
  'TERMS_OF_USE',
  'PRIVACY_POLICY',
  'DATA_DELETION_POLICY',
  'MARKETING_CONSENT',
  'COOKIES_POLICY',
];

export const termTypeLabels: Record<TermType, string> = {
  TERMS_OF_USE: 'Termos de Uso',
  PRIVACY_POLICY: 'Política de Privacidade',
  DATA_DELETION_POLICY: 'Política de Exclusão de Dados',
  MARKETING_CONSENT: 'Consentimento de Marketing',
  COOKIES_POLICY: 'Política de Cookies',
};

export const termStatusLabels: Record<TermStatus, string> = {
  ARCHIVED: 'Arquivado',
  PUBLISHED: 'Publicado',
  DRAFT: 'Rascunho',
  IN_REVIEW: 'Em revisão',
  APPROVED: 'Aprovado',
};

export function formatTermTimestamp(timestamp: string): string {
  const date = new Date(timestamp);

  if (Number.isNaN(date.getTime())) {
    return timestamp;
  }

  return date.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
