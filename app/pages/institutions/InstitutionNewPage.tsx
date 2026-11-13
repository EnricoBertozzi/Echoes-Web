import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { FiAlertTriangle } from "react-icons/fi";
import { useNavigate } from "react-router";
import { Button } from "~/components/atoms/Button";

import { PageTitle } from "~/components/atoms/PageTitle";
import { Alert } from "~/components/atoms/page/Alert";
import { Main } from "~/components/atoms/page/Main";
import { ControlledTextField } from "~/components/molecules/controlled/ControlledTextField";

import { useCreateInstitution } from "~/hooks/useCreateInstitution";

import type { InstitutionRegisterRequest } from "~/types/Institution";

import { formatCnpjAddress, maskCnpjInput, unmaskCnpj } from "~/utils/cnpj";

const LOOKUP_DEBOUNCE_MS = 500;

export default function NewInstitution() {
  const navigate = useNavigate();

  const form = useCreateInstitution((institution) => {
    navigate(`/institutions/${institution.id}`);
  });

  const {
    control,
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = useForm<InstitutionRegisterRequest>({
    mode: "onChange",
    defaultValues: {
      cnpj: "",
      name: "",
      address: "",
      acronym: "",
      email: "",
      phone: "",
    },
  });

  // Monitora o CNPJ do formulário.
  const cnpj = useWatch({
    control,
    name: "cnpj",
  });

  // Aplica a máscara no campo CNPJ.
  useEffect(() => {
    const masked = maskCnpjInput(cnpj ?? "");

    if (cnpj !== masked) {
      setValue("cnpj", masked, {
        shouldValidate: false,
      });
    }
  }, [cnpj, setValue]);

  // Consulta automaticamente o CNPJ com debounce.
  useEffect(() => {
    const digits = unmaskCnpj(cnpj ?? "");

    // Invalida consultas anteriores.
    form.resetLookup();

    // Limpa os campos vindos da consulta anterior.
    setValue("name", "");
    setValue("address", "");

    if (digits.length !== 14) {
      return;
    }

    const timeout = setTimeout(() => {
      void form.lookupCnpj(digits);
    }, LOOKUP_DEBOUNCE_MS);

    return () => {
      clearTimeout(timeout);
    };
  }, [cnpj, form.lookupCnpj, form.resetLookup, setValue]);

  // Preenche automaticamente os dados retornados.
  useEffect(() => {
    if (!form.cnpjData) return;

    setValue("name", form.cnpjData.razaoSocial, {
      shouldValidate: true,
    });

    setValue("address", formatCnpjAddress(form.cnpjData), {
      shouldValidate: true,
    });
  }, [form.cnpjData, setValue]);

  const isReadOnly = form.cnpjData !== null && !form.isFallbackMode;

  return (
    <Main>
      <PageTitle
        title="Nova instituição"
        description="Informe o CNPJ para buscar os dados automaticamente na Receita Federal."
        backPath="/institutions"
      />

      <form
        className="flex flex-col"
        onSubmit={handleSubmit(form.submitInstitution)}
      >
        <div className="flex flex-col gap-2">
          <ControlledTextField
            id="cnpj"
            name="cnpj"
            label="CNPJ"
            placeholder="00.000.000/0000-00"
            control={control}
            rules={{
              required: "O CNPJ é obrigatório.",
              validate: (value) =>
                unmaskCnpj(value).length === 14 ||
                "O CNPJ deve conter 14 dígitos.",
            }}
          />

          {form.lookingUp && (
            <Alert message="Consultando CNPJ…" type={"muted"} />
          )}

          {form.lookupError && !form.isFallbackMode && (
            <Alert message={form.lookupError} type={"error"} />
          )}

          {form.fieldErrors.cnpj && (
            <Alert message={form.fieldErrors.cnpj} type={"error"} />
          )}
        </div>

        {form.isFallbackMode && (
          <div className="mt-6 flex items-start gap-3 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3">
            <FiAlertTriangle
              size={22}
              className="mt-0.5 shrink-0 text-amber-600"
            />

            <div className="text-sm text-amber-900">
              <p className="font-semibold">
                Não foi possível consultar a Receita Federal.
              </p>

              <p>Preencha os dados manualmente abaixo.</p>
            </div>
          </div>
        )}

        {form.isReady && (
          <div className="mt-6 flex flex-col gap-6">
            <div>
              <ControlledTextField
                id="name"
                name="name"
                label="Razão social"
                placeholder="Digite a razão social"
                control={control}
                readOnly={isReadOnly}
                rules={{
                  required: "A razão social é obrigatória.",
                }}
              />

              {form.fieldErrors.name && (
                <FieldError message={form.fieldErrors.name} />
              )}
            </div>

            <div>
              <ControlledTextField
                id="address"
                name="address"
                label="Endereço"
                placeholder="Digite o endereço"
                control={control}
                readOnly={isReadOnly}
                rules={{
                  required: "O endereço é obrigatório.",
                }}
              />

              {form.fieldErrors.address && (
                <FieldError message={form.fieldErrors.address} />
              )}
            </div>

            {isReadOnly && (
              <span className="text-xs text-slate-500">
                Razão social e endereço preenchidos automaticamente a partir do
                CNPJ.
              </span>
            )}

            <div>
              <ControlledTextField
                id="acronym"
                name="acronym"
                label="Sigla"
                placeholder="Digite a sigla"
                control={control}
                rules={{
                  required: "A sigla é obrigatória.",
                }}
              />

              {form.fieldErrors.acronym && (
                <FieldError message={form.fieldErrors.acronym} />
              )}
            </div>

            <div>
              <ControlledTextField
                id="email"
                name="email"
                label="E-mail"
                placeholder="Digite o e-mail"
                control={control}
                rules={{
                  required: "O e-mail é obrigatório.",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Informe um e-mail válido.",
                  },
                }}
              />

              {form.fieldErrors.email && (
                <FieldError message={form.fieldErrors.email} />
              )}
            </div>

            <div>
              <ControlledTextField
                id="phone"
                name="phone"
                label="Telefone"
                placeholder="Digite o telefone"
                control={control}
                rules={{}}
              />

              {form.fieldErrors.phone && (
                <FieldError message={form.fieldErrors.phone} />
              )}
            </div>
          </div>
        )}

        {form.generalError && (
          <p className="mt-4 text-sm text-red-500">{form.generalError}</p>
        )}

        <div className="mt-2 flex justify-end gap-2">
          <Button
            variant="muted"
            label={"Cancelar"}
            onClick={() => navigate("/institutions")}
          />

          <Button
            variant="primary"
            disabled={
              !form.isReady || form.lookingUp || form.submitting || isSubmitting
            }
            label={"Cadastrar"}
            onClick={() => navigate("/institutions")}
          />
        </div>
      </form>
    </Main>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;

  return <span className="text-sm text-red-500">{message}</span>;
}
