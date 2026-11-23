export type TermType =
  | 'TERMS_OF_USE'
  | 'PRIVACY_POLICY'
  | 'COOKIES_POLICY'
  | 'PROCESSING_OPERATIONS';

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
  type: TermType;
}

export interface CreateTermRequest {
  version: string;
  content: string;
  type: TermType;
  status?: TermStatus;
}

export interface UpdateTermContentRequest {
  content: string;
}

export interface UpdateTermStatusRequest {
  status: TermStatus;
}

export const termTypes: TermType[] = [
  'TERMS_OF_USE',
  'PRIVACY_POLICY',
  'COOKIES_POLICY',
  'PROCESSING_OPERATIONS'
];

export const requiredTermTypes: TermType[] = [
  'TERMS_OF_USE',
  'PRIVACY_POLICY',
  'COOKIES_POLICY',
];

export const termStatuses: TermStatus[] = [
  'DRAFT',
  'IN_REVIEW',
  'APPROVED',
  'PUBLISHED',
  'ARCHIVED',
];

export const termTypeLabels: Record<TermType, string> = {
  TERMS_OF_USE: 'Termos de Uso',
  PRIVACY_POLICY: 'Política de Privacidade',
  COOKIES_POLICY: 'Política de Cookies',
  PROCESSING_OPERATIONS: 'Relatório de Operações'
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

const versionPattern = /^(\d+)\.(\d+)\.(\d+)$/;

export type ParsedTermVersion = [number, number, number];

export function parseTermVersion(version: string): ParsedTermVersion | null {
  const match = versionPattern.exec(version.trim());

  if (!match) {
    return null;
  }

  return [Number(match[1]), Number(match[2]), Number(match[3])];
}

export function isValidTermVersion(version: string): boolean {
  return parseTermVersion(version) !== null;
}

/**
 * Retorna negativo, zero ou positivo, respectivamente, quando `a` é menor,
 * igual ou maior que `b`. Retorna `null` se alguma versão for inválida.
 */
export function compareTermVersions(a: string, b: string): number | null {
  const parsedA = parseTermVersion(a);
  const parsedB = parseTermVersion(b);

  if (!parsedA || !parsedB) {
    return null;
  }

  for (let index = 0; index < 3; index += 1) {
    const difference = parsedA[index] - parsedB[index];

    if (difference !== 0) {
      return difference;
    }
  }

  return 0;
}

/**
 * Sugere a próxima versão (incremento de patch) a partir da versão publicada.
 */
export function suggestNextTermVersion(currentVersion?: string | null): string {
  const parsed = currentVersion ? parseTermVersion(currentVersion) : null;

  if (!parsed) {
    return '1.0.0';
  }

  return `${parsed[0]}.${parsed[1]}.${parsed[2] + 1}`;
}

export function isTermContentEditable(status: TermStatus): boolean {
  return status === 'DRAFT';
}

export function isTermStatusEditable(status: TermStatus): boolean {
  return status !== 'PUBLISHED';
}

/**
 * Um termo só pode ser publicado quando a versão é maior que a versão
 * publicada atual do mesmo tipo. O backend não revalida isso no PATCH de
 * status, então a regra precisa ser garantida aqui.
 */
export function canPublishTermVersion(
  version: string,
  currentPublishedVersion?: string | null,
): boolean {
  if (!isValidTermVersion(version)) {
    return false;
  }

  if (!currentPublishedVersion) {
    return true;
  }

  const comparison = compareTermVersions(version, currentPublishedVersion);

  return comparison !== null && comparison > 0;
}

export function findPublishedTerm(
  terms: TermResponseDTO[],
  type: TermType,
): TermResponseDTO | undefined {
  return terms.find((term) => term.type === type && term.status === 'PUBLISHED');
}

