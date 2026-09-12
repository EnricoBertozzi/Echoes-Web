export interface Institution {
  id: string;
  name: string;
  acronym: string;
  cnpj: string;
  email: string;
  phone: string | null;
  active: boolean;
}

export interface InstitutionPayload {
  name: string;
  acronym: string;
  cnpj: string;
  email: string;
  phone: string | null;
}

export interface InstitutionListParams {
  name?: string;
  page?: number;
  size?: number;
}
