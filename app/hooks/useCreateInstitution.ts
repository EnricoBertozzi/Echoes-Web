import { useState } from "react";
import type { FormEvent } from "react";
import { ApiRequestError, createInstitution } from "~/api/institutions";
import type { Institution } from "~/types/Institution";
import { unmaskCnpj } from "~/utils/cnpj";

export function useCreateInstitution(onCreated?: (institution: Institution) => void) {
  const [name, setName] = useState("");
  const [acronym, setAcronym] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
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
      const institution = await createInstitution({
        name,
        acronym,
        cnpj: unmaskCnpj(cnpj),
        email,
        phone: phone || null,
        address,
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
