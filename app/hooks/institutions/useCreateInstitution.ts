import { useCallback, useEffect, useRef, useState } from "react";

import { CnpjRequestError, fetchCnpj } from "~/api/cnpj";
import { ApiRequestError } from "~/api/axios";
import { createInstitution } from "~/api/institutions";

import type { CnpjData } from "~/types/Cnpj";
import type {
  Institution,
  InstitutionRegisterRequest,
} from "~/types/Institution";

import { formatCnpjAddress, unmaskCnpj } from "~/utils/cnpj";

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

  const [cnpjData, setCnpjData] = useState<CnpjData | null>(null);
  const [isFallbackMode, setIsFallbackMode] = useState(false);
  const [lookingUp, setLookingUp] = useState(false);
  const [lookupError, setLookupError] = useState<string | null>(null);

  // Estado do cadastro
  const [submitting, setSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);

  // Identifica a consulta mais recente
  const requestId = useRef(0);

  useEffect(() => {
    return () => {
      requestId.current++;
    };
  }, []);

  const resetLookup = useCallback(() => {
    requestId.current++;

    setCnpjData(null);
    setIsFallbackMode(false);
    setLookingUp(false);
    setLookupError(null);
  }, []);

  const lookupCnpj = useCallback(
    async (cnpj: string) => {
      const digits = unmaskCnpj(cnpj);

      if (digits.length !== 14) {
        resetLookup();
        return;
      }

      const currentRequest = ++requestId.current;

      setLookingUp(true);
      setLookupError(null);
      setIsFallbackMode(false);
      setCnpjData(null);

      try {
        const data = await fetchCnpj(digits);

        // Ignora respostas de consultas anteriores
        if (currentRequest !== requestId.current) return;

        setCnpjData(data);
        setGeneralError(null);
      } catch (error) {
        if (currentRequest !== requestId.current) return;

        setCnpjData(null);
        setLookupError(describeCnpjError(error));

        if (error instanceof CnpjRequestError && error.status === 503) {
          setIsFallbackMode(true);
        }
      } finally {
        if (currentRequest === requestId.current) {
          setLookingUp(false);
        }
      }
    },
    [resetLookup],
  );

  const isReady = cnpjData !== null || isFallbackMode;

  const submitInstitution = async (data: InstitutionRegisterRequest) => {
    if (submitting || !isReady || lookingUp) return;

    setSubmitting(true);
    setFieldErrors({});
    setGeneralError(null);

    try {
      const institution = await createInstitution({
        name: cnpjData ? cnpjData.razaoSocial : data.name,

        acronym: data.acronym,
        cnpj: unmaskCnpj(data.cnpj),
        email: data.email,
        phone: data.phone.trim(),

        address: cnpjData ? formatCnpjAddress(cnpjData) : data.address,
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
  };

  return {
    cnpjData,
    isFallbackMode,
    lookingUp,
    lookupError,
    isReady,
    lookupCnpj,
    resetLookup,
    submitting,
    fieldErrors,
    generalError,
    submitInstitution,
  };
}
