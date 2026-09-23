/** Remove qualquer caractere que não seja dígito. */
export function unmaskCnpj(value: string): string {
  return value.replace(/\D/g, "");
}

/** Formata 14 dígitos como "00.000.000/0000-00". Retorna o valor original se não tiver 14 dígitos. */
export function formatCnpj(value: string): string {
  const digits = unmaskCnpj(value);
  if (digits.length !== 14) return value;
  return digits.replace(
    /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
    "$1.$2.$3/$4-$5",
  );
}

/** Valida os dígitos verificadores de um CNPJ (aceita com ou sem máscara). */
export function isValidCnpj(value: string): boolean {
  const cnpj = unmaskCnpj(value);
  if (cnpj.length !== 14 || /^(\d)\1{13}$/.test(cnpj)) return false;

  const calcDigit = (base: string): number => {
    const weights =
      base.length === 12
        ? [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
        : [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    const sum = base
      .split("")
      .reduce((acc, digit, i) => acc + Number(digit) * (weights[i] ?? 0), 0);
    const rest = sum % 11;
    return rest < 2 ? 0 : 11 - rest;
  };

  const base = cnpj.slice(0, 12);
  const digit1 = calcDigit(base);
  const digit2 = calcDigit(base + String(digit1));

  return cnpj === base + String(digit1) + String(digit2);
}

import type { CnpjData } from "~/types/Cnpj";

/** Aplica máscara progressiva em um CNPJ conforme o usuário digita. */
export function maskCnpjInput(value: string): string {
  const digits = unmaskCnpj(value).slice(0, 14);
  return digits
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2");
}

/**
 * Monta uma linha de endereço a partir dos campos retornados pela BrasilAPI.
 * Usado tanto no envio do cadastro quanto na pré-visualização read-only.
 */
export function formatCnpjAddress(data: CnpjData): string {
  const parts: string[] = [];
  if (data.logradouro) parts.push(data.logradouro);
  if (data.numero) parts.push(data.numero);
  if (data.complemento) parts.push(data.complemento);
  if (data.bairro) parts.push(data.bairro);
  if (data.municipio) parts.push(data.municipio);
  if (data.uf) parts.push(data.uf);
  if (data.cep) parts.push(`CEP: ${data.cep}`);
  return parts.join(", ");
}
