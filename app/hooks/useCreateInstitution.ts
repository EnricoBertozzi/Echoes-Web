import { useCallback, useEffect, useState } from "react";
import type { FormEvent } from "react";
import { CnpjRequestError, fetchCnpj } from "~/api/cnpj";
import type { CnpjData } from "~/types/Cnpj";
import type { Institution } from "~/types/Institution";
import { formatCnpjAddress, maskCnpjInput, unmaskCnpj } from "~/utils/cnpj";
import { ApiRequestError } from "~/api/axios";
import { createInstitution } from "~/api/institutions";

/**
 * Debounce da consulta à BrasilAPI. Evita uma requisição por dígito
 * enquanto o usuário digita o CNPJ (14 dígitos podem gerar 13 chamadas).
 */
const LOOKUP_DEBOUNCE_MS = 500;

function describeCnpjError(error: unknown): string {
  if (error instanceof CnpjRequestError) {
    switch (error.status) {
      case 400:
        return "Dígitos verificadores do CNPJ são inválidos.";
      case 404:
        return "CNPJ não encontrado na Receita Federal.";
      case 503:
        return "Não foi possível consultar a Receita Federal.";
      default:
        return error.message;
    }
  }
  return "Erro ao consultar CNPJ";
}

export function useCreateInstitution(
  onCreated?: (institution: Institution) => void,
) {
  // ---- Estado do CNPJ e da consulta ----------------------------------------
  const [cnpj, setCnpjState] = useState("");
  const [cnpjData, setCnpjData] = useState<CnpjData | null>(null);
  const [isFallbackMode, setIsFallbackMode] = useState(false);
  const [lookingUp, setLookingUp] = useState(false);
  const [lookupError, setLookupError] = useState<string | null>(null);

  // ---- Campos preenchidos manualmente (liberados após o lookup) ------------
  // No 3A esses campos só incluem sigla/email/telefone;
  // no 3D (fallback) name e address também viram manuais.
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [acronym, setAcronym] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  // ---- Estado do submit ----------------------------------------------------
  const [submitting, setSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);

  const cnpjDigits = unmaskCnpj(cnpj);

  // Consulta automática (com debounce) assim que o CNPJ tiver 14 dígitos.
  // Quando o usuário volta a editar (< 14 dígitos), esconde o formulário.
  useEffect(() => {
    if (cnpjDigits.length !== 14) {
      setCnpjData(null);
      setIsFallbackMode(false);
      setLookupError(null);
      setLookingUp(false);
      return;
    }

    let cancelled = false;
    const handle = setTimeout(async () => {
      setLookingUp(true);
      setLookupError(null);
      setIsFallbackMode(false);
      try {
        const data = await fetchCnpj(cnpjDigits);
        if (cancelled) return;
        setCnpjData(data);
        setGeneralError(null);
      } catch (error) {
        if (cancelled) return;
        setCnpjData(null);
        setLookupError(describeCnpjError(error));
        // 503 → Estado 3D: libera o formulário manual
        if (error instanceof CnpjRequestError && error.status === 503) {
          setIsFallbackMode(true);
        }
      } finally {
        if (!cancelled) setLookingUp(false);
      }
    }, LOOKUP_DEBOUNCE_MS);

    return () => {
      cancelled = true;
      clearTimeout(handle);
    };
  }, [cnpjDigits]);

  /** Aplica máscara no input e limpa o erro de CNPJ anterior. */
  const setCnpj = useCallback((value: string) => {
    setCnpjState(maskCnpjInput(value));
    setFieldErrors((prev) => {
      if (!prev.cnpj) return prev;
      const { cnpj: _omit, ...rest } = prev;
      return rest;
    });
  }, []);

  /** Limpa manualmente o resultado da consulta (útil para retry). */
  const resetLookup = useCallback(() => {
    setCnpjData(null);
    setLookupError(null);
    setIsFallbackMode(false);
  }, []);

  // 3A → cnpjData preenchido; 3D → fallback ativo. Só habilita Cadastrar nesses dois.
  const isReady = cnpjData !== null || isFallbackMode;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (submitting || !isReady) return;

    setSubmitting(true);
    setFieldErrors({});
    setGeneralError(null);

    try {
      const institution = await createInstitution({
        // No 3A vem da Receita (read-only); no 3D vem do input manual
        name: cnpjData ? cnpjData.razaoSocial : name,
        acronym,
        cnpj: cnpjDigits,
        email,
        phone: phone.trim() || null,
        // No 3A vem da Receita (read-only); no 3D vem do input manual
        address: cnpjData ? formatCnpjAddress(cnpjData) : address,
      });
      onCreated?.(institution);
    } catch (error) {
      if (error instanceof ApiRequestError) {
        if (error.fieldErrors) {
          setFieldErrors(error.fieldErrors);
        } else {
          setGeneralError(error.message);
        }
      } else {
        setGeneralError("Erro ao cadastrar instituição");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return {
    // CNPJ
    cnpj,
    setCnpj,
    cnpjData,
    isFallbackMode,
    lookingUp,
    lookupError,
    resetLookup,
    isReady,

    // Campos manuais
    name,
    setName,
    address,
    setAddress,
    acronym,
    setAcronym,
    email,
    setEmail,
    phone,
    setPhone,

    // Submit
    submitting,
    fieldErrors,
    generalError,
    handleSubmit,
  };
}
