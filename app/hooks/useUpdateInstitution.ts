import { useState } from "react";
import type { FormEvent } from "react";
import { ApiRequestError, updateInstitution } from "~/api/institutions";
import { formatCnpj, unmaskCnpj } from "~/utils/cnpj";
import type { Institution } from "~/types/Institution";

export function useUpdateInstitution(
  institution: Institution,
  onUpdated?: (institution: Institution) => void,
) {
  const [name, setName] = useState(institution.name);
  const [acronym, setAcronym] = useState(institution.acronym);
  const [cnpj, setCnpj] = useState(formatCnpj(institution.cnpj));
  const [email, setEmail] = useState(institution.email);
  const [phone, setPhone] = useState(institution.phone ?? "");
  const [address, setAddress] = useState(institution.address);
  const [submitting, setSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (submitting) {
      return;
    }

    setSubmitting(true);
    setFieldErrors({});
    setGeneralError(null);

    try {
      const updated = await updateInstitution(institution.id, {
        name,
        acronym,
        cnpj: unmaskCnpj(cnpj),
        email,
        phone: phone || null,
        address,
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
        setGeneralError("Erro ao editar instituição");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return {
    name,
    setName,
    acronym,
    setAcronym,
    cnpj,
    setCnpj,
    email,
    setEmail,
    phone,
    setPhone,
    address,
    setAddress,
    submitting,
    fieldErrors,
    generalError,
    handleSubmit,
  };
}
