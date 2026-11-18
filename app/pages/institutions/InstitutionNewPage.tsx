import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useNavigate } from "react-router";

import {
  FiAlertTriangle,
  FiCheckCircle,
  FiFileText,
  FiHome,
  FiInfo,
  FiLock,
  FiMail,
  FiUser,
} from "react-icons/fi";

import { Button } from "~/components/atoms/Button";
import { PageTitle } from "~/components/atoms/PageTitle";
import { Alert } from "~/components/atoms/page/Alert";
import { Main } from "~/components/atoms/page/Main";

import { ControlledTextField } from "~/components/molecules/controlled/ControlledTextField";

import { useCreateInstitution } from "~/hooks/useCreateInstitution";

import type { InstitutionCreateForm } from "~/types/Institution";

import { formatCnpjAddress, maskCnpjInput, unmaskCnpj } from "~/utils/cnpj";
import { SectionCard as InstitutionFormSection } from "~/components/molecules/SectionCard";

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
  } = useForm<InstitutionCreateForm>({
    mode: "onChange",
    defaultValues: {
      cnpj: "",
      name: "",
      address: "",
      acronym: "",
      email: "",
      phone: "",
      managerName: "",
      managerEmail: "",
    },
  });

  const cnpj = useWatch({
    control,
    name: "cnpj",
  });

  useEffect(() => {
    const masked = maskCnpjInput(cnpj ?? "");

    if (cnpj !== masked) {
      setValue("cnpj", masked, {
        shouldValidate: false,
      });
    }
  }, [cnpj, setValue]);

  useEffect(() => {
    const digits = unmaskCnpj(cnpj ?? "");

    form.resetLookup();

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

  const submitting = isSubmitting || form.submitting;

  return (
    <Main>
      <PageTitle
        title="Nova instituição"
        description="Cadastre uma instituição e seu gestor responsável."
        backPath="/institutions"
      />

      <form
        className="flex w-full flex-col gap-6"
        onSubmit={handleSubmit(form.submitInstitution)}
      >
        <InstitutionFormSection
          title="Identificação da instituição"
          description="Informe o CNPJ para consultar os dados cadastrais automaticamente."
          icon={FiFileText}
        >
          <div className="flex flex-col gap-4">
            <div className="w-full max-w-md">
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
            </div>

            {form.lookingUp && (
              <Alert message="Consultando CNPJ..." type="muted" />
            )}

            {form.lookupError && !form.isFallbackMode && (
              <Alert message={form.lookupError} type="error" />
            )}



            {isReadOnly && !form.lookingUp && (
              <div className="flex items-center gap-2 text-sm font-medium text-green-700">
                <FiCheckCircle size={18} className="shrink-0" />
                Dados cadastrais encontrados.
              </div>
            )}

            {!form.isReady && !form.lookingUp && !form.lookupError && (
              <div className="flex items-start gap-2 text-sm text-slate-500">
                <FiInfo size={18} className="mt-0.5 shrink-0" />

                <p>
                  Após a consulta, os campos necessários para o cadastro serão
                  disponibilizados.
                </p>
              </div>
            )}
          </div>
        </InstitutionFormSection>

        {form.isFallbackMode && (
          <div className="flex items-start gap-3 rounded-xl border border-amber-300 bg-amber-50 p-4">
            <FiAlertTriangle
              size={24}
              className="mt-0.5 shrink-0 text-amber-600"
            />

            <div className="flex flex-col gap-1 text-sm text-amber-900">
              <p className="font-semibold">Consulta indisponível</p>

              <p>
                Não foi possível consultar a Receita Federal. Preencha os dados
                da instituição manualmente.
              </p>
            </div>
          </div>
        )}

        {form.isReady && (
          <>

            <InstitutionFormSection
              title="Dados institucionais"
              description="Informações gerais e de contato da instituição."
              icon={FiHome}
            >
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div className="flex flex-col gap-1 md:col-span-2">
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

]                </div>

                <div className="flex flex-col gap-1">
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

]                </div>

                <div className="flex flex-col gap-2 md:col-span-3">
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

]
                  {isReadOnly && (
                    <div className="flex items-start gap-2 text-xs text-slate-500">
                      <FiLock size={14} className="shrink-0" />

                      <span>
                        Razão social e endereço preenchidos automaticamente a
                        partir do CNPJ.
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <hr className="border-slate-200" />

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="flex flex-col gap-1">
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

]                </div>

                <div className="flex flex-col gap-1">
                  <ControlledTextField
                    id="phone"
                    name="phone"
                    label="Telefone"
                    placeholder="Digite o telefone"
                    control={control}
                    rules={{}}
                  />

]                </div>
              </div>
            </InstitutionFormSection>

            <InstitutionFormSection
              title="Gestor responsável"
              description="Informe os dados do primeiro gestor da instituição."
              icon={FiUser}
            >
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="flex flex-col gap-1">
                  <ControlledTextField
                    id="managerName"
                    name="managerName"
                    label="Nome do gestor"
                    placeholder="Digite o nome completo"
                    control={control}
                    rules={{
                      required: "O nome do gestor é obrigatório.",
                    }}
                  />

]                </div>

                <div className="flex flex-col gap-1">
                  <ControlledTextField
                    id="managerEmail"
                    name="managerEmail"
                    label="E-mail do gestor"
                    placeholder="Digite o e-mail"
                    control={control}
                    rules={{
                      required: "O e-mail do gestor é obrigatório.",
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Informe um e-mail válido.",
                      },
                    }}
                  />

]                </div>
              </div>

      
            </InstitutionFormSection>
          </>
        )}

        {/* Erro geral */}
        {form.generalError && (
          <Alert message={form.generalError} type="error" />
        )}

       
        
          <span className="text-sm text-slate-500">
            {!form.isReady
              ? "Informe o CNPJ para continuar."
              : "Revise os dados antes de cadastrar."}
          </span>

          <div className="mt-3 flex gap-3 justify-end">
            <Button
              variant="muted"
              label="Cancelar"
              type="button"
              className="w-full sm:w-32"
              disabled={submitting}
              onClick={() => navigate("/institutions")}
            />

            <Button
              variant="primary"
              type="submit"
              className="w-full sm:w-52"
              disabled={!form.isReady || form.lookingUp || submitting}
              label={submitting ? "Cadastrando..." : "Cadastrar instituição"}
            />
          </div>
      </form>
    </Main>
  );
}
