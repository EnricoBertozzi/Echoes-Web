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
  phone: string;
}

// dados do primeiro gestor, que recebe o convite por e-mail
export interface ManagerRegisterRequest {
  name: string;
  surname: string;
  email: string;
}

// corpo do POST /api/v1/institutions: a instituição só nasce com o seu gestor
export interface InstitutionCreateRequest {
  institution: InstitutionRegisterRequest;
  manager: ManagerRegisterRequest;
}

// campos do formulário de cadastro (instituição + gestor)
export interface InstitutionCreateForm extends InstitutionRegisterRequest {
  managerName: string;
  managerSurname: string;
  managerEmail: string;
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
