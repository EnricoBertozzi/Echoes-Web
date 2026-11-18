import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router";

import {
  FiHome,
  FiFileText,
  FiPhone,
  FiLock,
  FiCheckCircle,
  FiXCircle,
} from "react-icons/fi";

import { PageTitle } from "~/components/atoms/PageTitle";
import { Main } from "~/components/atoms/page/Main";
import { Button } from "~/components/atoms/Button";
import { Card } from "~/components/atoms/card/Card";
import { Alert } from "~/components/atoms/page/Alert";

import { ControlledTextField } from "~/components/molecules/controlled/ControlledTextField";

import { useInstitution } from "~/hooks/institutions/useInstitution";
import { useUpdateInstitution } from "~/hooks/institutions/useUpdateInstitution";

import type {
  Institution,
  InstitutionRegisterRequest,
} from "~/types/Institution";

import { maskCnpjInput } from "~/utils/cnpj";
import { SectionCard as InstitutionFormSection } from "~/components/molecules/SectionCard";

export default function EditInstitution() {
  const { institutionId } = useParams();

  const { institution, loading, error } = useInstitution(institutionId);

  if (loading) {
    return (
      <Main>
        <PageTitle title="Editar instituição" description={""} />

        <p className="flex h-40 items-center justify-center rounded-xl bg-stone-300 text-xl text-stone-500">
          Carregando instituição...
        </p>
      </Main>
    );
  }

  if (error || !institution) {
    return (
      <Main>
        <PageTitle title="Editar instituição" description={""} />

        <Alert message={error ?? "Instituição não encontrada"} type="error" />
      </Main>
    );
  }

  return <EditInstitutionForm key={institution.id} institution={institution} />;
}

function EditInstitutionForm({ institution }: { institution: Institution }) {
  const navigate = useNavigate();

  const detailPath = `/institutions/${institution.id}`;

  const form = useUpdateInstitution(institution, (updated) =>
    navigate(`/institutions/${updated.id}`),
  );

  const {
    control,
    handleSubmit,
    formState: { isSubmitting, isDirty },
  } = useForm<InstitutionRegisterRequest>({
    mode: "onChange",
    defaultValues: {
      name: institution.name,
      acronym: institution.acronym,
      cnpj: maskCnpjInput(institution.cnpj),
      email: institution.email,
      phone: institution.phone ?? "",
      address: institution.address,
    },
  });

  const submitting = isSubmitting || form.submitting;

  return (
    <Main>
      <PageTitle
        title="Editar instituição"
        description={`Altere os dados de ${institution.name}.`}
        backPath={detailPath}
      />

      <form
        className="flex w-full flex-col gap-6"
        onSubmit={handleSubmit(form.submitInstitution)}
      >
        <Card>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-main">
                <FiHome size={28} className="text-white" />
              </div>

              <div className="flex min-w-0 flex-col gap-1">
                <h2 className="text-xl font-bold text-slate-900">
                  {institution.name}
                </h2>

                <span className="text-sm text-slate-500">
                  {institution.acronym}
                </span>
              </div>
            </div>

            <div
              className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium ${
                institution.active
                  ? "bg-green-50 text-green-700"
                  : "bg-red-50 text-red-700"
              }`}
            >
              {institution.active ? (
                <FiCheckCircle size={16} />
              ) : (
                <FiXCircle size={16} />
              )}

              {institution.active ? "Ativa" : "Desativada"}
            </div>
          </div>
        </Card>

        <InstitutionFormSection
          title="Dados cadastrais"
          description="Identificação e endereço da instituição."
          icon={FiFileText}
        >
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <ControlledTextField
                id="cnpj"
                name="cnpj"
                label="CNPJ"
                placeholder="00.000.000/0000-00"
                control={control}
                readOnly
                rules={{
                  required: "O CNPJ é obrigatório.",
                }}
              />

              <span className="flex items-center gap-2 text-xs text-slate-500">
                <FiLock size={14} className="shrink-0" />O CNPJ não pode ser
                alterado.
              </span>
            </div>

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

            <div className="md:col-span-2">
              <ControlledTextField
                id="name"
                name="name"
                label="Razão social"
                placeholder="Digite a razão social"
                control={control}
                rules={{
                  required: "A razão social é obrigatória.",
                }}
              />
            </div>

            <div className="md:col-span-2">
              <ControlledTextField
                id="address"
                name="address"
                label="Endereço"
                placeholder="Digite o endereço"
                control={control}
                rules={{
                  required: "O endereço é obrigatório.",
                }}
              />
            </div>
          </div>
        </InstitutionFormSection>

        <InstitutionFormSection
          title="Informações de contato"
          description="Atualize os canais de comunicação da instituição."
          icon={FiPhone}
        >
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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

            <ControlledTextField
              id="phone"
              name="phone"
              label="Telefone"
              placeholder="Digite o telefone"
              control={control}
              rules={{}}
            />
          </div>
        </InstitutionFormSection>

        {form.generalError && (
          <Alert message={form.generalError} type="error" />
        )}

        <div className="mt-3 flex gap-3 justify-end">
          <Button
            label="Cancelar"
            variant="muted"
            type="button"
            className="w-full"
            disabled={submitting}
            onClick={() => navigate(detailPath)}
          />

          <Button
            label={submitting ? "Salvando..." : "Salvar alterações"}
            variant="primary"
            type="submit"
            className="w-full sm:w-48"
            disabled={!isDirty || submitting}
          />
        </div>
      </form>
    </Main>
  );
}
