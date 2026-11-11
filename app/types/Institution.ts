export interface Institution {
  id: string;
  name: string;
  acronym: string;
  cnpj: string;
  email: string;
  phone: string | null;
  address: string;
  active: boolean;
}

export interface InstitutionRegisterRequest {
  cnpj: string;
  name: string;
  address: string;
  acronym: string;
  email: string;
  phone: string | null;
}

export interface InstitutionUpdateRequest {
  name: string;
  acronym: string;
  cnpj: string;
  email: string;
  phone: string | null;
  address: string;
}

export interface InstitutionPage {
  content: Institution[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}
