import { useState } from "react";

import { ApiRequestError } from "~/api/axios";
import { updateInstitution } from "~/api/institutions";

import type {
  Institution,
  InstitutionRegisterRequest,
} from "~/types/Institution";

import { unmaskCnpj } from "~/utils/cnpj";

export function useUpdateInstitution(
  institution: Institution,
  onUpdated?: (institution: Institution) => void,
) {
  const [submitting, setSubmitting] = useState(false);

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const [generalError, setGeneralError] = useState<string | null>(null);

  async function submitInstitution(data: InstitutionRegisterRequest) {
    if (submitting) return;

    setSubmitting(true);
    setFieldErrors({});
    setGeneralError(null);

    try {
      const updated = await updateInstitution(institution.id, {
        name: data.name.trim(),
        acronym: data.acronym.trim(),
        cnpj: unmaskCnpj(institution.cnpj),
        email: data.email.trim(),
        phone: data.phone?.trim() || null,
        address: data.address.trim(),
      });

      onUpdated?.(updated);
    } catch (error) {
      if (error instanceof ApiRequestError) {
        if (error.fieldErrors) {
          setFieldErrors(error.fieldErrors);
        } else {
          setGeneralError(error.message);
        }
      } else {
        setGeneralError("Erro ao atualizar instituição.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return {
    submitting,
    fieldErrors,
    generalError,
    submitInstitution,
  };
}
